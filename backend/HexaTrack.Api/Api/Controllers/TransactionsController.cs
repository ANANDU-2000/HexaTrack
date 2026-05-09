using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transactions")]
public sealed class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<TransactionDto>> List([FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken cancellationToken)
        => transactionService.ListAsync(from, to, cancellationToken);

    [HttpGet("search")]
    public Task<PagedResult<TransactionDto>> Search([FromQuery] TransactionSearchRequest request, CancellationToken cancellationToken)
        => transactionService.SearchAsync(request, cancellationToken);

    [HttpPost]
    public Task<TransactionDto> Create(CreateTransactionRequest request, CancellationToken cancellationToken)
        => transactionService.CreateAsync(request, cancellationToken);
}

