namespace HexaTrack.Api.Domain.Entities;

public sealed class Route
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrganizationId { get; set; }
    public Guid? BranchId { get; set; }
    public required string Name { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Organization? Organization { get; set; }
    public Branch? Branch { get; set; }
    public ICollection<User> AssignedStaff { get; set; } = new List<User>();
}
