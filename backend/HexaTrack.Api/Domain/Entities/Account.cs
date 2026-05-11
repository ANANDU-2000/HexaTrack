using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Account
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public AccountType Type { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal Balance { get; set; }
    public bool IsArchived { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DeletedAt { get; set; }

    public User? User { get; set; }
    public Workspace? Workspace { get; set; }
}

