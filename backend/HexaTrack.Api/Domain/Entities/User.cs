namespace HexaTrack.Api.Domain.Entities;

public sealed class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? GoogleSubject { get; set; }
    public required string DisplayName { get; set; }
    public bool IsSuperAdmin { get; set; }
    public bool IsLocked { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();
}

