using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/branches")]
public sealed class BranchesController(ICurrentUser currentUser, IOwnerService ownerService) : ControllerBase
{
    [HttpGet("{id:guid}/staff")]
    public async Task<IActionResult> Staff(Guid id, CancellationToken ct)
    {
        Guid? orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        return Ok(await ownerService.GetBranchStaffAsync(orgId.Value, id, ct));
    }
}
