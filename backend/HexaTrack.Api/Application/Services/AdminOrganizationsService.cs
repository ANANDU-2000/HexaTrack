using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminOrganizationsService
{
    Task<Organization> CreateOrganizationAsync(CreateOrganizationRequest request, CancellationToken ct = default);
    Task<Branch> CreateBranchAsync(CreateBranchRequest request, CancellationToken ct = default);
    Task<User> AddOwnerAsync(AddOwnerRequest request, CancellationToken ct = default);
    Task<User> AddStaffAsync(AddStaffRequest request, CancellationToken ct = default);
    Task<AdminOrganizationListResult> ListAsync(string? query, int page, int pageSize, CancellationToken ct = default);
    Task<AdminOrganizationAnalyticsOverview> GetAnalyticsAsync(CancellationToken ct = default);
    Task<List<Organization>> GetAllLightAsync(CancellationToken ct = default);
    Task<List<Branch>> GetAllBranchesLightAsync(Guid? organizationId, CancellationToken ct = default);
}

public sealed class AdminOrganizationsService(HexaTrackDbContext db) : IAdminOrganizationsService
{
    public async Task<Organization> CreateOrganizationAsync(CreateOrganizationRequest request, CancellationToken ct = default)
    {
        var org = new Organization
        {
            Name = request.Name.Trim(),
            Slug = request.Slug?.Trim().ToLowerInvariant() ?? Guid.NewGuid().ToString("N")[..8],
            Plan = request.Plan ?? "Free",
            BaseCurrency = request.Currency ?? "USD",
            MaxBranches = request.MaxBranches > 0 ? request.MaxBranches : 1,
            MaxStaff = request.MaxStaff > 0 ? request.MaxStaff : 5,
            Status = "Active"
        };

        db.Organizations.Add(org);
        await db.SaveChangesAsync(ct);

        // Provision default owner user record automatically as requested
        var existing = await db.Users.FirstOrDefaultAsync(u => u.Email == request.OwnerEmail.ToLower(), ct);
        if (existing != null)
        {
            existing.OrganizationId = org.Id;
            existing.OrganizationRole = "Owner";
        }
        else
        {
            var user = new User
            {
                Email = request.OwnerEmail.Trim().ToLowerInvariant(),
                DisplayName = request.OwnerName.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.OwnerPassword), // Provided explicit initial pass
                OrganizationId = org.Id,
                OrganizationRole = "Owner"
            };
            db.Users.Add(user);
        }
        
        await db.SaveChangesAsync(ct);
        return org;
    }

    public async Task<Branch> CreateBranchAsync(CreateBranchRequest request, CancellationToken ct = default)
    {
        // Optionally provision a workspace alongside it
        var ws = new Workspace
        {
            Name = $"{request.Name} Ledger",
            Currency = request.Currency ?? "USD",
            Type = Domain.WorkspaceType.Business,
            OwnerUserId = Guid.Empty // Will assign later or keep blank
        };
        db.Workspaces.Add(ws);
        await db.SaveChangesAsync(ct);

        var branch = new Branch
        {
            OrganizationId = request.OrganizationId,
            Name = request.Name.Trim(),
            Code = request.Code,
            Currency = request.Currency,
            Timezone = request.Timezone,
            Address = request.Address,
            Phone = request.Phone,
            WorkspaceId = ws.Id
        };

        db.Branches.Add(branch);
        await db.SaveChangesAsync(ct);
        return branch;
    }

    public async Task<User> AddOwnerAsync(AddOwnerRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), ct);
        if (user == null)
        {
            user = new User
            {
                Email = request.Email.Trim().ToLowerInvariant(),
                DisplayName = request.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                OrganizationId = request.OrganizationId,
                OrganizationRole = "Owner"
            };
            db.Users.Add(user);
        }
        else
        {
            user.OrganizationId = request.OrganizationId;
            user.OrganizationRole = "Owner";
        }
        
        await db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> AddStaffAsync(AddStaffRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), ct);
        if (user == null)
        {
            user = new User
            {
                Email = request.Email.Trim().ToLowerInvariant(),
                DisplayName = request.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                OrganizationId = request.OrganizationId,
                BranchId = request.BranchId,
                OrganizationRole = "Staff",
                Department = request.Department
            };
            db.Users.Add(user);
        }
        else
        {
            user.OrganizationId = request.OrganizationId;
            user.BranchId = request.BranchId;
            user.OrganizationRole = "Staff";
            user.Department = request.Department;
        }

        await db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<AdminOrganizationListResult> ListAsync(string? query, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<Organization> q = db.Organizations.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query))
        {
            var t = query.Trim().ToLowerInvariant();
            q = q.Where(x => x.Name.ToLower().Contains(t) || x.Slug.ToLower().Contains(t));
        }

        int total = await q.CountAsync(ct);
        var orgs = await q.OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        // Explicitly compute metrics in C# for reliable data binding without heavy outer joins if they get too complex
        var ids = orgs.Select(o => o.Id).ToList();
        var branchMap = await db.Branches.Where(b => ids.Contains(b.OrganizationId)).GroupBy(b => b.OrganizationId).Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.Count, ct);
        var members = await db.Users.Where(u => u.OrganizationId.HasValue && ids.Contains(u.OrganizationId.Value)).ToListAsync(ct);

        var listItems = orgs.Select(o => new OrganizationListItemDto(
            o.Id,
            o.Name,
            o.Slug,
            o.Plan,
            o.Status,
            o.CreatedAt,
            branchMap.GetValueOrDefault(o.Id, 0),
            members.Count(m => m.OrganizationId == o.Id && m.OrganizationRole == "Owner"),
            members.Count(m => m.OrganizationId == o.Id && m.OrganizationRole == "Staff"),
            CalculateEstimateMrr(o.Plan)
        )).ToList();

        return new AdminOrganizationListResult(listItems, page, pageSize, total);
    }

    public async Task<AdminOrganizationAnalyticsOverview> GetAnalyticsAsync(CancellationToken ct = default)
    {
        int totalOrgs = await db.Organizations.CountAsync(ct);
        int branches = await db.Branches.CountAsync(ct);
        int owners = await db.Users.CountAsync(u => u.OrganizationRole == "Owner", ct);
        int staff = await db.Users.CountAsync(u => u.OrganizationRole == "Staff", ct);

        var orgPlans = await db.Organizations.Select(o => o.Plan).ToListAsync(ct);
        decimal totalMrr = orgPlans.Sum(CalculateEstimateMrr);

        return new AdminOrganizationAnalyticsOverview(totalOrgs, owners, staff, branches, totalMrr);
    }

    public async Task<List<Organization>> GetAllLightAsync(CancellationToken ct = default)
    {
        return await db.Organizations
            .AsNoTracking()
            .OrderBy(o => o.Name)
            .Select(o => new Organization { Id = o.Id, Name = o.Name })
            .ToListAsync(ct);
    }

    public async Task<List<Branch>> GetAllBranchesLightAsync(Guid? organizationId, CancellationToken ct = default)
    {
        var q = db.Branches.AsNoTracking();
        if (organizationId.HasValue)
        {
            q = q.Where(b => b.OrganizationId == organizationId.Value);
        }
        return await q
            .OrderBy(b => b.Name)
            .Select(b => new Branch { Id = b.Id, Name = b.Name, OrganizationId = b.OrganizationId })
            .ToListAsync(ct);
    }

    private static decimal CalculateEstimateMrr(string plan)
    {
        return plan switch
        {
            "Enterprise" => 4500,
            "Pro Max" => 1200,
            "Growth" => 299,
            "Basic" => 99,
            _ => 0
        };
    }
}
