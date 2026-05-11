using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface IAccountService
{
    Task<IReadOnlyCollection<AccountDto>> ListAsync(CancellationToken cancellationToken);
    Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken cancellationToken);
    Task<AccountDto> UpdateAsync(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken);
    Task ArchiveAsync(Guid id, CancellationToken cancellationToken);
    Task UnarchiveAsync(Guid id, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<TransferDto> TransferAsync(TransferRequest request, CancellationToken cancellationToken);
}

public sealed class AccountService(HexaTrackDbContext db, IUserScopedRepository<Account> accounts, IUserScopedRepository<AccountTransfer> transfers, ICurrentUser currentUser, ICurrentWorkspace currentWorkspace, IUnitOfWork unitOfWork) : IAccountService
{
    public async Task<IReadOnlyCollection<AccountDto>> ListAsync(CancellationToken cancellationToken)
        => await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Where(x => !x.IsArchived)
            .OrderBy(x => x.Type).ThenBy(x => x.Name)
            .Select(x => new AccountDto(x.Id, x.Name, x.Type, x.Currency, x.Balance))
            .ToListAsync(cancellationToken);

    public Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            var account = new Account
            {
                WorkspaceId = currentWorkspace.WorkspaceId,
                UserId = currentUser.UserId,
                Name = request.Name.Trim(),
                Type = request.Type,
                Currency = request.Currency.Trim().ToUpperInvariant(),
                Balance = request.OpeningBalance
            };

            await accounts.AddAsync(account, ct);
            return new AccountDto(account.Id, account.Name, account.Type, account.Currency, account.Balance);
        }, cancellationToken);

    public Task<AccountDto> UpdateAsync(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Account account = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId).SingleOrDefaultAsync(x => x.Id == id, ct)
                ?? throw new KeyNotFoundException("Account not found.");

            account.Name = request.Name.Trim();
            account.IsArchived = request.IsArchived;
            return new AccountDto(account.Id, account.Name, account.Type, account.Currency, account.Balance);
        }, cancellationToken);

    public Task ArchiveAsync(Guid id, CancellationToken cancellationToken)
        => SetArchiveStateAsync(id, true, cancellationToken);

    public Task UnarchiveAsync(Guid id, CancellationToken cancellationToken)
        => SetArchiveStateAsync(id, false, cancellationToken);

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Account account = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == id, ct)
                ?? throw new KeyNotFoundException("Account not found.");

            if (account.Balance != 0)
            {
                throw new InvalidOperationException("Account has a non-zero balance. Transfer or clear balance before deleting.");
            }

            DateTimeOffset now = DateTimeOffset.UtcNow;
            account.DeletedAt = now;
            account.IsArchived = true;
            await db.Transactions
                .Where(t => t.AccountId == id && t.WorkspaceId == currentWorkspace.WorkspaceId && t.UserId == currentUser.UserId)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.DeletedAt, now), ct);
        }, cancellationToken);

    public Task<TransferDto> TransferAsync(TransferRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.FromAccountId == request.ToAccountId)
            {
                throw new InvalidOperationException("Transfer accounts must be different.");
            }

            if (request.Amount <= 0)
            {
                throw new InvalidOperationException("Transfer amount must be greater than zero.");
            }

            string idempotencyKey = request.IdempotencyKey.Trim();
            AccountTransfer? existing = await transfers.ForUser(currentUser.UserId)
                .SingleOrDefaultAsync(x => x.IdempotencyKey == idempotencyKey, ct);

            if (existing is not null)
            {
                return new TransferDto(existing.Id, existing.FromAccountId, existing.ToAccountId, existing.Amount, existing.Currency, existing.FeeAmount, existing.TransferOn);
            }

            Account from = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == request.FromAccountId && !x.IsArchived, ct)
                ?? throw new KeyNotFoundException("Source account not found.");

            Account to = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == request.ToAccountId && !x.IsArchived, ct)
                ?? throw new KeyNotFoundException("Destination account not found.");

            string currency = request.Currency.Trim().ToUpperInvariant();
            if (from.Currency != currency || to.Currency != currency)
            {
                throw new InvalidOperationException("Cross-currency transfers require an exchange-rate workflow.");
            }

            decimal fee = request.FeeAmount ?? 0;
            if (fee < 0)
            {
                throw new InvalidOperationException("Transfer fee cannot be negative.");
            }

            from.Balance -= request.Amount + fee;
            to.Balance += request.Amount;

            var transfer = new AccountTransfer
            {
                UserId = currentUser.UserId,
                FromAccountId = from.Id,
                ToAccountId = to.Id,
                Amount = request.Amount,
                Currency = currency,
                FeeAmount = request.FeeAmount,
                Note = request.Note,
                TransferOn = request.TransferOn,
                IdempotencyKey = idempotencyKey
            };

            await transfers.AddAsync(transfer, ct);
            return new TransferDto(transfer.Id, transfer.FromAccountId, transfer.ToAccountId, transfer.Amount, transfer.Currency, transfer.FeeAmount, transfer.TransferOn);
        }, cancellationToken);

    private Task SetArchiveStateAsync(Guid id, bool archived, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Account account = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == id, ct)
                ?? throw new KeyNotFoundException("Account not found.");
            account.IsArchived = archived;
        }, cancellationToken);
}

