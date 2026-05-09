namespace HexaTrack.Api.Application.Security;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public required string Issuer { get; init; }
    public required string Audience { get; init; }
    public required string SigningKey { get; init; }
    public int ExpiresMinutes { get; init; } = 60;
}

public sealed class GoogleAuthOptions
{
    public const string SectionName = "Google";

    public required string ClientId { get; init; }
}

