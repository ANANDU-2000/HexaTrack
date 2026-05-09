using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Application.Dtos;

public sealed record AuthMeResponse(UserDto User, bool IsSuperAdmin);
public sealed record AdminUserListItemDto(Guid Id, string Email, string DisplayName, DateTimeOffset CreatedAt, bool IsSuperAdmin, bool IsLocked);
public sealed record AdminUserListResult(IReadOnlyCollection<AdminUserListItemDto> Items, int Page, int PageSize, int TotalCount);
public sealed record SetUserLockedRequest(bool Locked);
public sealed record AdminAuditLogDto(Guid Id, Guid ActorUserId, string Action, string? TargetType, Guid? TargetId, DateTimeOffset CreatedAt);
public sealed record UpsertFeatureFlagRequest(string Value);
public sealed record FeatureFlagDto(string Key, string Value, DateTimeOffset UpdatedAt);
public sealed record InviteAcceptRequest(string Token, string Password);
public sealed record CreateWorkspaceInviteRequest(string Email, WorkspaceRole Role);
public sealed record CreateInviteResponse(string Token);
public sealed record SetUserSubscriptionRequest(SubscriptionPlan Plan);
public sealed record GlobalSettingDto(string Key, string Value, DateTimeOffset UpdatedAt);
public sealed record AdminAuditListResult(IReadOnlyList<AdminAuditLogDto> Items, int Page, int PageSize, int TotalCount);
public sealed record AiUsageSummaryRow(Guid UserId, string Email, long TotalPromptTokens, long TotalCompletionTokens);
public sealed record AiUsageSummaryResult(IReadOnlyList<AiUsageSummaryRow> Rows);
public sealed record AdminWorkspaceListItemDto(Guid Id, string Name, Guid OwnerUserId, string OwnerEmail, DateTimeOffset CreatedAt);
public sealed record AdminWorkspaceListResult(IReadOnlyList<AdminWorkspaceListItemDto> Items, int Page, int PageSize, int TotalCount);
