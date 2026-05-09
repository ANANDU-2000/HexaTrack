using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize(Policy = "SuperAdmin")]
[Route("api/admin/audit")]
public sealed class AdminAuditController(IAdminAuditService audit) : ControllerBase
{
    [HttpGet]
    public Task<AdminAuditListResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
        => audit.ListAsync(page, pageSize, cancellationToken);
}
