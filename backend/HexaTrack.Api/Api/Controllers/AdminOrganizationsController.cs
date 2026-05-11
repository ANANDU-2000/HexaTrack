using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationRequest request, CancellationToken ct = default)
    {
        try 
        {
            var result = await orgService.CreateOrganizationAsync(request, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Expose precise error text for stabilization audit feedback loop
            return BadRequest(new { message = ex.Message, detail = ex.InnerException?.Message });
        }
    }

    [HttpPost("branch")]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchRequest request, CancellationToken ct = default)
    {
        var result = await orgService.CreateBranchAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("owner")]
    public async Task<IActionResult> AddOwner([FromBody] AddOwnerRequest request, CancellationToken ct = default)
    {
        var result = await orgService.AddOwnerAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("staff")]
    public async Task<IActionResult> AddStaff([FromBody] AddStaffRequest request, CancellationToken ct = default)
    {
        var result = await orgService.AddStaffAsync(request, ct);
        return Ok(result);
    }
}
