using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[Authorize(Policy = "SuperAdmin")]
[ApiController]
[Route("api/admin/routes")]
public sealed class AdminRoutesController(IAdminRoutesService routes) : ControllerBase
{
    [HttpGet]
    public Task<PagedResult<RouteDto>> List(
        [FromQuery] Guid? organizationId,
        [FromQuery] Guid? branchId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
        => routes.ListAsync(organizationId, branchId, page, pageSize, ct);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct = default)
    {
        RouteDto? route = await routes.GetAsync(id, ct);
        return route is null ? NotFound() : Ok(route);
    }

    [HttpPost]
    public Task<RouteDto> Create([FromBody] CreateRouteRequest request, CancellationToken ct = default)
        => routes.CreateAsync(request, ct);

    [HttpPut("{id:guid}")]
    public Task<RouteDto> Update(Guid id, [FromBody] UpdateRouteRequest request, CancellationToken ct = default)
        => routes.UpdateAsync(id, request, ct);

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        await routes.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/assign-staff/{userId:guid}")]
    public async Task<IActionResult> AssignStaff(Guid id, Guid userId, CancellationToken ct = default)
    {
        await routes.AssignStaffAsync(id, userId, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/assign-staff/{userId:guid}")]
    public async Task<IActionResult> UnassignStaff(Guid id, Guid userId, CancellationToken ct = default)
    {
        await routes.UnassignStaffAsync(id, userId, ct);
        return NoContent();
    }
}
