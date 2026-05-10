using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace HexaTrack.Api.Application.Security;

public sealed class LoginThrottleOptions
{
    public const string SectionName = "LoginThrottle";

    /// <summary>Failures within the window before requests are rejected.</summary>
    public int MaxFailuresPerWindow { get; set; } = 25;

    /// <summary>Sliding window length.</summary>
    public int WindowMinutes { get; set; } = 15;

    /// <summary>Log a security warning when failures reach this count (still below block threshold).</summary>
    public int SuspiciousFailureThreshold { get; set; } = 8;
}

public sealed class RedisLoginThrottle(
    IConnectionMultiplexer redis,
    IOptions<LoginThrottleOptions> options,
    ILogger<RedisLoginThrottle> logger) : ILoginThrottle
{
    private readonly LoginThrottleOptions _opt = options.Value;

    public async Task EnsureAllowedAsync(string? clientIp, CancellationToken cancellationToken)
    {
        string key = Key(clientIp);
        if (key.Length == 0) return;

        try
        {
            IDatabase db = redis.GetDatabase();
            RedisValue v = await db.StringGetAsync(key);
            if (v.HasValue && (int)v >= _opt.MaxFailuresPerWindow)
            {
                throw new TooManyRequestsException("Too many failed sign-in attempts. Try again later.");
            }
        }
        catch (TooManyRequestsException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Login throttle (read) failed; allowing request.");
        }
    }

    public async Task OnFailedAttemptAsync(string? clientIp, CancellationToken cancellationToken)
    {
        string key = Key(clientIp);
        if (key.Length == 0) return;

        try
        {
            IDatabase db = redis.GetDatabase();
            long count = await db.StringIncrementAsync(key);
            if (count == 1)
            {
                await db.KeyExpireAsync(key, TimeSpan.FromMinutes(Math.Max(1, _opt.WindowMinutes)));
            }

            if (count == _opt.SuspiciousFailureThreshold)
            {
                logger.LogWarning(
                    "Suspicious activity: {FailureCount} failed credential attempts from {ClientIp} within throttle window.",
                    count,
                    clientIp ?? "unknown");
            }

            if (count >= _opt.MaxFailuresPerWindow)
            {
                logger.LogWarning(
                    "Brute-force threshold: blocking further sign-ins from {ClientIp} until window expires.",
                    clientIp ?? "unknown");
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Login throttle (increment) failed.");
        }
    }

    public async Task OnSuccessAsync(string? clientIp, CancellationToken cancellationToken)
    {
        string key = Key(clientIp);
        if (key.Length == 0) return;

        try
        {
            IDatabase db = redis.GetDatabase();
            await db.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Login throttle (reset) failed.");
        }
    }

    private static string Key(string? clientIp)
    {
        if (string.IsNullOrWhiteSpace(clientIp)) return "";
        string safe = clientIp.Trim();
        if (safe.Length > 64) safe = safe[..64];
        return $"hexatrack:login:fail:{safe}";
    }
}
