using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/analytics")]
public sealed class AnalyticsController(ICurrentUser currentUser, HexaTrackDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        Guid? orgId = currentUser.OrganizationId;
        if (!orgId.HasValue) return BadRequest("No assigned organization.");

        DateOnly end = to ?? DateOnly.FromDateTime(DateTime.UtcNow);
        DateOnly start = from ?? end.AddDays(-30);

        var branchWorkspaces = await db.Branches
            .AsNoTracking()
            .Where(b => b.OrganizationId == orgId.Value && b.WorkspaceId != null)
            .Select(b => new { b.Id, b.Name, WorkspaceId = b.WorkspaceId!.Value })
            .ToListAsync(ct);
        var workspaceIds = branchWorkspaces.Select(b => b.WorkspaceId).ToList();

        var rows = await db.Transactions
            .AsNoTracking()
            .Where(t => workspaceIds.Contains(t.WorkspaceId) && t.OccurredOn >= start && t.OccurredOn <= end)
            .Select(t => new { t.WorkspaceId, t.Type, t.Amount, t.OccurredOn })
            .ToListAsync(ct);

        decimal revenue = rows.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
        decimal expenses = rows.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);
        var branches = branchWorkspaces.Select(branch =>
        {
            var branchRows = rows.Where(row => row.WorkspaceId == branch.WorkspaceId).ToList();
            decimal branchRevenue = branchRows.Where(row => row.Type == TransactionType.Income).Sum(row => row.Amount);
            decimal branchExpenses = branchRows.Where(row => row.Type == TransactionType.Expense).Sum(row => row.Amount);
            return new
            {
                branch.Id,
                branch.Name,
                revenue = branchRevenue,
                expenses = branchExpenses,
                profit = branchRevenue - branchExpenses
            };
        }).OrderByDescending(x => x.revenue).ToList();

        var cashFlow = rows
            .GroupBy(row => new DateOnly(row.OccurredOn.Year, row.OccurredOn.Month, 1))
            .OrderBy(group => group.Key)
            .Select(group =>
            {
                decimal income = group.Where(row => row.Type == TransactionType.Income).Sum(row => row.Amount);
                decimal expense = group.Where(row => row.Type == TransactionType.Expense).Sum(row => row.Amount);
                return new CashflowPoint(group.Key, income, expense, income - expense);
            })
            .ToList();

        return Ok(new
        {
            revenue,
            expenses,
            profit = revenue - expenses,
            cashFlow,
            branchPerformance = branches,
            recurringCommitments = await db.RecurringTransactions
                .AsNoTracking()
                .Where(item => workspaceIds.Contains(item.WorkspaceId) && item.IsActive)
                .SumAsync(item => item.Amount, ct)
        });
    }
}
