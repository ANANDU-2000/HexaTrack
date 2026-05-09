using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface ISubscriptionService
{
    Task<SubscriptionDto> CurrentAsync(CancellationToken cancellationToken);
    Task<SubscriptionDto> UpgradeAsync(SubscriptionPlan plan, CancellationToken cancellationToken);
}

public sealed class SubscriptionService(IUserScopedRepository<UserSubscription> subscriptions, ICurrentUser currentUser, IUnitOfWork unitOfWork) : ISubscriptionService
{
    public async Task<SubscriptionDto> CurrentAsync(CancellationToken cancellationToken)
    {
        UserSubscription? subscription = await subscriptions.ForUser(currentUser.UserId).SingleOrDefaultAsync(cancellationToken);
        return subscription is null
            ? new SubscriptionDto(SubscriptionPlan.Free, true, null)
            : new SubscriptionDto(subscription.Plan, subscription.IsActive, subscription.CurrentPeriodEndsAt);
    }

    public Task<SubscriptionDto> UpgradeAsync(SubscriptionPlan plan, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            UserSubscription? subscription = await subscriptions.ForUser(currentUser.UserId).SingleOrDefaultAsync(ct);
            if (subscription is null)
            {
                subscription = new UserSubscription
                {
                    UserId = currentUser.UserId,
                    Plan = plan,
                    IsActive = true,
                    CurrentPeriodEndsAt = DateTimeOffset.UtcNow.AddMonths(1)
                };
                await subscriptions.AddAsync(subscription, ct);
            }
            else
            {
                subscription.Plan = plan;
                subscription.IsActive = true;
                subscription.CurrentPeriodEndsAt = DateTimeOffset.UtcNow.AddMonths(1);
            }

            return new SubscriptionDto(subscription.Plan, subscription.IsActive, subscription.CurrentPeriodEndsAt);
        }, cancellationToken);
}

