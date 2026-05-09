namespace HexaTrack.Api.Domain.Entities;

public sealed class TransactionTag
{
    public Guid TransactionId { get; set; }
    public Guid TagId { get; set; }

    public Transaction? Transaction { get; set; }
    public Tag? Tag { get; set; }
}

