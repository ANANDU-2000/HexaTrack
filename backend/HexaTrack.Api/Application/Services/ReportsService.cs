using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using StackExchange.Redis;
using DomainTransaction = HexaTrack.Api.Domain.Entities.Transaction;

namespace HexaTrack.Api.Application.Services;

public interface IReportsService
{
    Task<ReportSummary> GetSummaryAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken);
}

public sealed class ReportsService(IUserScopedRepository<DomainTransaction> transactions, ICurrentUser currentUser, ICurrentWorkspace currentWorkspace, IConnectionMultiplexer redis) : IReportsService
{
    public async Task<ReportSummary> GetSummaryAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
    {
        string cacheKey = $"reports:summary:{currentUser.UserId}:{currentWorkspace.WorkspaceId}:{from:yyyyMMdd}:{to:yyyyMMdd}";
        IDatabase cache = redis.GetDatabase();
        try
        {
            if (redis.IsConnected)
            {
                string? cached = await cache.StringGetAsync(cacheKey);
                if (cached is not null)
                {
                    return JsonSerializer.Deserialize<ReportSummary>(cached)!;
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

        var rows = await transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Include(x => x.Category)
            .Where(x => x.OccurredOn >= from && x.OccurredOn <= to)
            .Select(x => new { x.Type, x.Amount, x.OccurredOn, x.CategoryId, CategoryName = x.Category!.Name })
            .ToListAsync(cancellationToken);

        decimal income = rows.Where(x => x.Type == TransactionType.Income).Sum(x => x.Amount);
        decimal expense = rows.Where(x => x.Type == TransactionType.Expense).Sum(x => x.Amount);
        var cashflow = rows.GroupBy(x => new DateOnly(x.OccurredOn.Year, x.OccurredOn.Month, 1))
            .OrderBy(x => x.Key)
            .Select(x =>
            {
                decimal periodIncome = x.Where(r => r.Type == TransactionType.Income).Sum(r => r.Amount);
                decimal periodExpense = x.Where(r => r.Type == TransactionType.Expense).Sum(r => r.Amount);
                return new CashflowPoint(x.Key, periodIncome, periodExpense, periodIncome - periodExpense);
            })
            .ToList();

        var byCategory = rows.Where(x => x.Type == TransactionType.Expense)
            .GroupBy(x => new { x.CategoryId, x.CategoryName })
            .OrderByDescending(x => x.Sum(r => r.Amount))
            .Select(x => new CategorySpend(x.Key.CategoryId, x.Key.CategoryName, x.Sum(r => r.Amount)))
            .ToList();

        var summary = new ReportSummary(income, expense, income - expense, cashflow, byCategory);
        try
        {
            if (redis.IsConnected)
            {
                await cache.StringSetAsync(cacheKey, JsonSerializer.Serialize(summary), TimeSpan.FromMinutes(10));
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
}

