using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/ai")]
public sealed class AdminAiUsageController(IAdminAiUsageService usage) : ControllerBase
{
    [HttpGet("usage")]
    public Task<AiUsageSummaryResult> UsageSummary(
        [FromQuery] int days = 30,
        CancellationToken cancellationToken = default)
        => usage.SummaryAsync(days, cancellationToken);
}
