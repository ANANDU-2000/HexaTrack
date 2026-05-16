using System;
using System.Collections.Generic;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Branch
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrganizationId { get; set; }
    public required string Name { get; set; }
    public string? Code { get; set; }
    public string? Currency { get; set; }
    public string? Timezone { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsEnabled { get; set; } = true;
    public Guid? ManagerUserId { get; set; }
    public Guid? WorkspaceId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Organization? Organization { get; set; }
    public Workspace? Workspace { get; set; }
    public ICollection<User> Staff { get; set; } = new List<User>();
}
