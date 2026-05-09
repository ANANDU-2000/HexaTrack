using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

/// <summary>Grants super-admin to configured emails on startup (bootstrap only).</summary>
public sealed class SuperAdminBootstrapHostedService(
    IServiceProvider serviceProvider,
    IOptions<SuperAdminOptions> options,
    ILogger<SuperAdminBootstrapHostedService> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        string[] emails = options.Value.BootstrapEmails ?? [];
        if (emails.Length == 0)
        {
            return;
        }

        using IServiceScope scope = serviceProvider.CreateScope();
        HexaTrackDbContext db = scope.ServiceProvider.GetRequiredService<HexaTrackDbContext>();

        int updated = 0;
        foreach (string raw in emails)
        {
            string email = raw.Trim().ToLowerInvariant();
            if (email.Length == 0)
            {
                continue;
            }

            User? user = await db.Users.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
            if (user is null)
            {
                logger.LogWarning("SuperAdmin bootstrap: no user with email {Email}.", email);
                continue;
            }

            if (!user.IsSuperAdmin)
            {
                user.IsSuperAdmin = true;
                updated++;
            }
        }

        if (updated > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
        }

        logger.LogInformation("SuperAdmin bootstrap completed; {Updated} users promoted.", updated);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
