using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using DomainTransaction = HexaTrack.Api.Domain.Entities.Transaction;

namespace HexaTrack.Api.Application.Services;

public interface IRecurringTransactionService
{
    Task<IReadOnlyCollection<RecurringTransactionDto>> ListAsync(CancellationToken cancellationToken);
    Task<RecurringTransactionDto> CreateAsync(CreateRecurringTransactionRequest request, CancellationToken cancellationToken);
    Task ProcessDueAsync(CancellationToken cancellationToken);
}

public sealed class RecurringTransactionService(
    IUserScopedRepository<RecurringTransaction> recurringTransactions,
    IUserScopedRepository<Account> accounts,
    IUserScopedRepository<Category> categories,
    IUserScopedRepository<DomainTransaction> transactions,
    ICurrentUser currentUser,
    ICurrentWorkspace currentWorkspace,
    IUnitOfWork unitOfWork) : IRecurringTransactionService
{
    public async Task<IReadOnlyCollection<RecurringTransactionDto>> ListAsync(CancellationToken cancellationToken)
        => await recurringTransactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .OrderBy(x => x.NextRunOn)
            .Select(x => new RecurringTransactionDto(x.Id, x.AccountId, x.CategoryId, x.Type, x.Frequency, x.Amount, x.Currency, x.Note, x.NextRunOn, x.EndsOn, x.IsActive))
            .ToListAsync(cancellationToken);

    public Task<RecurringTransactionDto> CreateAsync(CreateRecurringTransactionRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
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

            var recurring = new RecurringTransaction
            {
                WorkspaceId = currentWorkspace.WorkspaceId,
                UserId = currentUser.UserId,
                AccountId = request.AccountId,
                CategoryId = request.CategoryId,
                Type = request.Type,
                Frequency = request.Frequency,
                Amount = request.Amount,
                Currency = request.Currency.Trim().ToUpperInvariant(),
                Note = request.Note,
                NextRunOn = request.NextRunOn,
                EndsOn = request.EndsOn
            };

            await recurringTransactions.AddAsync(recurring, ct);
            return new RecurringTransactionDto(recurring.Id, recurring.AccountId, recurring.CategoryId, recurring.Type, recurring.Frequency, recurring.Amount, recurring.Currency, recurring.Note, recurring.NextRunOn, recurring.EndsOn, recurring.IsActive);
        }, cancellationToken);

    public async Task ProcessDueAsync(CancellationToken cancellationToken)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
        List<RecurringTransaction> due = await recurringTransactions.Query()
            .Where(x => x.IsActive && x.NextRunOn <= today && (x.EndsOn == null || x.EndsOn >= x.NextRunOn))
            .OrderBy(x => x.NextRunOn)
            .Take(500)
            .ToListAsync(cancellationToken);

        foreach (RecurringTransaction item in due)
        {
            await unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                Account account = await accounts.ForUser(item.UserId).InWorkspace(item.WorkspaceId).SingleAsync(x => x.Id == item.AccountId, ct);
                account.Balance += item.Type == TransactionType.Income ? item.Amount : -item.Amount;

                await transactions.AddAsync(new DomainTransaction
                {
                    UserId = item.UserId,
                    WorkspaceId = item.WorkspaceId,
                    AccountId = item.AccountId,
                    CategoryId = item.CategoryId,
                    Type = item.Type,
                    Amount = item.Amount,
                    Currency = item.Currency,
                    Note = item.Note,
                    OccurredOn = item.NextRunOn
                }, ct);

                item.NextRunOn = Advance(item.NextRunOn, item.Frequency);
                if (item.EndsOn.HasValue && item.NextRunOn > item.EndsOn.Value)
                {
                    item.IsActive = false;
                }
            }, cancellationToken);
        }
    }

    private static DateOnly Advance(DateOnly date, RecurrenceFrequency frequency) => frequency switch
    {
        RecurrenceFrequency.Daily => date.AddDays(1),
        RecurrenceFrequency.Weekly => date.AddDays(7),
        RecurrenceFrequency.Monthly => date.AddMonths(1),
        RecurrenceFrequency.Yearly => date.AddYears(1),
        _ => throw new ArgumentOutOfRangeException(nameof(frequency), frequency, null)
    };
}

