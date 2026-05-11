using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;
using HexaTrack.Api.Domain.Entities;

namespace HexaTrack.Api.Api.Controllers;

[Authorize(Policy = "SuperAdmin")]
[ApiController]
[Route("api/admin/organizations")]
public sealed class AdminOrganizationsController(IAdminOrganizationsService orgService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<AdminOrganizationListResult>> List(
        [FromQuery] string? query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await orgService.ListAsync(query, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetails(Guid id, CancellationToken ct = default)
    {
        var details = await orgService.GetDetailsAsync(id, ct);
        return details == null ? NotFound() : Ok(details);
    }

    [HttpGet("{id:guid}/financials")]
    public async Task<IActionResult> GetFinancials(Guid id, [FromQuery] int days = 30, CancellationToken ct = default)
    {
        var summary = await orgService.GetOrgFinancialsAsync(id, days, ct);
        return summary is null ? NotFound() : Ok(summary);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOrganizationRequest request, CancellationToken ct = default)
    {
        var result = await orgService.UpdateOrganizationAsync(id, request, ct);
        return Ok(ToOrganizationResponse(result));
    }

    [HttpPost("{id:guid}/suspend")]
    public async Task<IActionResult> Suspend(Guid id, [FromBody] SuspendOrganizationRequest request, CancellationToken ct = default)
    {
        await orgService.SuspendOrganizationAsync(id, request, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id, CancellationToken ct = default)
    {
        await orgService.ActivateOrganizationAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        await orgService.DeleteOrganizationAsync(id, ct);
        return NoContent();
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<AdminOrganizationAnalyticsOverview>> GetAnalytics(CancellationToken ct = default)
    {
        var result = await orgService.GetAnalyticsAsync(ct);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllLight(CancellationToken ct = default)
    {
        return Ok(await orgService.GetAllLightAsync(ct));
    }

    [HttpGet("branches")]
    public async Task<IActionResult> GetAllBranchesLight([FromQuery] Guid? organizationId, CancellationToken ct = default)
    {
        return Ok(await orgService.GetAllBranchesLightAsync(organizationId, ct));
    }

    [HttpGet("branch/{id:guid}")]
    public async Task<IActionResult> GetBranch(Guid id, CancellationToken ct = default)
    {
        var branch = await orgService.GetBranchAsync(id, ct);
        return branch is null ? NotFound() : Ok(ToBranchResponse(branch));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationRequest request, CancellationToken ct = default)
    {
        try 
        {
            var result = await orgService.CreateOrganizationAsync(request, ct);
            return Ok(ToOrganizationResponse(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("branch")]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchRequest request, CancellationToken ct = default)
    {
        try
        {
            var result = await orgService.CreateBranchAsync(request, ct);
            return Ok(ToBranchResponse(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("branch/{id:guid}")]
    public async Task<IActionResult> UpdateBranch(Guid id, [FromBody] UpdateBranchRequest request, CancellationToken ct = default)
    {
        var result = await orgService.UpdateBranchAsync(id, request, ct);
        return Ok(ToBranchResponse(result));
    }

    [HttpDelete("branch/{id:guid}")]
    public async Task<IActionResult> DeleteBranch(Guid id, CancellationToken ct = default)
    {
        await orgService.DeleteBranchAsync(id, ct);
        return NoContent();
    }

    [HttpPost("owner")]
    public async Task<IActionResult> AddOwner([FromBody] AddOwnerRequest request, CancellationToken ct = default)
    {
        try
        {
            var result = await orgService.AddOwnerAsync(request, ct);
            return Ok(ToUserResponse(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("staff")]
    public async Task<IActionResult> AddStaff([FromBody] AddStaffRequest request, CancellationToken ct = default)
    {
        try
        {
            var result = await orgService.AddStaffAsync(request, ct);
            return Ok(ToUserResponse(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("staff/{userId:guid}/branch")]
    public async Task<IActionResult> ReassignStaffBranch(Guid userId, [FromBody] ReassignStaffBranchRequest request, CancellationToken ct = default)
    {
        await orgService.ReassignStaffBranchAsync(userId, request, ct);
        return NoContent();
    }

    [HttpDelete("staff/{userId:guid}")]
    public async Task<IActionResult> RemoveStaff(Guid userId, CancellationToken ct = default)
    {
        await orgService.RemoveStaffAsync(userId, ct);
        return NoContent();
    }

    private static object ToOrganizationResponse(Organization organization)
        => new
        {
            organization.Id,
            organization.Name,
            organization.Slug,
            Plan = organization.Plan.ToString(),
            Status = organization.IsSuspended ? "Suspended" : organization.IsActive ? "Active" : "Inactive",
            organization.BaseCurrency,
            organization.MaxBranches,
            organization.MaxStaff,
            organization.CreatedAt,
            organization.UpdatedAt,
        };

    private static object ToBranchResponse(Branch branch)
        => new
        {
            branch.Id,
            branch.OrganizationId,
            branch.Name,
            branch.Code,
            branch.Currency,
            branch.Timezone,
            branch.Address,
            branch.Phone,
            branch.WorkspaceId,
            branch.CreatedAt,
        };

    private static UserLightDto ToUserResponse(User user)
        => new(user.Id, user.Email, user.DisplayName, user.Department, user.IsLocked, user.BranchId);
}
