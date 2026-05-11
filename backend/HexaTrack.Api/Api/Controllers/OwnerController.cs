using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/owner")]
public sealed class OwnerController(ICurrentUser currentUser, IOwnerService ownerService, HexaTrackDbContext db) : ControllerBase
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
    public async Task<IActionResult> GetStaff([FromQuery] Guid? branchId, [FromQuery] string? query, CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        branchId ??= await GetCallerBranchScopeAsync(ct);
        
        return Ok(await ownerService.GetStaffAsync(orgId.Value, branchId, query, ct));
    }

    [HttpGet("branches/{branchId:guid}/staff")]
    public async Task<IActionResult> GetBranchStaff(Guid branchId, CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        return Ok(await ownerService.GetBranchStaffAsync(orgId.Value, branchId, ct));
    }

    private async Task<Guid?> GetCallerBranchScopeAsync(CancellationToken ct)
    {
        var caller = await db.Users
            .AsNoTracking()
            .Where(u => u.Id == currentUser.UserId)
            .Select(u => new { u.OrganizationRole, u.BranchId })
            .SingleOrDefaultAsync(ct);

        return caller is { BranchId: not null } && caller.OrganizationRole is "Owner" or "Staff"
            ? caller.BranchId
            : null;
    }

    [HttpPost("staff")]
    public async Task<IActionResult> CreateStaff([FromBody] CreateOwnerStaffRequest request, CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("Identity context is unbound from valid organization authorization.");

        try
        {
            var res = await ownerService.CreateStaffAsync(orgId.Value, request, ct);
            return Ok(res);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
