using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Application.Dtos;

public sealed record AccountDto(Guid Id, string Name, AccountType Type, string Currency, decimal Balance);
public sealed record CreateAccountRequest(string Name, AccountType Type, string Currency, decimal OpeningBalance);
public sealed record UpdateAccountRequest(string Name, bool IsArchived);
public sealed record TransferRequest(Guid FromAccountId, Guid ToAccountId, decimal Amount, string Currency, decimal? FeeAmount, string? Note, DateOnly TransferOn, string IdempotencyKey);
public sealed record TransferDto(Guid Id, Guid FromAccountId, Guid ToAccountId, decimal Amount, string Currency, decimal? FeeAmount, DateOnly TransferOn);

public sealed record CategoryDto(Guid Id, Guid? ParentCategoryId, string Name, TransactionType Type, string? Color, string? Icon);
public sealed record CreateCategoryRequest(string Name, TransactionType Type, Guid? ParentCategoryId, string? Color, string? Icon);
public sealed record CreateSubcategoryRequest(string Name, string? Color, string? Icon);

public sealed record TagDto(Guid Id, string Name);
public sealed record UpsertTagRequest(string Name);

public sealed record PagedResult<T>(IReadOnlyCollection<T> Items, int Page, int PageSize, int TotalCount);
public sealed record TransactionSearchRequest(
    DateOnly? From,
    DateOnly? To,
    Guid? AccountId,
    Guid? CategoryId,
    Guid? TagId,
    string? Query,
    int Page = 1,
    int PageSize = 30,
    TransactionType? Type = null,
    bool TransfersOnly = false);
public sealed record TransactionDto(Guid Id, Guid AccountId, Guid CategoryId, TransactionType Type, decimal Amount, string Currency, string? Merchant, string? Note, DateOnly OccurredOn, IReadOnlyCollection<TagDto> Tags);
public sealed record CreateTransactionRequest(Guid AccountId, Guid CategoryId, TransactionType Type, decimal Amount, string Currency, string? Merchant, string? Note, DateOnly OccurredOn, IReadOnlyCollection<Guid>? TagIds, string? IdempotencyKey);

public sealed record RecurringTransactionDto(Guid Id, Guid AccountId, Guid CategoryId, TransactionType Type, RecurrenceFrequency Frequency, decimal Amount, string Currency, string? Note, DateOnly NextRunOn, DateOnly? EndsOn, bool IsActive);
public sealed record CreateRecurringTransactionRequest(Guid AccountId, Guid CategoryId, TransactionType Type, RecurrenceFrequency Frequency, decimal Amount, string Currency, string? Note, DateOnly NextRunOn, DateOnly? EndsOn);

public sealed record CreateGroupRequest(string Name, IReadOnlyCollection<string> Members);
public sealed record GroupDto(Guid Id, string Name, IReadOnlyCollection<GroupMemberDto> Members);
public sealed record GroupMemberDto(Guid Id, string DisplayName, Guid? UserId);
public sealed record CreateGroupExpenseRequest(Guid PaidByMemberId, string Description, decimal Amount, string Currency, SplitMethod SplitMethod, DateOnly ExpenseOn, IReadOnlyCollection<GroupExpenseSplitRequest>? Splits);
public sealed record GroupExpenseSplitRequest(Guid MemberId, decimal Amount, decimal? Percentage);
public sealed record GroupExpenseDto(Guid Id, string Description, decimal Amount, string Currency, SplitMethod SplitMethod, DateOnly ExpenseOn, IReadOnlyCollection<GroupExpenseSplitDto> Splits);
public sealed record GroupExpenseSplitDto(Guid MemberId, decimal OwedAmount, decimal? Percentage, SettlementStatus Status);
public sealed record GroupSettlementDto(Guid Id, Guid FromMemberId, Guid ToMemberId, decimal Amount, string Currency, SettlementStatus Status, DateOnly SettlementOn);

public sealed record CashflowPoint(DateOnly Period, decimal Income, decimal Expense, decimal Net);
public sealed record CategorySpend(Guid CategoryId, string CategoryName, decimal Amount);
public sealed record ReportSummary(decimal Income, decimal Expense, decimal Net, IReadOnlyCollection<CashflowPoint> Cashflow, IReadOnlyCollection<CategorySpend> SpendingByCategory);
public sealed record DashboardSummary(decimal TotalBalance, ReportSummary Report, IReadOnlyCollection<TransactionDto> RecentTransactions, IReadOnlyCollection<RecurringTransactionDto> RecurringDueSoon, string InsightLine);
public sealed record SubscriptionDto(SubscriptionPlan Plan, bool IsActive, DateTimeOffset? CurrentPeriodEndsAt);
public sealed record BackupJobDto(Guid Id, BackupStatus Status, string Provider, string? ObjectKey, DateTimeOffset RequestedAt, DateTimeOffset? CompletedAt);

public sealed record WorkspaceDto(Guid Id, string Name, WorkspaceType Type, string Currency, bool IsDefault);
public sealed record CreateWorkspaceRequest(string Name, WorkspaceType Type, string Currency);
public sealed record UpdateWorkspaceRequest(string Name, string Currency);

