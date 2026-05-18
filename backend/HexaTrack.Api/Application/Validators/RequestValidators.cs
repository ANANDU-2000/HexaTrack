using FluentValidation;
using HexaTrack.Api.Application.Dtos;

namespace HexaTrack.Api.Application.Validators;

public sealed class CreateOrganizationRequestValidator : AbstractValidator<CreateOrganizationRequest>
{
    public CreateOrganizationRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Slug).MaximumLength(100);
        RuleFor(x => x.Currency).ValidCurrency();
        RuleFor(x => x.MaxBranches).InclusiveBetween(1, 1000);
        RuleFor(x => x.MaxStaff).InclusiveBetween(1, 10000);
        RuleFor(x => x.OwnerName).NotEmpty().MaximumLength(160);
        RuleFor(x => x.OwnerEmail).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(x => x.OwnerPassword).NotEmpty().MinimumLength(8);
    }
}

public sealed class UpdateOrganizationRequestValidator : AbstractValidator<UpdateOrganizationRequest>
{
    public UpdateOrganizationRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(150);
        RuleFor(x => x.MaxBranches!.Value).InclusiveBetween(1, 1000).When(x => x.MaxBranches.HasValue);
        RuleFor(x => x.MaxStaff!.Value).InclusiveBetween(1, 10000).When(x => x.MaxStaff.HasValue);
        RuleFor(x => x.BaseCurrency).ValidCurrency();
    }
}

public sealed class CreateBranchRequestValidator : AbstractValidator<CreateBranchRequest>
{
    public CreateBranchRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Currency).ValidCurrency();
        RuleFor(x => x.Timezone).MaximumLength(50);
        RuleFor(x => x.Address).MaximumLength(300);
        RuleFor(x => x.Phone).MaximumLength(50);
    }
}

public sealed class UpdateBranchRequestValidator : AbstractValidator<UpdateBranchRequest>
{
    public UpdateBranchRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(150);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Currency).ValidCurrency();
        RuleFor(x => x.Timezone).MaximumLength(50);
        RuleFor(x => x.Address).MaximumLength(300);
        RuleFor(x => x.Phone).MaximumLength(50);
    }
}

public sealed class AddOwnerRequestValidator : AbstractValidator<AddOwnerRequest>
{
    public AddOwnerRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

public sealed class AddStaffRequestValidator : AbstractValidator<AddStaffRequest>
{
    public AddStaffRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(x => x.Department).MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

public sealed class CreateRouteRequestValidator : AbstractValidator<CreateRouteRequest>
{
    public CreateRouteRequestValidator()
    {
        RuleFor(x => x.OrganizationId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}

public sealed class UpdateRouteRequestValidator : AbstractValidator<UpdateRouteRequest>
{
    public UpdateRouteRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(150);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}

public sealed class CreateTransactionRequestValidator : AbstractValidator<CreateTransactionRequest>
{
    public CreateTransactionRequestValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be positive.");
        RuleFor(x => x.Currency).NotEmpty().ValidCurrency();
        RuleFor(x => x.Merchant).MaximumLength(160);
        RuleFor(x => x.Note).MaximumLength(500);
        RuleFor(x => x.IdempotencyKey).MaximumLength(120);
    }
}

public sealed class UpdateTransactionRequestValidator : AbstractValidator<UpdateTransactionRequest>
{
    public UpdateTransactionRequestValidator()
    {
        RuleFor(x => x.Amount!.Value).GreaterThan(0).When(x => x.Amount.HasValue).WithMessage("Amount must be positive.");
        RuleFor(x => x.Merchant).MaximumLength(160);
        RuleFor(x => x.Note).MaximumLength(500);
    }
}

public sealed class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Color).MaximumLength(32);
        RuleFor(x => x.Icon).MaximumLength(64);
    }
}

public sealed class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(120);
        RuleFor(x => x.Color).MaximumLength(32);
        RuleFor(x => x.Icon).MaximumLength(64);
    }
}

internal static class CurrencyValidationExtensions
{
    private static readonly HashSet<string> ValidIsoCurrencies = new(StringComparer.OrdinalIgnoreCase)
    {
        "USD", "INR", "EUR", "AED", "GBP", "SGD", "AUD", "CAD", "JPY", "CHF", "HKD", "MYR", "THB", "PHP", "IDR"
    };

    public static IRuleBuilderOptions<T, string?> ValidCurrency<T>(this IRuleBuilder<T, string?> ruleBuilder)
        => ruleBuilder
            .Must(value => string.IsNullOrWhiteSpace(value) || ValidIsoCurrencies.Contains(value.Trim()))
            .WithMessage("Invalid currency code.");
}
