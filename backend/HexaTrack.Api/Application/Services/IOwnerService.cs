using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain.Entities;

namespace HexaTrack.Api.Application.Services;

public interface IOwnerService
{
    Task<OrganizationOverviewDto> GetOverviewAsync(Guid organizationId, CancellationToken ct);
    Task<List<Branch>> GetBranchesAsync(Guid organizationId, CancellationToken ct);
    Task<List<AdminUserListItemDto>> GetStaffAsync(Guid organizationId, Guid? branchId, string? query, CancellationToken ct);
    Task<AdminUserListItemDto> CreateStaffAsync(Guid organizationId, CreateOwnerStaffRequest request, CancellationToken ct);
    Task<List<AdminUserListItemDto>> GetBranchStaffAsync(Guid organizationId, Guid branchId, CancellationToken ct);
    Task<AdminUserListItemDto> ReassignStaffAsync(Guid organizationId, Guid userId, StaffReassignRequest request, CancellationToken ct);
}

public sealed record CreateOwnerStaffRequest(
    string FullName,
    string Email,
    string Password,
    Guid BranchId,
    string Department
);

public sealed record StaffReassignRequest(Guid? BranchId, string? Department);

public sealed record StaffAssignBranchRequest(Guid UserId, Guid BranchId);

public sealed record OrganizationOverviewDto(
    string Name,
    int BranchCount,
    int StaffCount,
    decimal TotalFlow,
    List<BranchStatDto> BranchVelocity);

public sealed record BranchStatDto(string Name, decimal Volume, double Percentage);
