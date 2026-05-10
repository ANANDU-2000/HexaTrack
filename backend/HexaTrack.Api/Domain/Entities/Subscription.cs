using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class BackupJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public BackupStatus Status { get; set; } = BackupStatus.Pending;
    public string Provider { get; set; } = "cloud";
    public string? ObjectKey { get; set; }
    public string? Error { get; set; }
    public DateTimeOffset RequestedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? CompletedAt { get; set; }
}
