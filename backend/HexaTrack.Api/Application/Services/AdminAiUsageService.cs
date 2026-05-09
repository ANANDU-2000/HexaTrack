using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminAiUsageService
{
    Task<AiUsageSummaryResult> SummaryAsync(int days, CancellationToken cancellationToken);
}

public sealed class AdminAiUsageService(HexaTrackDbContext db) : IAdminAiUsageService
{
    public async Task<AiUsageSummaryResult> SummaryAsync(int days, CancellationToken cancellationToken)
    {
        days = Math.Clamp(days, 1, 365);
        DateOnly from = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-days));

        var grouped = await db.AiUsageDaily.AsNoTracking()
            .Where(x => x.DayUtc >= from)
            .GroupBy(x => x.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                Prompt = g.Sum(x => (long)x.PromptTokens),
                Completion = g.Sum(x => (long)x.CompletionTokens),
            })
            .ToListAsync(cancellationToken);

        if (grouped.Count == 0)
        {
            return new AiUsageSummaryResult([]);
        }

        Guid[] ids = grouped.Select(x => x.UserId).Distinct().ToArray();
        Dictionary<Guid, string> emails = await db.Users.AsNoTracking()
            .Where(u => ids.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Email, cancellationToken);

        List<AiUsageSummaryRow> rows = grouped
            .Select(x => new AiUsageSummaryRow(x.UserId, emails.GetValueOrDefault(x.UserId, ""), x.Prompt, x.Completion))
            .OrderByDescending(r => r.TotalPromptTokens + r.TotalCompletionTokens)
            .ToList();

        return new AiUsageSummaryResult(rows);
    }
}
