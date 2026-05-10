using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[EnableRateLimiting("admin")]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/analytics")]
public sealed class AdminAnalyticsController(IAdminAnalyticsService analytics) : ControllerBase
{
    [HttpGet("overview")]
    public Task<AdminAnalyticsOverviewDto> Overview(CancellationToken cancellationToken)
        => analytics.GetOverviewAsync(cancellationToken);

    [HttpGet("dashboard")]
    public Task<AdminAnalyticsDashboardDto> Dashboard([FromQuery] int days = 90, CancellationToken cancellationToken = default)
        => analytics.GetDashboardAsync(days, cancellationToken);
}
