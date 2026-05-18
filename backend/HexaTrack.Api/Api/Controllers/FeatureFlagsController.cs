using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/feature-flags")]
public sealed class FeatureFlagsController(ICurrentUser currentUser, IAdminFeatureFlagsService flags) : ControllerBase
{
    [HttpGet]
    public Task<Dictionary<string, bool>> GetEffective(CancellationToken cancellationToken)
        => flags.GetEffectiveFlagsAsync(currentUser.UserId, currentUser.OrganizationId, cancellationToken);
}
