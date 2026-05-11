using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/accounts")]
public sealed class AccountsController(IAccountService accountService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<AccountDto>> List(CancellationToken cancellationToken)
        => accountService.ListAsync(cancellationToken);

    [HttpPost]
    public Task<AccountDto> Create(CreateAccountRequest request, CancellationToken cancellationToken)
        => accountService.CreateAsync(request, cancellationToken);

    [HttpPut("{id:guid}")]
    public Task<AccountDto> Update(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken)
        => accountService.UpdateAsync(id, request, cancellationToken);

    [HttpPost("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id, CancellationToken cancellationToken)
    {
        await accountService.ArchiveAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/unarchive")]
    public async Task<IActionResult> Unarchive(Guid id, CancellationToken cancellationToken)
    {
        await accountService.UnarchiveAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await accountService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("transfer")]
    public Task<TransferDto> Transfer(TransferRequest request, CancellationToken cancellationToken)
        => accountService.TransferAsync(request, cancellationToken);
}

