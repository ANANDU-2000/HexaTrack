using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class UserSubscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset? CurrentPeriodEndsAt { get; set; }
    public string? ProviderCustomerId { get; set; }
    public string? ProviderSubscriptionId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
