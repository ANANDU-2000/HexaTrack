using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/feature-flags")]
public sealed class AdminFeatureFlagsController(ICurrentUser currentUser, IAdminFeatureFlagsService flags) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<FeatureFlagDto>> List(CancellationToken cancellationToken)
        => flags.ListAsync(cancellationToken);

    [HttpPut("{key}")]
    public Task Upsert(string key, [FromBody] UpsertFeatureFlagRequest body, CancellationToken cancellationToken)
        => flags.UpsertAsync(key, body.Value, currentUser.UserId, cancellationToken);
}
