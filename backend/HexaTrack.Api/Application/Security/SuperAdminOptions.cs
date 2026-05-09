namespace HexaTrack.Api.Application.Security;

public sealed class SuperAdminOptions
{
    public const string SectionName = "SuperAdmin";

    /// <summary>Normalized emails granted super-admin on startup (development/support bootstrap).</summary>
    public string[] BootstrapEmails { get; set; } = [];
}
