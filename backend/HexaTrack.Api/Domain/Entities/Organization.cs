using System;
using System.Collections.Generic;

namespace HexaTrack.Api.Domain.Entities;

public sealed class Organization
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public string? Slug { get; set; }
    public string Plan { get; set; } = "Free";
    public string Status { get; set; } = "Active";
    public string? BaseCurrency { get; set; }
    public int MaxBranches { get; set; } = 1;
    public int MaxStaff { get; set; } = 5;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public ICollection<User> Members { get; set; } = new List<User>();
}
