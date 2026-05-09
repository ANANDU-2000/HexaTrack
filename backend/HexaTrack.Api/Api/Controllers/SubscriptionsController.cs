using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;
using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/subscription")]
public sealed class SubscriptionsController(ISubscriptionService subscriptionService) : ControllerBase
{
    [HttpGet]
    public Task<SubscriptionDto> Current(CancellationToken cancellationToken)
        => subscriptionService.CurrentAsync(cancellationToken);

    [HttpPost("upgrade/{plan}")]
    public Task<SubscriptionDto> Upgrade(SubscriptionPlan plan, CancellationToken cancellationToken)
        => subscriptionService.UpgradeAsync(plan, cancellationToken);
}

