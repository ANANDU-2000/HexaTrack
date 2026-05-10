using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminWorkspacesService
{
    Task<AdminWorkspaceListResult> ListAsync(string? query, int page, int pageSize, CancellationToken cancellationToken);
}

public sealed class AdminWorkspacesService(HexaTrackDbContext db) : IAdminWorkspacesService
{
    public async Task<AdminWorkspaceListResult> ListAsync(string? query, int page, int pageSize, CancellationToken cancellationToken)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<Workspace> baseQuery = db.Workspaces.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query))
        {
            string term = query.Trim().ToLowerInvariant();
            baseQuery = baseQuery.Where(w =>
                w.Name.ToLower().Contains(term)
                || db.Users.Any(u => u.Id == w.OwnerUserId && u.Email.ToLower().Contains(term)));
        }

        int total = await baseQuery.CountAsync(cancellationToken);

        List<AdminWorkspaceListItemDto> items = await (
            from w in baseQuery
            join u in db.Users.AsNoTracking() on w.OwnerUserId equals u.Id
            orderby w.CreatedAt descending
            select new AdminWorkspaceListItemDto(
                w.Id,
                w.Name,
                w.Type,
                w.OwnerUserId,
                u.Email,
                w.CreatedAt,
                db.WorkspaceMembers.Count(m => m.WorkspaceId == w.Id),
                db.UserSubscriptions
                    .Where(s => s.UserId == u.Id)
                    .Select(s => (SubscriptionPlan?)s.Plan)
                    .FirstOrDefault()))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new AdminWorkspaceListResult(items, page, pageSize, total);
    }
}
