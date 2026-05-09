using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/reports")]
public sealed class ReportsController(IReportsService reportsService) : ControllerBase
{
    [HttpGet("summary")]
    public Task<ReportSummary> Summary([FromQuery] DateOnly from, [FromQuery] DateOnly to, CancellationToken cancellationToken)
        => reportsService.GetSummaryAsync(from, to, cancellationToken);
}

