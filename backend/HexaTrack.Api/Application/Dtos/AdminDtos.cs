using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Application.Dtos;

public sealed record AuthMeResponse(UserDto User, bool IsSuperAdmin);
public sealed record AdminUserListItemDto(
    Guid Id,
    string Email,
    string DisplayName,
    DateTimeOffset CreatedAt,
    bool IsSuperAdmin,
    bool IsLocked,
    SubscriptionPlan? SubscriptionPlan);
public sealed record AdminUserListResult(IReadOnlyCollection<AdminUserListItemDto> Items, int Page, int PageSize, int TotalCount);
public sealed record AdminCreateUserRequest(
    string Email,
    string Password,
    string WorkspaceName,
    WorkspaceType WorkspaceType,
    string Currency,
    bool IsSuperAdmin,
    WorkspaceRole? InitialWorkspaceRole);
public sealed record AdminCreateUserResponse(Guid Id, string Email, string DisplayName, bool IsSuperAdmin);
public sealed record SetSuperAdminRequest(bool IsSuperAdmin);
public sealed record SetUserLockedRequest(bool Locked);
public sealed record AdminAuditLogDto(
    Guid Id,
    Guid ActorUserId,
    string Action,
    string? TargetType,
    Guid? TargetId,
    string? IpAddress,
    DateTimeOffset CreatedAt);
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
public sealed record AdminWorkspaceListItemDto(
    Guid Id,
    string Name,
    WorkspaceType Type,
    Guid OwnerUserId,
    string OwnerEmail,
    DateTimeOffset CreatedAt,
    int MemberCount,
    SubscriptionPlan? OwnerSubscriptionPlan);
public sealed record AdminWorkspaceListResult(IReadOnlyList<AdminWorkspaceListItemDto> Items, int Page, int PageSize, int TotalCount);

public sealed record AdminAnalyticsOverviewDto(
    int TotalUsers,
    int SuperAdminUsers,
    int LockedUsers,
    int TotalWorkspaces,
    int ActiveSubscriptions,
    long AiPromptTokensLast30Days,
    long AiCompletionTokensLast30Days);

public sealed record AdminTimeSeriesPointDto(string Date, int Value);

public sealed record AdminTokenUsageDayDto(string Date, long PromptTokens, long CompletionTokens);

public sealed record AdminSubscriptionTierDto(string Plan, int Count);

public sealed record AdminTokenCostDayDto(string Date, decimal EstimatedCostUsd);

public sealed record AdminExpenseCategoryAggDto(
    string CategoryName,
    string Currency,
    decimal TotalAmount,
    int TransactionCount);

public sealed record AdminAnalyticsDashboardDto(
    IReadOnlyList<AdminTimeSeriesPointDto> NewUsersByDay,
    IReadOnlyList<AdminTimeSeriesPointDto> CumulativeUsersByDay,
    IReadOnlyList<AdminTimeSeriesPointDto> NewWorkspacesByDay,
    IReadOnlyList<AdminTimeSeriesPointDto> CumulativeWorkspacesByDay,
    IReadOnlyList<AdminTokenUsageDayDto> TokenUsageByDay,
    IReadOnlyList<AdminSubscriptionTierDto> ActiveSubscriptionsByPlan,
    decimal EstimatedMrrInr,
    int PayingSubscriptionCount,
    decimal AverageRevenuePerPayingUserInr,
    IReadOnlyList<AdminTimeSeriesPointDto> ActiveUsersByDay,
    IReadOnlyList<AdminTimeSeriesPointDto> TransactionsByDay,
    IReadOnlyList<AdminTimeSeriesPointDto> NewPayingSubscriptionsByDay,
    IReadOnlyList<AdminTokenCostDayDto> TokenEstimatedCostByDay,
    IReadOnlyList<AdminExpenseCategoryAggDto> ExpenseCategoryTotals);
