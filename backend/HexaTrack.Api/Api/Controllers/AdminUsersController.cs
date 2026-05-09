using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/users")]
public sealed class AdminUsersController(ICurrentUser currentUser, IAdminUsersService users) : ControllerBase
{
    [HttpGet]
    public Task<AdminUserListResult> List(
        [FromQuery] string? q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
        => users.ListAsync(q, page, pageSize, cancellationToken);

    [HttpPut("{id:guid}/locked")]
    public Task SetLocked(Guid id, [FromBody] SetUserLockedRequest body, CancellationToken cancellationToken)
        => users.SetLockedAsync(id, body.Locked, currentUser.UserId, cancellationToken);

    [HttpPut("{id:guid}/subscription")]
    public Task SetSubscription(Guid id, [FromBody] SetUserSubscriptionRequest body, CancellationToken cancellationToken)
        => users.SetSubscriptionPlanAsync(id, body.Plan, currentUser.UserId, cancellationToken);
}
