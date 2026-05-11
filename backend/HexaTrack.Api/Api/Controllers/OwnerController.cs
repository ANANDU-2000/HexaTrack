using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/owner")]
public sealed class OwnerController(ICurrentUser currentUser, IOwnerService ownerService) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("User has no assigned organization context.");
        
        return Ok(await ownerService.GetOverviewAsync(orgId.Value, ct));
    }

    [HttpGet("branches")]
    public async Task<IActionResult> GetBranches(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");
        
        return Ok(await ownerService.GetBranchesAsync(orgId.Value, ct));
    }

    [HttpGet("staff")]
    public async Task<IActionResult> GetStaff(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");
        
        return Ok(await ownerService.GetStaffAsync(orgId.Value, ct));
    }
}
