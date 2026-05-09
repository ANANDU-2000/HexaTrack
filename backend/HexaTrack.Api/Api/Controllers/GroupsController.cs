using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/groups")]
public sealed class GroupsController(IGroupExpenseService groupExpenseService) : ControllerBase
{
    [HttpPost]
    public Task<GroupDto> Create(CreateGroupRequest request, CancellationToken cancellationToken)
        => groupExpenseService.CreateGroupAsync(request, cancellationToken);

    [HttpPost("{groupId:guid}/expenses")]
    public Task<GroupExpenseDto> AddExpense(Guid groupId, CreateGroupExpenseRequest request, CancellationToken cancellationToken)
        => groupExpenseService.AddExpenseAsync(groupId, request, cancellationToken);
}

