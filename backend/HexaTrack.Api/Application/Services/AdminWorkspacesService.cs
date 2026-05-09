using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
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

        IQueryable<Workspace> workspaces = db.Workspaces.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query))
        {
            string term = query.Trim().ToLowerInvariant();
            workspaces = workspaces.Where(x => x.Name.ToLower().Contains(term));
        }

        int total = await workspaces.CountAsync(cancellationToken);

        List<AdminWorkspaceListItemDto> items = await (
            from w in workspaces.OrderByDescending(w => w.CreatedAt)
            join u in db.Users.AsNoTracking() on w.OwnerUserId equals u.Id
            select new AdminWorkspaceListItemDto(w.Id, w.Name, w.OwnerUserId, u.Email, w.CreatedAt))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new AdminWorkspaceListResult(items, page, pageSize, total);
    }
}
