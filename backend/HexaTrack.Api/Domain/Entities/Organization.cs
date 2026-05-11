using System;
using System.Collections.Generic;
using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Organization
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public string? Slug { get; set; }
    public OrgPlan Plan { get; set; } = OrgPlan.Free;
    public bool IsActive { get; set; } = true;
    public bool IsSuspended { get; set; }
    public DateTimeOffset? SuspendedAt { get; set; }
    public string? SuspendReason { get; set; }
    public string? BaseCurrency { get; set; }
    public int MaxBranches { get; set; } = 1;
    public int MaxStaff { get; set; } = 5;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DeletedAt { get; set; }

    public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public ICollection<User> Members { get; set; } = new List<User>();
}
