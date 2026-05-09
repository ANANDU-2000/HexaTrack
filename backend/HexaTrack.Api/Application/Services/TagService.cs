using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface ITagService
{
    Task<IReadOnlyCollection<TagDto>> ListAsync(CancellationToken cancellationToken);
    Task<TagDto> UpsertAsync(UpsertTagRequest request, CancellationToken cancellationToken);
}

public sealed class TagService(IUserScopedRepository<Tag> tags, ICurrentUser currentUser, ICurrentWorkspace currentWorkspace, IUnitOfWork unitOfWork) : ITagService
{
    public async Task<IReadOnlyCollection<TagDto>> ListAsync(CancellationToken cancellationToken)
        => await tags.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .OrderBy(x => x.Name)
            .Select(x => new TagDto(x.Id, x.Name))
            .ToListAsync(cancellationToken);

    public Task<TagDto> UpsertAsync(UpsertTagRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            string name = request.Name.Trim();
            Tag? existing = await tags.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId).SingleOrDefaultAsync(x => x.Name == name, ct);
            if (existing is not null)
            {
                return new TagDto(existing.Id, existing.Name);
            }

            var tag = new Tag { WorkspaceId = currentWorkspace.WorkspaceId, UserId = currentUser.UserId, Name = name };
            await tags.AddAsync(tag, ct);
            return new TagDto(tag.Id, tag.Name);
        }, cancellationToken);
}

