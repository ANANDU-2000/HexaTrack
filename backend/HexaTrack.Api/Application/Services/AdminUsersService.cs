using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminUsersService
{
    Task<AdminUserListResult> ListAsync(string? query, int page, int pageSize, CancellationToken cancellationToken);
    Task SetLockedAsync(Guid targetUserId, bool locked, Guid actorUserId, CancellationToken cancellationToken);
    Task SetSubscriptionPlanAsync(Guid targetUserId, SubscriptionPlan plan, Guid actorUserId, CancellationToken cancellationToken);
}

public sealed class AdminUsersService(HexaTrackDbContext db, IAdminAuditService audit) : IAdminUsersService
{
    public async Task<AdminUserListResult> ListAsync(string? query, int page, int pageSize, CancellationToken cancellationToken)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        IQueryable<User> q = db.Users.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query))
        {
            string term = query.Trim().ToLowerInvariant();
            q = q.Where(x => x.Email.ToLower().Contains(term) || x.DisplayName.ToLower().Contains(term));
        }

        int total = await q.CountAsync(cancellationToken);
        List<AdminUserListItemDto> items = await q
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminUserListItemDto(x.Id, x.Email, x.DisplayName, x.CreatedAt, x.IsSuperAdmin, x.IsLocked))
            .ToListAsync(cancellationToken);
        return new AdminUserListResult(items, page, pageSize, total);
    }

    public async Task SetLockedAsync(Guid targetUserId, bool locked, Guid actorUserId, CancellationToken cancellationToken)
    {
        User? user = await db.Users.SingleOrDefaultAsync(x => x.Id == targetUserId, cancellationToken)
            ?? throw new KeyNotFoundException("User not found.");
        if (user.IsSuperAdmin && locked)
        {
            throw new InvalidOperationException("Cannot lock a super-admin account.");
        }

        user.IsLocked = locked;
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync(actorUserId, locked ? "user.lock" : "user.unlock", "User", targetUserId, null, cancellationToken);
    }

    public async Task SetSubscriptionPlanAsync(Guid targetUserId, SubscriptionPlan plan, Guid actorUserId, CancellationToken cancellationToken)
    {
        User? user = await db.Users.SingleOrDefaultAsync(x => x.Id == targetUserId, cancellationToken)
            ?? throw new KeyNotFoundException("User not found.");

        UserSubscription? subscription = await db.UserSubscriptions.SingleOrDefaultAsync(x => x.UserId == targetUserId, cancellationToken);
        if (subscription is null)
        {
            subscription = new UserSubscription
            {
                UserId = targetUserId,
                Plan = plan,
                IsActive = true,
                CurrentPeriodEndsAt = DateTimeOffset.UtcNow.AddYears(10),
            };
            db.UserSubscriptions.Add(subscription);
        }
        else
        {
            subscription.Plan = plan;
            subscription.IsActive = true;
        }

        await db.SaveChangesAsync(cancellationToken);

        string meta = JsonSerializer.Serialize(new { plan = plan.ToString(), email = user.Email });
        await audit.LogAsync(actorUserId, "user.subscription.override", "User", targetUserId, meta, cancellationToken);
    }
}
