using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public sealed class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyCollection<CategoryDto>> List(
        [FromQuery] Guid? branchId,
        [FromQuery] HexaTrack.Api.Domain.TransactionType? type,
        CancellationToken cancellationToken)
        => categoryService.ListAvailableAsync(branchId, type, cancellationToken);

    [HttpPost]
    public Task<CategoryDto> Create(CreateCategoryRequest request, CancellationToken cancellationToken)
        => categoryService.CreateAsync(request, cancellationToken);

    [HttpPut("{id:guid}")]
    public Task<CategoryDto> Update(Guid id, UpdateCategoryRequest request, CancellationToken cancellationToken)
        => categoryService.UpdateAsync(id, request, cancellationToken);

    [HttpPost("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id, CancellationToken cancellationToken)
    {
        await categoryService.ArchiveAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/unarchive")]
    public async Task<IActionResult> Unarchive(Guid id, CancellationToken cancellationToken)
    {
        await categoryService.UnarchiveAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("{parentId:guid}/subcategories")]
    public Task<IReadOnlyCollection<CategoryDto>> ListSubcategories(Guid parentId, CancellationToken cancellationToken)
        => categoryService.ListSubcategoriesAsync(parentId, cancellationToken);

    [HttpPost("{parentId:guid}/subcategories")]
    public Task<CategoryDto> CreateSubcategory(Guid parentId, CreateSubcategoryRequest request, CancellationToken cancellationToken)
        => categoryService.CreateSubcategoryAsync(parentId, request, cancellationToken);

    [HttpDelete("{parentCategoryId:guid}/subcategories/{subcategoryId:guid}")]
    public async Task<IActionResult> DeleteSubcategory(Guid parentCategoryId, Guid subcategoryId, CancellationToken cancellationToken)
    {
        await categoryService.DeleteSubcategoryAsync(parentCategoryId, subcategoryId, cancellationToken);
        return NoContent();
    }
}
