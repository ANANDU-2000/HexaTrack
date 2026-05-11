using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Domain.Entities;

namespace HexaTrack.Api.Application.Services;

public interface IOwnerService
{
    Task<OrganizationOverviewDto> GetOverviewAsync(Guid organizationId, CancellationToken ct);
    Task<List<Branch>> GetBranchesAsync(Guid organizationId, CancellationToken ct);
    Task<List<User>> GetStaffAsync(Guid organizationId, CancellationToken ct);
}

public sealed record OrganizationOverviewDto(
    string Name,
    int BranchCount,
    int StaffCount,
    decimal TotalFlow,
    List<BranchStatDto> BranchVelocity);

public sealed record BranchStatDto(string Name, decimal Volume, double Percentage);
