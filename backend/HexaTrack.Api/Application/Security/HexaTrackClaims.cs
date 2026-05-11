namespace HexaTrack.Api.Application.Security;

/// <summary>Custom JWT claim types (camelCase in JSON per default JWT naming).</summary>
public static class HexaTrackClaims
{
    /// <summary>Boolean string: "true" or "false". Mirrors DB <c>User.IsSuperAdmin</c> at issuance time.</summary>
    public const string IsSuperAdmin = "is_super_admin";
    public const string OrganizationId = "org_id";
}
