using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/tags")]
public sealed class TagsController(ITagService tagService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<TagDto>> List(CancellationToken cancellationToken)
        => tagService.ListAsync(cancellationToken);

    [HttpPost]
    public Task<TagDto> Upsert(UpsertTagRequest request, CancellationToken cancellationToken)
        => tagService.UpsertAsync(request, cancellationToken);
}

