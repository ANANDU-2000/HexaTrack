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
    public Task<IReadOnlyCollection<CategoryDto>> List(CancellationToken cancellationToken)
        => categoryService.ListAsync(cancellationToken);

    [HttpPost]
    public Task<CategoryDto> Create(CreateCategoryRequest request, CancellationToken cancellationToken)
        => categoryService.CreateAsync(request, cancellationToken);

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
