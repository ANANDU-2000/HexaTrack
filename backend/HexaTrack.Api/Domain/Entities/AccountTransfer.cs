namespace HexaTrack.Api.Domain.Entities;

public sealed class AccountTransfer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid FromAccountId { get; set; }
    public Guid ToAccountId { get; set; }
    public Guid? OutTransactionId { get; set; }
    public Guid? InTransactionId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal? FeeAmount { get; set; }
    public string? Note { get; set; }
    public string IdempotencyKey { get; set; } = string.Empty;
    public DateOnly TransferOn { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

