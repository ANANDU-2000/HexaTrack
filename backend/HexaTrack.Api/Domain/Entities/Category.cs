using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public Guid UserId { get; set; }
    public Guid? OrganizationId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public required string Name { get; set; }
    public TransactionType Type { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public bool IsArchived { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    public Category? ParentCategory { get; set; }
    public ICollection<Category> Subcategories { get; set; } = new List<Category>();
    public Workspace? Workspace { get; set; }
    public Organization? Organization { get; set; }
    public Branch? Branch { get; set; }
}

