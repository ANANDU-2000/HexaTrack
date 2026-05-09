namespace HexaTrack.Api.Domain.Entities;

/// <summary>Daily AI token usage aggregates per user (append/update same row per UTC day).</summary>
public sealed class AiUsageDaily
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public DateOnly DayUtc { get; set; }
    public int PromptTokens { get; set; }
    public int CompletionTokens { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User? User { get; set; }
}
