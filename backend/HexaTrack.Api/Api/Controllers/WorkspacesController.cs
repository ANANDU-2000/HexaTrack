using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces")]
public sealed class WorkspacesController(IWorkspaceService workspaceService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<WorkspaceDto>> List(CancellationToken cancellationToken)
        => workspaceService.ListAsync(cancellationToken);

    [HttpPost]
    public Task<WorkspaceDto> Create(CreateWorkspaceRequest request, CancellationToken cancellationToken)
        => workspaceService.CreateAsync(request, cancellationToken);

    [HttpPut("{id:guid}")]
    public Task<WorkspaceDto> Update(Guid id, UpdateWorkspaceRequest request, CancellationToken cancellationToken)
        => workspaceService.UpdateAsync(id, request, cancellationToken);

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await workspaceService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
