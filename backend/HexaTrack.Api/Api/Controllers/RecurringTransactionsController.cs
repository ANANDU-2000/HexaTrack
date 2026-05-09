using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/recurring-transactions")]
public sealed class RecurringTransactionsController(IRecurringTransactionService recurringService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<RecurringTransactionDto>> List(CancellationToken cancellationToken)
        => recurringService.ListAsync(cancellationToken);

    [HttpPost]
    public Task<RecurringTransactionDto> Create(CreateRecurringTransactionRequest request, CancellationToken cancellationToken)
        => recurringService.CreateAsync(request, cancellationToken);
}

