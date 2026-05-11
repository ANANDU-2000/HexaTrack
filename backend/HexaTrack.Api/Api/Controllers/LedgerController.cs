using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/ledger")]
public sealed class LedgerController(ICurrentUser currentUser, HexaTrackDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLedger([FromQuery] int page = 1, [FromQuery] int pageSize = 100, CancellationToken ct = default)
    {
        Guid? orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var branches = await db.Branches
            .AsNoTracking()
            .Where(b => b.OrganizationId == orgId.Value && b.WorkspaceId != null)
            .Select(b => new { b.Name, WorkspaceId = b.WorkspaceId!.Value })
            .ToListAsync(ct);
        var workspaceIds = branches.Select(b => b.WorkspaceId).ToList();

        var totalCount = await db.Transactions
            .AsNoTracking()
            .Where(t => workspaceIds.Contains(t.WorkspaceId))
            .CountAsync(ct);

        var rows = await db.Transactions
            .AsNoTracking()
            .Where(t => workspaceIds.Contains(t.WorkspaceId))
            .Include(t => t.Category)
            .Include(t => t.Account)
            .OrderByDescending(t => t.OccurredOn)
            .ThenByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id,
                t.OccurredOn,
                t.Amount,
                t.Currency,
                t.Type,
                t.Merchant,
                t.Note,
                category = t.Category != null ? t.Category.Name : "Uncategorized",
                account = t.Account != null ? t.Account.Name : "General",
                t.WorkspaceId
            })
            .ToListAsync(ct);

        return Ok(new
        {
            items = rows.Select(row => new
            {
                row.Id,
                row.OccurredOn,
                row.Amount,
                row.Currency,
                row.Type,
                row.Merchant,
                row.Note,
                row.category,
                row.account,
                branchName = branches.FirstOrDefault(branch => branch.WorkspaceId == row.WorkspaceId)?.Name ?? "Unknown"
            }),
            page,
            pageSize,
            totalCount,
            consolidatedBalance = await db.Accounts
                .AsNoTracking()
                .Where(account => workspaceIds.Contains(account.WorkspaceId) && !account.IsArchived)
                .SumAsync(account => account.Balance, ct)
        });
    }
}
