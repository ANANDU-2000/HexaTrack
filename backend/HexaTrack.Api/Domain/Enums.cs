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

public enum WorkspaceRole
{
    Owner = 1,
    Member = 2,
    Viewer = 3
}
