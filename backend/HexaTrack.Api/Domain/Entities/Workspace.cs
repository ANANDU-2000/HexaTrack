using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Workspace
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OwnerUserId { get; set; }
    public required string Name { get; set; }
    public WorkspaceType Type { get; set; } = WorkspaceType.Personal;
    public WorkspaceMode Mode { get; set; } = WorkspaceMode.Individual;
    public Guid? OrganizationId { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsDefault { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User? Owner { get; set; }
    public ICollection<WorkspaceMember> Members { get; set; } = new List<WorkspaceMember>();
}
