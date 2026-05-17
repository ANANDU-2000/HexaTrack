namespace HexaTrack.Api.Domain.Entities;

public sealed class PricingConfiguration
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string PlanName { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public int TrialDays { get; set; } = 14;
    public bool IsActive { get; set; } = true;
    public int MaxUsers { get; set; } = 1;
    public int MaxBranches { get; set; } = 0;
    public int MaxTransactionsPerMonth { get; set; } = 1000;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
