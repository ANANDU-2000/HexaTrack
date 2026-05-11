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
    Task<TagDto> UpdateAsync(Guid tagId, UpsertTagRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid tagId, CancellationToken cancellationToken);
}

public sealed class TagService(HexaTrackDbContext db, IUserScopedRepository<Tag> tags, ICurrentUser currentUser, ICurrentWorkspace currentWorkspace, IUnitOfWork unitOfWork) : ITagService
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

    public Task<TagDto> UpdateAsync(Guid tagId, UpsertTagRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Tag tag = await tags.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == tagId, ct)
                ?? throw new KeyNotFoundException("Tag not found.");

            tag.Name = request.Name.Trim();
            return new TagDto(tag.Id, tag.Name);
        }, cancellationToken);

    public Task DeleteAsync(Guid tagId, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Tag tag = await tags.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == tagId, ct)
                ?? throw new KeyNotFoundException("Tag not found.");

            await db.TransactionTags.Where(tt => tt.TagId == tagId).ExecuteDeleteAsync(ct);
            db.Tags.Remove(tag);
        }, cancellationToken);
}

