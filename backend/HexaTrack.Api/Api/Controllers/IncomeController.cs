using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;
using HexaTrack.Api.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/income")]
public sealed class IncomeController(ITransactionService transactions) : ControllerBase
{
    [HttpPost]
    public Task<TransactionDto> Create(CreateTransactionRequest request, CancellationToken cancellationToken)
        => transactions.CreateAsync(request with { Type = TransactionType.Income }, cancellationToken);
}
