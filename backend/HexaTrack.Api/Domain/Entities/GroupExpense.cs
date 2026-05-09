using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class ExpenseGroup
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OwnerUserId { get; set; }
    public required string Name { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
}

public sealed class GroupMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Guid? UserId { get; set; }
    public required string DisplayName { get; set; }

    public ExpenseGroup? Group { get; set; }
}

public sealed class GroupExpense
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Guid PaidByMemberId { get; set; }
    public required string Description { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public SplitMethod SplitMethod { get; set; }
    public DateOnly ExpenseOn { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<GroupExpenseSplit> Splits { get; set; } = new List<GroupExpenseSplit>();
}

public sealed class GroupExpenseSplit
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupExpenseId { get; set; }
    public Guid MemberId { get; set; }
    public decimal OwedAmount { get; set; }
    public decimal? Percentage { get; set; }
    public decimal SettledAmount { get; set; }
    public SettlementStatus Status { get; set; } = SettlementStatus.Pending;
}

public sealed class GroupSettlement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Guid FromMemberId { get; set; }
    public Guid ToMemberId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public SettlementStatus Status { get; set; } = SettlementStatus.Pending;
    public DateOnly SettlementOn { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

