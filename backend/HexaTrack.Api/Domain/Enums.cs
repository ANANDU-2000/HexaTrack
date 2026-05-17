namespace HexaTrack.Api.Domain;

public enum AccountType
{
    Cash = 1,
    Bank = 2,
    Wallet = 3,
    Credit = 4,
    Savings = 5,
    Investment = 6
}

public enum TransactionType
{
    Income = 1,
    Expense = 2,
    Transfer = 3
}

public enum RecurrenceFrequency
{
    Daily = 1,
    Weekly = 2,
    Monthly = 3,
    Yearly = 4
}

public enum SplitMethod
{
    Equal = 1,
    Custom = 2,
    Percentage = 3
}

public enum SettlementStatus
{
    Pending = 1,
    Settled = 2,
    Cancelled = 3
}

public enum SubscriptionPlan
{
    Free = 1,
    Basic = 2,
    Pro = 3,
    ProMax = 4
}

public enum OrgPlan
{
    Free = 0,
    Basic = 1,
    Growth = 2,
    Pro = 3,
    ProMax = 4,
    Enterprise = 5
}

public enum BackupStatus
{
    Pending = 1,
    Completed = 2,
    Failed = 3
}

public enum WorkspaceType
{
    Personal = 1,
    Business = 2,
    Family = 3
}

public enum WorkspaceMode
{
    Individual = 1,
    Organization = 2,
    Branch = 3,
    Enterprise = 4
}

public enum UserMode
{
    Individual = 1,
    OrganizationOwner = 2,
    OrganizationStaff = 3,
    BranchManager = 4,
    SuperAdmin = 5
}

public enum WorkspaceRole
{
    Owner = 1,
    Member = 2,
    Viewer = 3
}

public enum OrganizationStatus
{
    Active = 1,
    Suspended = 2,
    Pending = 3,
    Archived = 4
}

/// <summary>Granular permissions for role-based access control.</summary>
[Flags]
public enum Permission : long
{
    None = 0,
    ViewDashboard = 1L << 0,
    AddExpense = 1L << 1,
    EditExpense = 1L << 2,
    DeleteExpense = 1L << 3,
    AddIncome = 1L << 4,
    EditIncome = 1L << 5,
    DeleteIncome = 1L << 6,
    ApproveTransaction = 1L << 7,
    ManageStaff = 1L << 8,
    ManageBranches = 1L << 9,
    ManageCategories = 1L << 10,
    ExportReports = 1L << 11,
    ViewAnalytics = 1L << 12,
    ManageAccounts = 1L << 13,
    ManageSettings = 1L << 14,
    ManageIntegrations = 1L << 15,
    ManageAssets = 1L << 16,
    ViewAuditLog = 1L << 17,
    ManageRecurring = 1L << 18,
    ManageTransfers = 1L << 19,
    ViewAllBranches = 1L << 20,
    ManageApprovals = 1L << 21,
    UploadReceipts = 1L << 22,

    // Composite permissions
    StaffDefault = ViewDashboard | AddExpense | AddIncome | UploadReceipts,
    OwnerDefault = ViewDashboard | AddExpense | EditExpense | DeleteExpense |
                   AddIncome | EditIncome | DeleteIncome | ApproveTransaction |
                   ManageStaff | ManageBranches | ManageCategories | ExportReports |
                   ViewAnalytics | ManageAccounts | ManageSettings | ManageIntegrations |
                   ManageAssets | ViewAuditLog | ManageRecurring | ManageTransfers |
                   ViewAllBranches | ManageApprovals | UploadReceipts,
    All = ~None
}
