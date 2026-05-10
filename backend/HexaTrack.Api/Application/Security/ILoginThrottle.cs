namespace HexaTrack.Api.Application.Security;

/// <summary>Redis-backed credential brute-force throttling (per client IP).</summary>
public interface ILoginThrottle
{
    /// <summary>Throws <see cref="TooManyRequestsException"/> when IP is temporarily blocked.</summary>
    Task EnsureAllowedAsync(string? clientIp, CancellationToken cancellationToken);

    /// <summary>Record a failed password/credential attempt. May log suspicious activity.</summary>
    Task OnFailedAttemptAsync(string? clientIp, CancellationToken cancellationToken);

    /// <summary>Clear failure counter after a successful login.</summary>
    Task OnSuccessAsync(string? clientIp, CancellationToken cancellationToken);
}
