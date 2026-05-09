namespace HexaTrack.Api.Application.Security;

public interface ICurrentWorkspace
{
    Guid WorkspaceId { get; }
}

public sealed class CurrentWorkspace(IHttpContextAccessor httpContextAccessor) : ICurrentWorkspace
{
    private const string ItemKey = "HexaTrack.WorkspaceId";

    public Guid WorkspaceId
    {
        get
        {
            if (httpContextAccessor.HttpContext?.Items.TryGetValue(ItemKey, out object? value) == true &&
                value is Guid id)
            {
                return id;
            }

            throw new InvalidOperationException("Workspace context is missing. Send X-Workspace-Id for this request.");
        }
    }

    internal static void SetWorkspace(HttpContext httpContext, Guid workspaceId)
        => httpContext.Items[ItemKey] = workspaceId;
}
