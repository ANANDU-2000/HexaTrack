using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public Guid UserId { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? Merchant { get; set; }
    public string? Note { get; set; }
    public string? IdempotencyKey { get; set; }
    public Guid? TransferId { get; set; }
    public DateOnly OccurredOn { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Account? Account { get; set; }
    public Category? Category { get; set; }
    public ICollection<TransactionTag> TransactionTags { get; set; } = new List<TransactionTag>();
    public Workspace? Workspace { get; set; }
}

