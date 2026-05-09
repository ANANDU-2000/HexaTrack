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

    [HttpPost("transfer")]
    public Task<TransferDto> Transfer(TransferRequest request, CancellationToken cancellationToken)
        => accountService.TransferAsync(request, cancellationToken);
}

