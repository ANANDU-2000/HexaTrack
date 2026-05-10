using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[EnableRateLimiting("admin")]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/global-settings")]
public sealed class AdminGlobalSettingsController(ICurrentUser currentUser, IAdminGlobalSettingsService settings) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<GlobalSettingDto>> List(CancellationToken cancellationToken)
        => settings.ListAsync(cancellationToken);

    public sealed record UpsertGlobalSettingRequest(string Value);

    [HttpPut("{key}")]
    public Task Upsert(string key, [FromBody] UpsertGlobalSettingRequest body, CancellationToken cancellationToken)
        => settings.UpsertAsync(key, body.Value, currentUser.UserId, cancellationToken);
}
