namespace HexaTrack.Api.Domain.Entities;

public sealed class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? GoogleSubject { get; set; }
    public required string DisplayName { get; set; }
    public bool IsSuperAdmin { get; set; }
    public UserMode Mode { get; set; } = UserMode.Individual;
    public bool IsLocked { get; set; }
    public Guid? OrganizationId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? RouteId { get; set; }
    public string? OrganizationRole { get; set; } // "Owner", "Staff"
    public string? Department { get; set; }
    public long? PermissionOverrides { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DeletedAt { get; set; }

    public Organization? Organization { get; set; }
    public Branch? Branch { get; set; }
    public Route? Route { get; set; }
    public ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();
}

