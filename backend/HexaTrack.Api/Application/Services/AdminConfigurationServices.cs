using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminFeatureFlagsService
{
    Task<IReadOnlyList<FeatureFlagDto>> ListAsync(CancellationToken cancellationToken);
    Task UpsertAsync(string key, string value, Guid actorUserId, CancellationToken cancellationToken);
}

public sealed class AdminFeatureFlagsService(HexaTrackDbContext db, IAdminAuditService audit) : IAdminFeatureFlagsService
{
    public async Task<IReadOnlyList<FeatureFlagDto>> ListAsync(CancellationToken cancellationToken)
    {
        return await db.GlobalFeatureFlags.AsNoTracking()
            .OrderBy(x => x.Key)
            .Select(x => new FeatureFlagDto(x.Key, x.Value, x.UpdatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task UpsertAsync(string key, string value, Guid actorUserId, CancellationToken cancellationToken)
    {
        key = key.Trim();
        if (key.Length == 0 || key.Length > 120)
        {
            throw new InvalidOperationException("Invalid flag key.");
        }

        GlobalFeatureFlag? row = await db.GlobalFeatureFlags.SingleOrDefaultAsync(x => x.Key == key, cancellationToken);
        DateTimeOffset now = DateTimeOffset.UtcNow;
        if (row is null)
        {
            db.GlobalFeatureFlags.Add(new GlobalFeatureFlag { Key = key, Value = value, UpdatedAt = now });
        }
        else
        {
            row.Value = value;
            row.UpdatedAt = now;
        }

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync(actorUserId, "feature_flag.upsert", "GlobalFeatureFlag", null,
            JsonSerializer.Serialize(new { key }), cancellationToken);
    }
}

public interface IAdminGlobalSettingsService
{
    Task<IReadOnlyList<GlobalSettingDto>> ListAsync(CancellationToken cancellationToken);
    Task UpsertAsync(string key, string value, Guid actorUserId, CancellationToken cancellationToken);
}

public sealed class AdminGlobalSettingsService(HexaTrackDbContext db, IAdminAuditService audit) : IAdminGlobalSettingsService
{
    private static bool IsBlockedKey(string key)
    {
        string lower = key.ToLowerInvariant();
        return lower.Contains("secret", StringComparison.Ordinal)
               || lower.Contains("apikey", StringComparison.Ordinal)
               || lower.Contains("password", StringComparison.Ordinal)
               || lower.Contains("signing", StringComparison.Ordinal);
    }

    public async Task<IReadOnlyList<GlobalSettingDto>> ListAsync(CancellationToken cancellationToken)
    {
        return await db.GlobalSettings.AsNoTracking()
            .OrderBy(x => x.Key)
            .Select(x => new GlobalSettingDto(x.Key, x.Value, x.UpdatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task UpsertAsync(string key, string value, Guid actorUserId, CancellationToken cancellationToken)
    {
        key = key.Trim();
        if (key.Length == 0 || key.Length > 120)
        {
            throw new InvalidOperationException("Invalid setting key.");
        }

        if (IsBlockedKey(key))
        {
            throw new InvalidOperationException("This key is reserved; configure secrets via environment variables.");
        }

        GlobalSetting? row = await db.GlobalSettings.SingleOrDefaultAsync(x => x.Key == key, cancellationToken);
        DateTimeOffset now = DateTimeOffset.UtcNow;
        if (row is null)
        {
            db.GlobalSettings.Add(new GlobalSetting { Key = key, Value = value, UpdatedAt = now });
        }
        else
        {
            row.Value = value;
            row.UpdatedAt = now;
        }

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync(actorUserId, "global_setting.upsert", "GlobalSetting", null,
            JsonSerializer.Serialize(new { key }), cancellationToken);
    }
}
