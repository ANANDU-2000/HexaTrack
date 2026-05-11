using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Integration
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string Provider { get; set; } = string.Empty; // e.g. GoogleDrive, Stripe, Slack

    public bool IsConnected { get; set; }

    [MaxLength(50)]
    public string ConnectionStatus { get; set; } = "Disconnected";

    public DateTime? LastSyncedAt { get; set; }

    public string? ConfigJson { get; set; } // Stores OAuth tokens / webhooks encrypted or encrypted string

    public Guid OrganizationId { get; set; }
    public Organization? Organization { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
