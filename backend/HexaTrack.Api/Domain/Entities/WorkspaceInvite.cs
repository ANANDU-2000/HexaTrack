using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class WorkspaceInvite
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public string Email { get; set; } = "";
    public string TokenHash { get; set; } = "";
    public WorkspaceRole Role { get; set; } = WorkspaceRole.Member;
    public Guid InvitedByUserId { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? AcceptedAt { get; set; }

    public Workspace? Workspace { get; set; }
    public User? InvitedBy { get; set; }
}
