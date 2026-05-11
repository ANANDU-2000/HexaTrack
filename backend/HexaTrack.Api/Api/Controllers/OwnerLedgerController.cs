using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/owner/ledger")]
public sealed class OwnerLedgerController(ICurrentUser currentUser, HexaTrackDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLedger(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        // Gather all Workspace IDs linked to this organization's branches
        var workspaces = await db.Branches
            .AsNoTracking()
            .Where(b => b.OrganizationId == orgId.Value && b.WorkspaceId != null)
            .Select(b => new { b.WorkspaceId, b.Name })
            .ToListAsync(ct);

        var workspaceIds = workspaces.Select(w => w.WorkspaceId).ToList();

        // Fetch all transactions residing within these workspace channels
        var dbTxs = await db.Transactions
            .AsNoTracking()
            .Where(t => workspaceIds.Contains(t.WorkspaceId))
            .Include(t => t.Category)
            .Include(t => t.Account)
            .OrderByDescending(t => t.OccurredOn)
            .Take(100) 
            .Select(t => new {
                t.Id,
                t.OccurredOn,
                t.Amount,
                t.Currency,
                t.Type,
                t.Merchant,
                Category = t.Category != null ? t.Category.Name : "Uncategorized",
                Account = t.Account != null ? t.Account.Name : "General",
                t.WorkspaceId
            })
            .ToListAsync(ct);

        var result = dbTxs.Select(t => new {
            t.Id,
            t.OccurredOn,
            t.Amount,
            t.Currency,
            t.Type,
            t.Merchant,
            t.Category,
            t.Account,
            BranchName = workspaces.FirstOrDefault(w => w.WorkspaceId == t.WorkspaceId)?.Name ?? "Unknown"
        }).ToList();

        return Ok(result);
    }
}
