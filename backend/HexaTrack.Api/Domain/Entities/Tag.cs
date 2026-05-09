namespace HexaTrack.Api.Domain.Entities;

public sealed class Tag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public Guid UserId { get; set; }
    public required string Name { get; set; }

    public Workspace? Workspace { get; set; }
}

