using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/owner/integrations")]
public sealed class OwnerIntegrationsController(ICurrentUser currentUser, HexaTrackDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetIntegrations(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        var activeInts = await db.Integrations
            .AsNoTracking()
            .Where(i => i.OrganizationId == orgId.Value)
            .ToListAsync(ct);

        return Ok(activeInts);
    }

    [HttpPost("connect")]
    public async Task<IActionResult> Connect([FromBody] ConnectIntegrationRequest req, CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        var existing = await db.Integrations
            .FirstOrDefaultAsync(i => i.OrganizationId == orgId && i.Provider == req.Provider, ct);

        if (existing != null)
        {
            existing.IsConnected = true;
            existing.ConnectionStatus = "Connected";
            existing.LastSyncedAt = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var newItem = new Integration
            {
                OrganizationId = orgId.Value,
                Provider = req.Provider,
                IsConnected = true,
                ConnectionStatus = "Connected",
                LastSyncedAt = DateTime.UtcNow
            };
            db.Integrations.Add(newItem);
        }

        await db.SaveChangesAsync(ct);
        return Ok(new { status = "Connected" });
    }
}

public sealed record ConnectIntegrationRequest(string Provider);
