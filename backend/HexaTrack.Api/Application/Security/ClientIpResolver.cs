namespace HexaTrack.Api.Application.Security;

public static class ClientIpResolver
{
    /// <summary>Best-effort client IP for rate limits and audit (honors X-Forwarded-For first hop).</summary>
    public static string? Resolve(HttpContext? ctx)
    {
        if (ctx is null) return null;
        string? forwarded = ctx.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwarded))
        {
            string first = forwarded.Split(',')[0].Trim();
            if (first.Length > 0 && first.Length <= 45) return first;
        }

        string? remote = ctx.Connection.RemoteIpAddress?.ToString();
        if (string.IsNullOrWhiteSpace(remote) || remote.Length > 45) return null;
        return remote;
    }
}
