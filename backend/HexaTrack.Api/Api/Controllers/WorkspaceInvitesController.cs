using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/invites")]
public sealed class WorkspaceInvitesController(
    ICurrentWorkspace workspace,
    ICurrentUser currentUser,
    IWorkspaceInviteService invites) : ControllerBase
{
    [HttpPost]
    public Task<CreateInviteResponse> Create(
        Guid workspaceId,
        [FromBody] CreateWorkspaceInviteRequest body,
        CancellationToken cancellationToken)
    {
        if (workspace.WorkspaceId != workspaceId)
        {
            throw new InvalidOperationException("Workspace id does not match X-Workspace-Id.");
        }

        return invites.CreateInviteAsync(workspaceId, body, currentUser.UserId, cancellationToken);
    }
}
