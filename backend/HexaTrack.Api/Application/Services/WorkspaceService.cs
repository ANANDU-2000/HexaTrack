using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface IWorkspaceService
{
    Task<IReadOnlyCollection<WorkspaceDto>> ListAsync(CancellationToken cancellationToken);
    Task<WorkspaceDto> CreateAsync(CreateWorkspaceRequest request, CancellationToken cancellationToken);
    Task<WorkspaceDto> UpdateAsync(Guid id, UpdateWorkspaceRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class WorkspaceService(HexaTrackDbContext db, ICurrentUser currentUser, IUnitOfWork unitOfWork) : IWorkspaceService
{
    public async Task<IReadOnlyCollection<WorkspaceDto>> ListAsync(CancellationToken cancellationToken)
    {
        Guid uid = currentUser.UserId;
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == uid, cancellationToken);
        if (user == null) return Array.Empty<WorkspaceDto>();

        IQueryable<Workspace> query = db.Workspaces.AsNoTracking();

        if (!user.IsSuperAdmin)
        {
            if (user.OrganizationId != null)
            {
                query = query.Where(w => w.OwnerUserId == uid || 
                                         w.Members.Any(m => m.UserId == uid) || 
                                         w.OrganizationId == user.OrganizationId);
            }
            else
            {
                query = query.Where(w => w.OwnerUserId == uid || w.Members.Any(m => m.UserId == uid));
            }
        }

        return await query
            .OrderByDescending(w => w.IsDefault)
            .ThenBy(w => w.Name)
            .Select(w => new WorkspaceDto(w.Id, w.Name, w.Type, w.Currency, w.IsDefault))
            .ToListAsync(cancellationToken);
    }

    public Task<WorkspaceDto> CreateAsync(CreateWorkspaceRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(ct =>
        {
            Guid uid = currentUser.UserId;
            string currency = request.Currency.Trim().ToUpperInvariant();
            var workspace = new Workspace
            {
                OwnerUserId = uid,
                Name = request.Name.Trim(),
                Type = request.Type,
                Currency = currency,
                IsDefault = false,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            db.Workspaces.Add(workspace);
            db.WorkspaceMembers.Add(new WorkspaceMember
            {
                WorkspaceId = workspace.Id,
                UserId = uid,
                Role = WorkspaceRole.Owner
            });

            return Task.FromResult(new WorkspaceDto(workspace.Id, workspace.Name, workspace.Type, workspace.Currency, workspace.IsDefault));
        }, cancellationToken);

    public Task<WorkspaceDto> UpdateAsync(Guid id, UpdateWorkspaceRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Workspace workspace = await db.Workspaces.SingleOrDefaultAsync(w => w.Id == id && w.OwnerUserId == currentUser.UserId, ct)
                ?? throw new KeyNotFoundException("Workspace not found.");

            workspace.Name = request.Name.Trim();
            workspace.Currency = request.Currency.Trim().ToUpperInvariant();
            workspace.UpdatedAt = DateTimeOffset.UtcNow;

            return new WorkspaceDto(workspace.Id, workspace.Name, workspace.Type, workspace.Currency, workspace.IsDefault);
        }, cancellationToken);

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Workspace workspace = await db.Workspaces.SingleOrDefaultAsync(w => w.Id == id && w.OwnerUserId == currentUser.UserId, ct)
                ?? throw new KeyNotFoundException("Workspace not found.");

            if (workspace.IsDefault)
            {
                throw new InvalidOperationException("Cannot delete the default workspace.");
            }

            int ownedCount = await db.Workspaces.CountAsync(w => w.OwnerUserId == currentUser.UserId, ct);
            if (ownedCount <= 1)
            {
                throw new InvalidOperationException("Cannot delete your only workspace.");
            }

            bool hasData =
                await db.Accounts.AnyAsync(a => a.WorkspaceId == id, ct) ||
                await db.Categories.AnyAsync(c => c.WorkspaceId == id, ct) ||
                await db.Transactions.AnyAsync(t => t.WorkspaceId == id, ct) ||
                await db.RecurringTransactions.AnyAsync(r => r.WorkspaceId == id, ct) ||
                await db.Tags.AnyAsync(t => t.WorkspaceId == id, ct);

            if (hasData)
            {
                throw new InvalidOperationException("Remove workspace data before deleting this workspace.");
            }

            db.Workspaces.Remove(workspace);
        }, cancellationToken);
}
