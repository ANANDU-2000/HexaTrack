using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Asset
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    public decimal PurchaseAmount { get; set; }
    public DateTimeOffset PurchaseDate { get; set; } = DateTimeOffset.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = "Active";

    [MaxLength(500)]
    public string? Notes { get; set; }

    public Guid OrganizationId { get; set; }
    public Organization? Organization { get; set; }

    public Guid BranchId { get; set; }
    public Branch? Branch { get; set; }

    public Guid? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
