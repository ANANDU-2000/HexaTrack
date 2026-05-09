using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using StackExchange.Redis;
using DomainTransaction = HexaTrack.Api.Domain.Entities.Transaction;

namespace HexaTrack.Api.Application.Services;

public interface IDashboardService
{
    Task<DashboardSummary> GetSummaryAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken);
}

public sealed class DashboardService(
    IUserScopedRepository<Account> accounts,
    IUserScopedRepository<DomainTransaction> transactions,
    IUserScopedRepository<RecurringTransaction> recurringTransactions,
    IReportsService reportsService,
    ICurrentUser currentUser,
    ICurrentWorkspace currentWorkspace,
    IConnectionMultiplexer redis) : IDashboardService
{
    public async Task<DashboardSummary> GetSummaryAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
    {
        string cacheKey =
            $"dashboard:summary:{currentUser.UserId}:{currentWorkspace.WorkspaceId}:{from:yyyyMMdd}:{to:yyyyMMdd}";
        IDatabase cache = redis.GetDatabase();
        try
        {
            if (redis.IsConnected)
            {
                string? cached = await cache.StringGetAsync(cacheKey);
                if (cached is not null)
                {
                    return JsonSerializer.Deserialize<DashboardSummary>(cached)!;
                }
            }
        }
        catch (RedisConnectionException)
        {
            // Redis unavailable; continue without cache.
        }
        catch (RedisTimeoutException)
        {
            // Redis slow/unavailable; continue without cache.
        }

        decimal totalBalance = await accounts.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Where(x => !x.IsArchived)
            .SumAsync(x => x.Balance, cancellationToken);

        ReportSummary report = await reportsService.GetSummaryAsync(from, to, cancellationToken);

        List<TransactionDto> recent = await transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Include(x => x.TransactionTags).ThenInclude(x => x.Tag)
            .Where(x => x.OccurredOn >= from && x.OccurredOn <= to)
            .OrderByDescending(x => x.OccurredOn).ThenByDescending(x => x.CreatedAt)
            .Take(5)
            .Select(x => new TransactionDto(
                x.Id,
                x.AccountId,
                x.CategoryId,
                x.Type,
                x.Amount,
                x.Currency,
                x.Merchant,
                x.Note,
                x.OccurredOn,
                x.TransactionTags.Select(tt => new TagDto(tt.TagId, tt.Tag!.Name)).ToList()))
            .ToListAsync(cancellationToken);

        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
        DateOnly weekEnd = today.AddDays(6);

        List<RecurringTransactionDto> dueSoon = await recurringTransactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Where(x => x.IsActive && x.NextRunOn >= today && x.NextRunOn <= weekEnd && (x.EndsOn == null || x.EndsOn >= x.NextRunOn))
            .OrderBy(x => x.NextRunOn)
            .Take(5)
            .Select(x => new RecurringTransactionDto(x.Id, x.AccountId, x.CategoryId, x.Type, x.Frequency, x.Amount, x.Currency, x.Note, x.NextRunOn, x.EndsOn, x.IsActive))
            .ToListAsync(cancellationToken);

        string insightLine = BuildInsightLine(report);

        var summary = new DashboardSummary(totalBalance, report, recent, dueSoon, insightLine);

        try
        {
            if (redis.IsConnected)
            {
                await cache.StringSetAsync(cacheKey, JsonSerializer.Serialize(summary), TimeSpan.FromMinutes(5));
            }
        }
        catch (RedisConnectionException)
        {
            // Redis unavailable; ignore cache write.
        }
        catch (RedisTimeoutException)
        {
            // Redis slow/unavailable; ignore cache write.
        }

        return summary;
    }

    private static string BuildInsightLine(ReportSummary report)
    {
        CategorySpend? top = report.SpendingByCategory.FirstOrDefault();
        if (top is null || top.Amount <= 0)
        {
            return "No expense transactions in this period.";
        }

        return $"{top.CategoryName} is the largest expense category in this period.";
    }
}
