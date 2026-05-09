using System.Security.Claims;

namespace HexaTrack.Api.Application.Security;

public interface ICurrentUser
{
    Guid UserId { get; }
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
}

