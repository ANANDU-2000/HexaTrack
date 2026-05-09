using Hangfire;
using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface IBackupService
{
    Task<BackupJobDto> RequestBackupAsync(CancellationToken cancellationToken);
    Task CompleteBackupAsync(Guid backupJobId, CancellationToken cancellationToken);
}

public sealed class BackupService(IUserScopedRepository<BackupJob> backups, ICurrentUser currentUser, IUnitOfWork unitOfWork, IBackgroundJobClient backgroundJobs) : IBackupService
{
    public Task<BackupJobDto> RequestBackupAsync(CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            var backup = new BackupJob
            {
                UserId = currentUser.UserId,
                Status = BackupStatus.Pending,
                Provider = "cloud"
            };

            await backups.AddAsync(backup, ct);
            backgroundJobs.Enqueue<IBackupService>(service => service.CompleteBackupAsync(backup.Id, CancellationToken.None));
            return new BackupJobDto(backup.Id, backup.Status, backup.Provider, backup.ObjectKey, backup.RequestedAt, backup.CompletedAt);
        }, cancellationToken);

    public Task CompleteBackupAsync(Guid backupJobId, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            BackupJob backup = await backups.Query().SingleOrDefaultAsync(x => x.Id == backupJobId, ct)
                ?? throw new KeyNotFoundException("Backup job not found.");

            backup.Status = BackupStatus.Completed;
            backup.ObjectKey = $"HexaTrack/backups/{backup.UserId}/{backup.Id}.json";
            backup.CompletedAt = DateTimeOffset.UtcNow;
        }, cancellationToken);
}

