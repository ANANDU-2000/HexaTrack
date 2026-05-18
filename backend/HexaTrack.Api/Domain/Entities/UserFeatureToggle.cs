namespace HexaTrack.Api.Domain.Entities;

/// <summary>Per-user feature toggles managed by Super Admin.</summary>
public sealed class UserFeatureToggle
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public required string FeatureKey { get; set; }
    public bool IsEnabled { get; set; } = true;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User? User { get; set; }
}
