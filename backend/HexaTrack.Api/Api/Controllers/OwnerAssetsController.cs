using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/owner/assets")]
public sealed class OwnerAssetsController(ICurrentUser currentUser, HexaTrackDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> ListAssets(CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        var assets = await db.Assets
            .AsNoTracking()
            .Where(a => a.OrganizationId == orgId.Value)
            .Include(a => a.Branch)
            .Include(a => a.AssignedUser)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new {
                a.Id,
                a.Name,
                a.Code,
                a.Category,
                a.PurchaseAmount,
                a.PurchaseDate,
                a.Status,
                a.Notes,
                BranchName = a.Branch != null ? a.Branch.Name : "None",
                AssignedTo = a.AssignedUser != null ? a.AssignedUser.DisplayName : "Unassigned"
            })
            .ToListAsync(ct);

        return Ok(assets);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetRequest req, CancellationToken ct)
    {
        var orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        var branch = await db.Branches.AnyAsync(b => b.Id == req.BranchId && b.OrganizationId == orgId, ct);
        if (!branch) return BadRequest("Target branch does not belong to organization.");

        var asset = new Asset
        {
            Name = req.Name,
            Code = req.Code,
            Category = req.Category,
            PurchaseAmount = req.PurchaseAmount,
            PurchaseDate = req.PurchaseDate ?? DateTime.UtcNow,
            Status = "Active",
            Notes = req.Notes,
            OrganizationId = orgId.Value,
            BranchId = req.BranchId,
            AssignedUserId = req.AssignedUserId
        };

        db.Assets.Add(asset);
        await db.SaveChangesAsync(ct);
        return Ok(asset);
    }
}

public sealed record CreateAssetRequest(
    string Name,
    string Code,
    string Category,
    decimal PurchaseAmount,
    DateTime? PurchaseDate,
    Guid BranchId,
    Guid? AssignedUserId,
    string? Notes
);
