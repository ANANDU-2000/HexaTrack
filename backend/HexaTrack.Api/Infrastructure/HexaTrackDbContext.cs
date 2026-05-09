using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Domain.Entities;

namespace HexaTrack.Api.Infrastructure;

public sealed class HexaTrackDbContext(DbContextOptions<HexaTrackDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Workspace> Workspaces => Set<Workspace>();
    public DbSet<WorkspaceMember> WorkspaceMembers => Set<WorkspaceMember>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<TransactionTag> TransactionTags => Set<TransactionTag>();
    public DbSet<AccountTransfer> AccountTransfers => Set<AccountTransfer>();
    public DbSet<RecurringTransaction> RecurringTransactions => Set<RecurringTransaction>();
    public DbSet<ExpenseGroup> ExpenseGroups => Set<ExpenseGroup>();
    public DbSet<GroupMember> GroupMembers => Set<GroupMember>();
    public DbSet<GroupExpense> GroupExpenses => Set<GroupExpense>();
    public DbSet<GroupExpenseSplit> GroupExpenseSplits => Set<GroupExpenseSplit>();
    public DbSet<GroupSettlement> GroupSettlements => Set<GroupSettlement>();
    public DbSet<UserSubscription> UserSubscriptions => Set<UserSubscription>();
    public DbSet<BackupJob> BackupJobs => Set<BackupJob>();
    public DbSet<AdminAuditLog> AdminAuditLogs => Set<AdminAuditLog>();
    public DbSet<GlobalFeatureFlag> GlobalFeatureFlags => Set<GlobalFeatureFlag>();
    public DbSet<GlobalSetting> GlobalSettings => Set<GlobalSetting>();
    public DbSet<WorkspaceInvite> WorkspaceInvites => Set<WorkspaceInvite>();
    public DbSet<AiUsageDaily> AiUsageDaily => Set<AiUsageDaily>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("uuid-ossp");

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(x => x.Email).IsUnique();
            entity.HasIndex(x => x.GoogleSubject).IsUnique().HasFilter("\"GoogleSubject\" IS NOT NULL");
            entity.Property(x => x.Email).HasMaxLength(320);
            entity.Property(x => x.DisplayName).HasMaxLength(160);
        });

        modelBuilder.Entity<Workspace>(entity =>
        {
            entity.HasIndex(x => x.OwnerUserId);
            entity.Property(x => x.Name).HasMaxLength(120);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.HasOne(x => x.Owner)
                .WithMany(x => x.OwnedWorkspaces)
                .HasForeignKey(x => x.OwnerUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<WorkspaceMember>(entity =>
        {
            entity.HasIndex(x => new { x.WorkspaceId, x.UserId }).IsUnique();
            entity.HasIndex(x => x.UserId);
            entity.HasOne(x => x.Workspace)
                .WithMany(x => x.Members)
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.Type });
            entity.HasIndex(x => new { x.WorkspaceId, x.Name }).IsUnique().HasFilter("\"IsArchived\" = false");
            entity.Property(x => x.Balance).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.Property(x => x.Name).HasMaxLength(120);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(x => new { x.WorkspaceId, x.Type, x.ParentCategoryId });
            entity.HasIndex(x => new { x.WorkspaceId, x.Name, x.ParentCategoryId }).IsUnique().HasFilter("\"IsArchived\" = false");
            entity.Property(x => x.Name).HasMaxLength(120);
            entity.Property(x => x.Color).HasMaxLength(32);
            entity.Property(x => x.Icon).HasMaxLength(64);
            entity.HasOne(x => x.ParentCategory)
                .WithMany(x => x.Subcategories)
                .HasForeignKey(x => x.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasIndex(x => new { x.WorkspaceId, x.Name }).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(80);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.OccurredOn });
            entity.HasIndex(x => new { x.WorkspaceId, x.OccurredOn });
            entity.HasIndex(x => new { x.UserId, x.CategoryId, x.OccurredOn });
            entity.HasIndex(x => new { x.AccountId, x.OccurredOn });
            entity.HasIndex(x => new { x.UserId, x.IdempotencyKey }).IsUnique().HasFilter("\"IdempotencyKey\" IS NOT NULL");
            entity.HasIndex(x => x.TransferId).HasFilter("\"TransferId\" IS NOT NULL");
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.Property(x => x.Merchant).HasMaxLength(160);
            entity.Property(x => x.Note).HasMaxLength(500);
            entity.Property(x => x.IdempotencyKey).HasMaxLength(120);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TransactionTag>(entity =>
        {
            entity.HasKey(x => new { x.TransactionId, x.TagId });
            entity.HasIndex(x => x.TagId);
        });

        modelBuilder.Entity<AccountTransfer>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.TransferOn });
            entity.HasIndex(x => new { x.UserId, x.IdempotencyKey }).IsUnique();
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.FeeAmount).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.Property(x => x.Note).HasMaxLength(500);
            entity.Property(x => x.IdempotencyKey).HasMaxLength(120);
        });

        modelBuilder.Entity<RecurringTransaction>(entity =>
        {
            entity.HasIndex(x => new { x.IsActive, x.NextRunOn });
            entity.HasIndex(x => new { x.UserId, x.NextRunOn });
            entity.HasIndex(x => new { x.WorkspaceId, x.NextRunOn });
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.Property(x => x.Note).HasMaxLength(500);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ExpenseGroup>(entity =>
        {
            entity.HasIndex(x => x.OwnerUserId);
            entity.Property(x => x.Name).HasMaxLength(140);
        });

        modelBuilder.Entity<GroupMember>(entity =>
        {
            entity.HasIndex(x => x.GroupId);
            entity.Property(x => x.DisplayName).HasMaxLength(160);
        });

        modelBuilder.Entity<GroupExpense>(entity =>
        {
            entity.HasIndex(x => new { x.GroupId, x.ExpenseOn });
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
            entity.Property(x => x.Description).HasMaxLength(240);
        });

        modelBuilder.Entity<GroupExpenseSplit>(entity =>
        {
            entity.HasIndex(x => new { x.GroupExpenseId, x.MemberId }).IsUnique();
            entity.Property(x => x.OwedAmount).HasPrecision(18, 2);
            entity.Property(x => x.Percentage).HasPrecision(9, 4);
            entity.Property(x => x.SettledAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<GroupSettlement>(entity =>
        {
            entity.HasIndex(x => new { x.GroupId, x.Status });
            entity.HasIndex(x => new { x.FromMemberId, x.ToMemberId });
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3);
        });

        modelBuilder.Entity<UserSubscription>(entity =>
        {
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.Property(x => x.ProviderCustomerId).HasMaxLength(160);
            entity.Property(x => x.ProviderSubscriptionId).HasMaxLength(160);
        });

        modelBuilder.Entity<BackupJob>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.RequestedAt });
            entity.HasIndex(x => x.Status);
            entity.Property(x => x.Provider).HasMaxLength(80);
            entity.Property(x => x.ObjectKey).HasMaxLength(500);
            entity.Property(x => x.Error).HasMaxLength(1000);
        });

        modelBuilder.Entity<AdminAuditLog>(entity =>
        {
            entity.HasIndex(x => x.CreatedAt);
            entity.HasIndex(x => x.ActorUserId);
            entity.Property(x => x.Action).HasMaxLength(120);
            entity.Property(x => x.TargetType).HasMaxLength(80);
            entity.Property(x => x.MetadataJson).HasMaxLength(4000);
            entity.HasOne(x => x.Actor)
                .WithMany()
                .HasForeignKey(x => x.ActorUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<GlobalFeatureFlag>(entity =>
        {
            entity.HasKey(x => x.Key);
            entity.Property(x => x.Key).HasMaxLength(120);
            entity.Property(x => x.Value).HasMaxLength(2000);
        });

        modelBuilder.Entity<GlobalSetting>(entity =>
        {
            entity.HasKey(x => x.Key);
            entity.Property(x => x.Key).HasMaxLength(120);
            entity.Property(x => x.Value).HasMaxLength(2000);
        });

        modelBuilder.Entity<WorkspaceInvite>(entity =>
        {
            entity.HasIndex(x => x.TokenHash).IsUnique();
            entity.HasIndex(x => new { x.WorkspaceId, x.Email });
            entity.Property(x => x.Email).HasMaxLength(320);
            entity.Property(x => x.TokenHash).HasMaxLength(500);
            entity.HasOne(x => x.Workspace)
                .WithMany()
                .HasForeignKey(x => x.WorkspaceId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.InvitedBy)
                .WithMany()
                .HasForeignKey(x => x.InvitedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AiUsageDaily>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.DayUtc }).IsUnique();
            entity.HasIndex(x => x.DayUtc);
            entity.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
