using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IWorkspaceInviteService
{
    Task<CreateInviteResponse> CreateInviteAsync(Guid workspaceId, CreateWorkspaceInviteRequest request, Guid invitedByUserId, CancellationToken cancellationToken);
}

public sealed class WorkspaceInviteService(HexaTrackDbContext db) : IWorkspaceInviteService
{
    public async Task<CreateInviteResponse> CreateInviteAsync(Guid workspaceId, CreateWorkspaceInviteRequest request, Guid invitedByUserId, CancellationToken cancellationToken)
    {
        WorkspaceMember? membership = await db.WorkspaceMembers
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.WorkspaceId == workspaceId && x.UserId == invitedByUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("You are not a member of this workspace.");

        if (membership.Role != WorkspaceRole.Owner && membership.Role != WorkspaceRole.Admin)
        {
            throw new UnauthorizedAccessException("Only owners and admins can invite members.");
        }

        string email = request.Email.Trim().ToLowerInvariant();
        if (await db.Users.AsNoTracking().AnyAsync(x => x.Email == email, cancellationToken))
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        bool alreadyInWorkspace = await (
            from m in db.WorkspaceMembers
            join u in db.Users on m.UserId equals u.Id
            where m.WorkspaceId == workspaceId && u.Email == email
            select m).AnyAsync(cancellationToken);
        if (alreadyInWorkspace)
        {
            throw new InvalidOperationException("This email is already a member of the workspace.");
        }

        Span<byte> bytes = stackalloc byte[32];
        RandomNumberGenerator.Fill(bytes);
        string plainToken = Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

        var invite = new WorkspaceInvite
        {
            WorkspaceId = workspaceId,
            Email = email,
            TokenHash = InviteTokenHasher.Hash(plainToken),
            Role = request.Role,
            InvitedByUserId = invitedByUserId,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(7),
            CreatedAt = DateTimeOffset.UtcNow,
        };

        db.WorkspaceInvites.Add(invite);
        await db.SaveChangesAsync(cancellationToken);

        return new CreateInviteResponse(plainToken);
    }
}
