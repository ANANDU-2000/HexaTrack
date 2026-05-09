using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Api.Middleware;

public sealed class WorkspaceContextMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, HexaTrackDbContext db)
    {
        if (HttpMethods.IsOptions(context.Request.Method))
        {
            await next(context);
            return;
        }

        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await next(context);
            return;
        }

        if (context.User.Identity?.IsAuthenticated != true)
        {
            await next(context);
            return;
        }

        if (!RequiresWorkspaceHeader(context.Request))
        {
            await next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue("X-Workspace-Id", out Microsoft.Extensions.Primitives.StringValues headerValues) ||
            !Guid.TryParse(headerValues.ToString(), out Guid workspaceId))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = "X-Workspace-Id header is required and must be a valid GUID." });
            return;
        }

        string? userIdStr = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out Guid userId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = "Invalid authentication context." });
            return;
        }

        bool allowed = await db.Set<WorkspaceMember>()
            .AnyAsync(m => m.WorkspaceId == workspaceId && m.UserId == userId, context.RequestAborted);

        if (!allowed)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new { error = "You do not have access to this workspace." });
            return;
        }

        CurrentWorkspace.SetWorkspace(context, workspaceId);
        await next(context);
    }

    private static bool RequiresWorkspaceHeader(HttpRequest request)
    {
        PathString path = request.Path;
        string method = request.Method;

        if (path.StartsWithSegments("/api/admin"))
        {
            return false;
        }

        if (path.StartsWithSegments("/api/auth"))
        {
            return false;
        }

        if (path.StartsWithSegments("/api/workspaces"))
        {
            string p = path.Value?.TrimEnd('/') ?? "";
            bool isRoot = p.Equals("/api/workspaces", StringComparison.OrdinalIgnoreCase);
            if (isRoot && (method.Equals("GET", StringComparison.OrdinalIgnoreCase) ||
                           method.Equals("POST", StringComparison.OrdinalIgnoreCase)))
            {
                return false;
            }

            string suffix = p.Length > "/api/workspaces".Length
                ? p["/api/workspaces".Length..].TrimStart('/')
                : "";
            string firstSegment = suffix.Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).FirstOrDefault() ?? "";
            if (Guid.TryParse(firstSegment, out _) &&
                (method.Equals("PUT", StringComparison.OrdinalIgnoreCase) ||
                 method.Equals("DELETE", StringComparison.OrdinalIgnoreCase)))
            {
                return false;
            }
        }

        if (path.StartsWithSegments("/api/subscription") ||
            path.StartsWithSegments("/api/backup") ||
            path.StartsWithSegments("/api/groups"))
        {
            return false;
        }

        return true;
    }
}
