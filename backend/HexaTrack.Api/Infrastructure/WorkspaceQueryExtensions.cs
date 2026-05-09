using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Infrastructure;

public static class WorkspaceQueryExtensions
{
    public static IQueryable<TEntity> InWorkspace<TEntity>(this IQueryable<TEntity> query, Guid workspaceId)
        where TEntity : class
        => query.Where(e => EF.Property<Guid>(e, "WorkspaceId") == workspaceId);
}
