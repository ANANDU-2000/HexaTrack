using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public sealed class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public Task<DashboardSummary> Summary([FromQuery] DateOnly from, [FromQuery] DateOnly to, CancellationToken cancellationToken)
        => dashboardService.GetSummaryAsync(from, to, cancellationToken);
}
