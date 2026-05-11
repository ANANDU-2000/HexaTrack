using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Infrastructure;
using DomainRoute = HexaTrack.Api.Domain.Entities.Route;

namespace HexaTrack.Api.Application.Services;

public interface IAdminRoutesService
{
    Task<PagedResult<RouteDto>> ListAsync(Guid? organizationId, Guid? branchId, int page, int pageSize, CancellationToken ct);
    Task<RouteDto?> GetAsync(Guid id, CancellationToken ct);
    Task<RouteDto> CreateAsync(CreateRouteRequest request, CancellationToken ct);
    Task<RouteDto> UpdateAsync(Guid id, UpdateRouteRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
    Task AssignStaffAsync(Guid id, Guid userId, CancellationToken ct);
    Task UnassignStaffAsync(Guid id, Guid userId, CancellationToken ct);
}

public sealed class AdminRoutesService(HexaTrackDbContext db) : IAdminRoutesService
{
    public async Task<PagedResult<RouteDto>> ListAsync(Guid? organizationId, Guid? branchId, int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<DomainRoute> query = db.Routes.AsNoTracking();
        if (organizationId.HasValue)
        {
            query = query.Where(x => x.OrganizationId == organizationId.Value);
        }

        if (branchId.HasValue)
        {
            query = query.Where(x => x.BranchId == branchId.Value);
        }

        int total = await query.CountAsync(ct);
        List<RouteDto> items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new RouteDto(
                x.Id,
                x.OrganizationId,
                x.BranchId,
                x.Name,
                x.Code,
                x.Description,
                x.IsActive,
                x.AssignedStaff.Count,
                x.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<RouteDto>(items, page, pageSize, total);
    }

    public async Task<RouteDto?> GetAsync(Guid id, CancellationToken ct)
        => await db.Routes.AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new RouteDto(
                x.Id,
                x.OrganizationId,
                x.BranchId,
                x.Name,
                x.Code,
                x.Description,
                x.IsActive,
                x.AssignedStaff.Count,
                x.CreatedAt))
            .FirstOrDefaultAsync(ct);

    public async Task<RouteDto> CreateAsync(CreateRouteRequest request, CancellationToken ct)
    {
        await ValidateOrgAndBranchAsync(request.OrganizationId, request.BranchId, ct);

        var route = new DomainRoute
        {
            OrganizationId = request.OrganizationId,
            BranchId = request.BranchId,
            Name = request.Name.Trim(),
            Code = string.IsNullOrWhiteSpace(request.Code) ? null : request.Code.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
        };

        db.Routes.Add(route);
        await db.SaveChangesAsync(ct);
        return ToDto(route, 0);
    }

    public async Task<RouteDto> UpdateAsync(Guid id, UpdateRouteRequest request, CancellationToken ct)
    {
        DomainRoute route = await db.Routes.SingleOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new KeyNotFoundException("Route not found.");

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            route.Name = request.Name.Trim();
        }

        if (request.Code is not null)
        {
            route.Code = string.IsNullOrWhiteSpace(request.Code) ? null : request.Code.Trim();
        }

        if (request.Description is not null)
        {
            route.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        }

        if (request.IsActive.HasValue)
        {
            route.IsActive = request.IsActive.Value;
        }

        route.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        int staffCount = await db.Users.CountAsync(u => u.RouteId == route.Id, ct);
        return ToDto(route, staffCount);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        DomainRoute route = await db.Routes.SingleOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new KeyNotFoundException("Route not found.");

        await db.Users
            .Where(u => u.RouteId == id)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.RouteId, (Guid?)null), ct);

        db.Routes.Remove(route);
        await db.SaveChangesAsync(ct);
    }

    public async Task AssignStaffAsync(Guid id, Guid userId, CancellationToken ct)
    {
        DomainRoute route = await db.Routes.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new KeyNotFoundException("Route not found.");

        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == userId && u.OrganizationRole == "Staff", ct)
            ?? throw new KeyNotFoundException("Staff user not found.");

        if (user.OrganizationId != route.OrganizationId)
        {
            throw new InvalidOperationException("Staff user does not belong to this route's organization.");
        }

        if (route.BranchId.HasValue && user.BranchId != route.BranchId)
        {
            throw new InvalidOperationException("Staff user must belong to the route branch before assignment.");
        }

        user.RouteId = route.Id;
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    public async Task UnassignStaffAsync(Guid id, Guid userId, CancellationToken ct)
    {
        bool routeExists = await db.Routes.AnyAsync(x => x.Id == id, ct);
        if (!routeExists)
        {
            throw new KeyNotFoundException("Route not found.");
        }

        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == userId && u.RouteId == id, ct)
            ?? throw new KeyNotFoundException("Assigned staff user not found.");

        user.RouteId = null;
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    private async Task ValidateOrgAndBranchAsync(Guid organizationId, Guid? branchId, CancellationToken ct)
    {
        bool orgExists = await db.Organizations.AnyAsync(o => o.Id == organizationId, ct);
        if (!orgExists)
        {
            throw new InvalidOperationException("Organization not found.");
        }

        if (branchId.HasValue)
        {
            bool branchBelongsToOrg = await db.Branches.AnyAsync(b => b.Id == branchId.Value && b.OrganizationId == organizationId, ct);
            if (!branchBelongsToOrg)
            {
                throw new InvalidOperationException("The specified branch does not belong to the given organization.");
            }
        }
    }

    private static RouteDto ToDto(DomainRoute route, int staffCount)
        => new(route.Id, route.OrganizationId, route.BranchId, route.Name, route.Code, route.Description, route.IsActive, staffCount, route.CreatedAt);
}
