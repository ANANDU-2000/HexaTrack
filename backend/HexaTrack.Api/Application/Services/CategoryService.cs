using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using DomainTransaction = HexaTrack.Api.Domain.Entities.Transaction;

namespace HexaTrack.Api.Application.Services;

public interface ICategoryService
{
    Task<IReadOnlyCollection<CategoryDto>> ListAsync(CancellationToken cancellationToken);
    Task<CategoryDto> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<CategoryDto>> ListSubcategoriesAsync(Guid parentCategoryId, CancellationToken cancellationToken);
    Task<CategoryDto> CreateSubcategoryAsync(Guid parentCategoryId, CreateSubcategoryRequest request, CancellationToken cancellationToken);
    Task DeleteSubcategoryAsync(Guid parentCategoryId, Guid subcategoryId, CancellationToken cancellationToken);
}

public sealed class CategoryService(
    IUserScopedRepository<Category> categories,
    IUserScopedRepository<DomainTransaction> transactions,
    ICurrentUser currentUser,
    ICurrentWorkspace currentWorkspace,
    IUnitOfWork unitOfWork) : ICategoryService
{
    public async Task<IReadOnlyCollection<CategoryDto>> ListAsync(CancellationToken cancellationToken)
        => await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Where(x => !x.IsArchived)
            .OrderBy(x => x.Type).ThenBy(x => x.ParentCategoryId).ThenBy(x => x.Name)
            .Select(x => new CategoryDto(x.Id, x.ParentCategoryId, x.Name, x.Type, x.Color, x.Icon))
            .ToListAsync(cancellationToken);

    public Task<CategoryDto> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.ParentCategoryId.HasValue)
            {
                bool parentExists = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId).AnyAsync(x => x.Id == request.ParentCategoryId.Value && x.ParentCategoryId == null, ct);
                if (!parentExists)
                {
                    throw new InvalidOperationException("Parent category does not exist.");
                }
            }

            var category = new Category
            {
                WorkspaceId = currentWorkspace.WorkspaceId,
                UserId = currentUser.UserId,
                Name = request.Name.Trim(),
                Type = request.Type,
                ParentCategoryId = request.ParentCategoryId,
                Color = request.Color,
                Icon = request.Icon
            };

            await categories.AddAsync(category, ct);
            return new CategoryDto(category.Id, category.ParentCategoryId, category.Name, category.Type, category.Color, category.Icon);
        }, cancellationToken);

    public async Task<IReadOnlyCollection<CategoryDto>> ListSubcategoriesAsync(Guid parentCategoryId, CancellationToken cancellationToken)
    {
        bool parentOk = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .AnyAsync(x => x.Id == parentCategoryId && x.ParentCategoryId == null && !x.IsArchived, cancellationToken);
        if (!parentOk)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        return await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
            .Where(x => x.ParentCategoryId == parentCategoryId && !x.IsArchived)
            .OrderBy(x => x.Name)
            .Select(x => new CategoryDto(x.Id, x.ParentCategoryId, x.Name, x.Type, x.Color, x.Icon))
            .ToListAsync(cancellationToken);
    }

    public Task<CategoryDto> CreateSubcategoryAsync(Guid parentCategoryId, CreateSubcategoryRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Category parent = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == parentCategoryId && x.ParentCategoryId == null && !x.IsArchived, ct)
                ?? throw new KeyNotFoundException("Parent category not found.");

            var sub = new Category
            {
                WorkspaceId = currentWorkspace.WorkspaceId,
                UserId = currentUser.UserId,
                ParentCategoryId = parent.Id,
                Name = request.Name.Trim(),
                Type = parent.Type,
                Color = request.Color,
                Icon = request.Icon
            };

            await categories.AddAsync(sub, ct);
            return new CategoryDto(sub.Id, sub.ParentCategoryId, sub.Name, sub.Type, sub.Color, sub.Icon);
        }, cancellationToken);

    public Task DeleteSubcategoryAsync(Guid parentCategoryId, Guid subcategoryId, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            Category sub = await categories.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .SingleOrDefaultAsync(x => x.Id == subcategoryId && x.ParentCategoryId == parentCategoryId && !x.IsArchived, ct)
                ?? throw new KeyNotFoundException("Subcategory not found.");

            bool hasTransactions = await transactions.ForUser(currentUser.UserId).InWorkspace(currentWorkspace.WorkspaceId)
                .AnyAsync(t => t.CategoryId == subcategoryId, ct);
            if (hasTransactions)
            {
                throw new InvalidOperationException("Cannot remove a subcategory that has transactions.");
            }

            sub.IsArchived = true;
        }, cancellationToken);
}
