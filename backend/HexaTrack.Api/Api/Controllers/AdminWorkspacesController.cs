using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/workspaces")]
public sealed class AdminWorkspacesController(IAdminWorkspacesService workspaces) : ControllerBase
{
    [HttpGet]
    public Task<AdminWorkspaceListResult> List(
        [FromQuery] string? q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
        => workspaces.ListAsync(q, page, pageSize, cancellationToken);
}
