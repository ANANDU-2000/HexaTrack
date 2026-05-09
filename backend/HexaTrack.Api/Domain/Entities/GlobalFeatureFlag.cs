namespace HexaTrack.Api.Domain.Entities;

/// <summary>Global kill-switch / rollout flags (key/value). Changes must be audited.</summary>
public sealed class GlobalFeatureFlag
{
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
