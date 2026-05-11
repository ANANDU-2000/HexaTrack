using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Application.Services;

public sealed class OwnerService(HexaTrackDbContext db) : IOwnerService
{
    public async Task<OrganizationOverviewDto> GetOverviewAsync(Guid organizationId, CancellationToken ct)
    {
        var org = await db.Organizations
            .AsNoTracking()
            .Where(o => o.Id == organizationId)
            .Select(o => new { o.Name })
            .FirstOrDefaultAsync(ct) 
            ?? throw new KeyNotFoundException("Organization not found");

        int branchCount = await db.Branches.CountAsync(b => b.OrganizationId == organizationId, ct);
        int staffCount = await db.Users.CountAsync(u => u.OrganizationId == organizationId && u.OrganizationRole == "Staff", ct);

        // Aggregate transaction volumes across linked workspaces of these branches
        var branchWorkspaceIds = await db.Branches
            .Where(b => b.OrganizationId == organizationId && b.WorkspaceId != null)
            .Select(b => new { b.Id, b.Name, b.WorkspaceId })
            .ToListAsync(ct);

        decimal totalFlow = 0;
        var velocity = new List<BranchStatDto>();

        foreach (var bw in branchWorkspaceIds)
        {
            // Total volume is sum of abs transaction amounts in this branch's workspace
            decimal volume = await db.Transactions
                .AsNoTracking()
                .Where(t => t.WorkspaceId == bw.WorkspaceId)
                .SumAsync(t => Math.Abs(t.Amount), ct);
            
            totalFlow += volume;
            velocity.Add(new BranchStatDto(bw.Name, volume, 0)); // Pct calculated later
        }

        // Normalize percentages
        if (totalFlow > 0)
        {
            velocity = velocity
                .Select(v => v with { Percentage = (double)(v.Volume / totalFlow) * 100 })
                .OrderByDescending(v => v.Volume)
                .ToList();
        }

        return new OrganizationOverviewDto(org.Name, branchCount, staffCount, totalFlow, velocity);
    }

    public async Task<List<Branch>> GetBranchesAsync(Guid organizationId, CancellationToken ct)
    {
        return await db.Branches
            .AsNoTracking()
            .Where(b => b.OrganizationId == organizationId)
            .OrderBy(b => b.Name)
            .ToListAsync(ct);
    }

    public async Task<List<User>> GetStaffAsync(Guid organizationId, CancellationToken ct)
    {
        return await db.Users
            .AsNoTracking()
            .Where(u => u.OrganizationId == organizationId && u.OrganizationRole == "Staff")
            .OrderBy(u => u.DisplayName)
            .ToListAsync(ct);
    }

    public async Task<User> CreateStaffAsync(Guid organizationId, CreateOwnerStaffRequest request, CancellationToken ct)
    {
        // 1. Verify branch authority & existence within the organization
        var branchValid = await db.Branches.AnyAsync(b => b.Id == request.BranchId && b.OrganizationId == organizationId, ct);
        if (!branchValid) throw new UnauthorizedAccessException("Selected branch does not belong to your organization matrix.");

        // 2. Ensure account integrity collision prevention
        var existing = await db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower(), ct);
        if (existing) throw new InvalidOperationException("A user vector with this email identity is already registered in our persistence layer.");

        // 3. Build secure entity graph
        var staff = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            DisplayName = request.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            OrganizationId = organizationId,
            BranchId = request.BranchId,
            OrganizationRole = "Staff",
            Department = request.Department.Trim()
        };

        db.Users.Add(staff);
        await db.SaveChangesAsync(ct);
        return staff;
    }
}
