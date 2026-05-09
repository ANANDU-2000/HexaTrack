using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/backup")]
public sealed class BackupController(IBackupService backupService) : ControllerBase
{
    [HttpPost]
    public Task<BackupJobDto> RequestBackup(CancellationToken cancellationToken)
        => backupService.RequestBackupAsync(cancellationToken);
}

