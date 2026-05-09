using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using DomainTransaction = HexaTrack.Api.Domain.Entities.Transaction;

namespace HexaTrack.Api.Application.Services;

public interface ITransactionService
{
    Task<IReadOnlyCollection<TransactionDto>> ListAsync(DateOnly? from, DateOnly? to, CancellationToken cancellationToken);
    Task<PagedResult<TransactionDto>> SearchAsync(TransactionSearchRequest request, CancellationToken cancellationToken);
    Task<TransactionDto> CreateAsync(CreateTransactionRequest request, CancellationToken cancellationToken);
}

public sealed class TransactionService(
    IUserScopedRepository<DomainTransaction> transactions,
    IUserScopedRepository<Account> accounts,
    IUserScopedRepository<Category> categories,
    IUserScopedRepository<Tag> tags,
    ICurrentUser currentUser,
    ICurrentWorkspace currentWorkspace,
    IUnitOfWork unitOfWork) : ITransactionService
{
    public async Task<IReadOnlyCollection<TransactionDto>> ListAsync(DateOnly? from, DateOnly? to, CancellationToken cancellationToken)
    {
        IQueryable<DomainTransaction> query = transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Include(x => x.TransactionTags).ThenInclude(x => x.Tag)
            .OrderByDescending(x => x.OccurredOn).ThenByDescending(x => x.CreatedAt);

        if (from.HasValue)
        {
            query = query.Where(x => x.OccurredOn >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(x => x.OccurredOn <= to.Value);
        }

        return await query.Select(x => new TransactionDto(
            x.Id,
            x.AccountId,
            x.CategoryId,
            x.Type,
            x.Amount,
            x.Currency,
            x.Merchant,
            x.Note,
            x.OccurredOn,
            x.TransactionTags.Select(tt => new TagDto(tt.TagId, tt.Tag!.Name)).ToList()))
            .ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<TransactionDto>> SearchAsync(TransactionSearchRequest request, CancellationToken cancellationToken)
    {
        int page = Math.Max(request.Page, 1);
        int pageSize = Math.Clamp(request.PageSize, 1, 100);
        IQueryable<DomainTransaction> query = transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Include(x => x.TransactionTags).ThenInclude(x => x.Tag);

        if (request.From.HasValue)
        {
            query = query.Where(x => x.OccurredOn >= request.From.Value);
        }

        if (request.To.HasValue)
        {
            query = query.Where(x => x.OccurredOn <= request.To.Value);
        }

        if (request.AccountId.HasValue)
        {
            query = query.Where(x => x.AccountId == request.AccountId.Value);
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == request.CategoryId.Value);
        }

        if (request.TagId.HasValue)
        {
            query = query.Where(x => x.TransactionTags.Any(tt => tt.TagId == request.TagId.Value));
        }

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            string term = request.Query.Trim().ToLowerInvariant();
            query = query.Where(x =>
                (x.Merchant != null && x.Merchant.ToLower().Contains(term)) ||
                (x.Note != null && x.Note.ToLower().Contains(term)));
        }

        if (request.TransfersOnly)
        {
            query = query.Where(x => x.Type == TransactionType.TransferOut || x.Type == TransactionType.TransferIn);
        }
        else if (request.Type.HasValue)
        {
            query = query.Where(x => x.Type == request.Type.Value);
        }

        int totalCount = await query.CountAsync(cancellationToken);
        List<TransactionDto> items = await query
            .OrderByDescending(x => x.OccurredOn)
            .ThenByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new TransactionDto(
                x.Id,
                x.AccountId,
                x.CategoryId,
                x.Type,
                x.Amount,
                x.Currency,
                x.Merchant,
                x.Note,
                x.OccurredOn,
                x.TransactionTags.Select(tt => new TagDto(tt.TagId, tt.Tag!.Name)).ToList()))
            .ToListAsync(cancellationToken);

        return new PagedResult<TransactionDto>(items, page, pageSize, totalCount);
    }

    public Task<TransactionDto> CreateAsync(CreateTransactionRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.Amount <= 0)
            {
                throw new InvalidOperationException("Amount must be greater than zero.");
            }

            Account account = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId).SingleOrDefaultAsync(x => x.Id == request.AccountId && !x.IsArchived, ct)
                ?? throw new KeyNotFoundException("Account not found.");

            string? idempotencyKey = string.IsNullOrWhiteSpace(request.IdempotencyKey) ? null : request.IdempotencyKey.Trim();
            if (idempotencyKey is not null)
            {
                DomainTransaction? existing = await transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                    .Include(x => x.TransactionTags).ThenInclude(x => x.Tag)
                    .SingleOrDefaultAsync(x => x.IdempotencyKey == idempotencyKey, ct);

                if (existing is not null)
                {
                    return new TransactionDto(existing.Id, existing.AccountId, existing.CategoryId, existing.Type, existing.Amount, existing.Currency, existing.Merchant, existing.Note, existing.OccurredOn, existing.TransactionTags.Select(tt => new TagDto(tt.TagId, tt.Tag!.Name)).ToList());
                }
            }

            Category? categoryRow = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == request.CategoryId && x.Type == request.Type && !x.IsArchived, ct);
            if (categoryRow is null)
            {
                throw new InvalidOperationException("Category is invalid for this transaction type.");
            }

            bool categoryHasSubcategories = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .AnyAsync(x => x.ParentCategoryId == request.CategoryId && !x.IsArchived, ct);
            if (categoryHasSubcategories)
            {
                throw new InvalidOperationException("Choose a subcategory for this category.");
            }

            account.Balance += request.Type == TransactionType.Income ? request.Amount : -request.Amount;

            var transaction = new DomainTransaction
            {
                WorkspaceId = currentWorkspace.WorkspaceId,
                UserId = currentUser.UserId,
                AccountId = account.Id,
                CategoryId = request.CategoryId,
                Type = request.Type,
                Amount = request.Amount,
                Currency = request.Currency.Trim().ToUpperInvariant(),
                Merchant = request.Merchant,
                Note = request.Note,
                IdempotencyKey = idempotencyKey,
                OccurredOn = request.OccurredOn
            };

            if (request.TagIds is { Count: > 0 })
            {
                List<Guid> validTagIds = await tags.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                    .Where(x => request.TagIds.Contains(x.Id))
                    .Select(x => x.Id)
                    .ToListAsync(ct);

                transaction.TransactionTags = validTagIds.Distinct()
                    .Select(tagId => new TransactionTag { TransactionId = transaction.Id, TagId = tagId })
                    .ToList();
            }

            await transactions.AddAsync(transaction, ct);

            return new TransactionDto(transaction.Id, transaction.AccountId, transaction.CategoryId, transaction.Type, transaction.Amount, transaction.Currency, transaction.Merchant, transaction.Note, transaction.OccurredOn, []);
        }, cancellationToken);
}

