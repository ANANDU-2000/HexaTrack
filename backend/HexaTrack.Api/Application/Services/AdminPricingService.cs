using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAdminPricingService
{
    Task<IReadOnlyList<PricingConfiguration>> ListAsync(CancellationToken cancellationToken);
    Task<PricingConfiguration> UpsertAsync(Guid? id, string planName, decimal monthlyPrice, decimal yearlyPrice, string currency, int trialDays, int maxUsers, int maxBranches, int maxTransactions, bool isActive, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class AdminPricingService(HexaTrackDbContext db) : IAdminPricingService
{
    public async Task<IReadOnlyList<PricingConfiguration>> ListAsync(CancellationToken cancellationToken)
        => await db.PricingConfigurations.AsNoTracking()
            .OrderBy(x => x.MonthlyPrice)
            .ToListAsync(cancellationToken);

    public async Task<PricingConfiguration> UpsertAsync(Guid? id, string planName, decimal monthlyPrice, decimal yearlyPrice, string currency, int trialDays, int maxUsers, int maxBranches, int maxTransactions, bool isActive, CancellationToken cancellationToken)
    {
        PricingConfiguration? existing = id.HasValue
            ? await db.PricingConfigurations.SingleOrDefaultAsync(x => x.Id == id.Value, cancellationToken)
            : null;

        if (existing is not null)
        {
            existing.PlanName = planName.Trim();
            existing.MonthlyPrice = monthlyPrice;
            existing.YearlyPrice = yearlyPrice;
            existing.Currency = currency.Trim().ToUpperInvariant();
            existing.TrialDays = trialDays;
            existing.MaxUsers = maxUsers;
            existing.MaxBranches = maxBranches;
            existing.MaxTransactionsPerMonth = maxTransactions;
            existing.IsActive = isActive;
            existing.UpdatedAt = DateTimeOffset.UtcNow;
        }
        else
        {
            existing = new PricingConfiguration
            {
                PlanName = planName.Trim(),
                MonthlyPrice = monthlyPrice,
                YearlyPrice = yearlyPrice,
                Currency = currency.Trim().ToUpperInvariant(),
                TrialDays = trialDays,
                MaxUsers = maxUsers,
                MaxBranches = maxBranches,
                MaxTransactionsPerMonth = maxTransactions,
                IsActive = isActive,
            };
            db.PricingConfigurations.Add(existing);
        }

        await db.SaveChangesAsync(cancellationToken);
        return existing;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        PricingConfiguration? pricing = await db.PricingConfigurations.SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Pricing configuration not found.");
        db.PricingConfigurations.Remove(pricing);
        await db.SaveChangesAsync(cancellationToken);
    }
}
