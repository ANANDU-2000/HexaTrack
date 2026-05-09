using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminAuditService
{
    Task LogAsync(Guid actorUserId, string action, string? targetType, Guid? targetId, string? metadataJson, CancellationToken cancellationToken);
    Task<AdminAuditListResult> ListAsync(int page, int pageSize, CancellationToken cancellationToken);
}

public sealed class AdminAuditService(HexaTrackDbContext db) : IAdminAuditService
{
    public async Task LogAsync(Guid actorUserId, string action, string? targetType, Guid? targetId, string? metadataJson, CancellationToken cancellationToken)
    {
        db.AdminAuditLogs.Add(new AdminAuditLog
        {
            ActorUserId = actorUserId,
            Action = action,
            TargetType = targetType,
            TargetId = targetId,
            MetadataJson = metadataJson,
            CreatedAt = DateTimeOffset.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<AdminAuditListResult> ListAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);
        IQueryable<AdminAuditLog> q = db.AdminAuditLogs.AsNoTracking();
        int total = await q.CountAsync(cancellationToken);
        List<AdminAuditLogDto> items = await q
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminAuditLogDto(x.Id, x.ActorUserId, x.Action, x.TargetType, x.TargetId, x.CreatedAt))
            .ToListAsync(cancellationToken);
        return new AdminAuditListResult(items, page, pageSize, total);
    }
}
