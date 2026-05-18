using System.Security.Claims;
using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Application.Security;

public interface ICurrentUser
{
    Guid UserId { get; }
    Guid? OrganizationId { get; }
    Guid? BranchId { get; }
    UserMode Mode { get; }
}

public sealed class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public Guid UserId
    {
        get
        {
            string? value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(value, out Guid userId)
                ? userId
                : throw new UnauthorizedAccessException("Authenticated user id is missing.");
        }
    }

    public Guid? OrganizationId
    {
        get
        {
            string? val = httpContextAccessor.HttpContext?.User.FindFirstValue(HexaTrackClaims.OrganizationId);
            return Guid.TryParse(val, out Guid orgId) ? orgId : null;
        }
    }

    public Guid? BranchId
    {
        get
        {
            string? val = httpContextAccessor.HttpContext?.User.FindFirstValue(HexaTrackClaims.BranchId);
            return Guid.TryParse(val, out Guid branchId) ? branchId : null;
        }
    }

    public UserMode Mode
    {
        get
        {
            string? val = httpContextAccessor.HttpContext?.User.FindFirstValue(HexaTrackClaims.UserMode);
            return Enum.TryParse(val, out UserMode mode) ? mode : UserMode.Individual;
        }
    }
}

