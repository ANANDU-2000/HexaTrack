using Microsoft.EntityFrameworkCore;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure.Repositories;

namespace HexaTrack.Api.Application.Services;

public interface IGroupExpenseService
{
    Task<GroupDto> CreateGroupAsync(CreateGroupRequest request, CancellationToken cancellationToken);
    Task<GroupExpenseDto> AddExpenseAsync(Guid groupId, CreateGroupExpenseRequest request, CancellationToken cancellationToken);
}

public sealed class GroupExpenseService(
    IRepository<ExpenseGroup> groups,
    IRepository<GroupExpense> groupExpenses,
    ICurrentUser currentUser,
    IUnitOfWork unitOfWork) : IGroupExpenseService
{
    public Task<GroupDto> CreateGroupAsync(CreateGroupRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            var group = new ExpenseGroup
            {
                OwnerUserId = currentUser.UserId,
                Name = request.Name.Trim(),
                Members = request.Members.Select(name => new GroupMember { DisplayName = name.Trim() }).ToList()
            };

            group.Members.Add(new GroupMember { UserId = currentUser.UserId, DisplayName = "Me" });
            await groups.AddAsync(group, ct);

            return new GroupDto(group.Id, group.Name, group.Members.Select(x => new GroupMemberDto(x.Id, x.DisplayName, x.UserId)).ToList());
        }, cancellationToken);

    public Task<GroupExpenseDto> AddExpenseAsync(Guid groupId, CreateGroupExpenseRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            ExpenseGroup group = await groups.Query()
                .Include(x => x.Members)
                .SingleOrDefaultAsync(x => x.Id == groupId && x.OwnerUserId == currentUser.UserId, ct)
                ?? throw new KeyNotFoundException("Group not found.");

            if (!group.Members.Any(x => x.Id == request.PaidByMemberId))
            {
                throw new InvalidOperationException("Payer is not a group member.");
            }

            IReadOnlyCollection<GroupExpenseSplit> splits = request.SplitMethod switch
            {
                SplitMethod.Equal => CreateEqualSplits(group.Members, request.Amount),
                SplitMethod.Custom => CreateCustomSplits(request.Amount, request.Splits),
                SplitMethod.Percentage => CreatePercentageSplits(request.Amount, request.Splits),
                _ => throw new ArgumentOutOfRangeException(nameof(request.SplitMethod), request.SplitMethod, null)
            };

            var expense = new GroupExpense
            {
                GroupId = groupId,
                PaidByMemberId = request.PaidByMemberId,
                Description = request.Description.Trim(),
                Amount = request.Amount,
                Currency = request.Currency.Trim().ToUpperInvariant(),
                SplitMethod = request.SplitMethod,
                ExpenseOn = request.ExpenseOn,
                Splits = splits.ToList()
            };

            await groupExpenses.AddAsync(expense, ct);
            return new GroupExpenseDto(expense.Id, expense.Description, expense.Amount, expense.Currency, expense.SplitMethod, expense.ExpenseOn, expense.Splits.Select(x => new GroupExpenseSplitDto(x.MemberId, x.OwedAmount, x.Percentage, x.Status)).ToList());
        }, cancellationToken);

    private static IReadOnlyCollection<GroupExpenseSplit> CreateEqualSplits(IEnumerable<GroupMember> members, decimal amount)
    {
        List<GroupMember> memberList = members.ToList();
        decimal share = Math.Round(amount / memberList.Count, 2, MidpointRounding.AwayFromZero);
        decimal remainder = amount - share * memberList.Count;

        return memberList.Select((member, index) => new GroupExpenseSplit
        {
            MemberId = member.Id,
            OwedAmount = index == 0 ? share + remainder : share
        }).ToList();
    }

    private static IReadOnlyCollection<GroupExpenseSplit> CreateCustomSplits(decimal amount, IReadOnlyCollection<GroupExpenseSplitRequest>? splits)
    {
        if (splits is null || splits.Count == 0)
        {
            throw new InvalidOperationException("Custom splits are required.");
        }

        decimal total = splits.Sum(x => x.Amount);
        if (total != amount)
        {
            throw new InvalidOperationException("Custom split total must equal the expense amount.");
        }

        return splits.Select(x => new GroupExpenseSplit { MemberId = x.MemberId, OwedAmount = x.Amount }).ToList();
    }

    private static IReadOnlyCollection<GroupExpenseSplit> CreatePercentageSplits(decimal amount, IReadOnlyCollection<GroupExpenseSplitRequest>? splits)
    {
        if (splits is null || splits.Count == 0)
        {
            throw new InvalidOperationException("Percentage splits are required.");
        }

        decimal totalPercentage = splits.Sum(x => x.Percentage ?? 0);
        if (totalPercentage != 100)
        {
            throw new InvalidOperationException("Percentage split total must equal 100.");
        }

        List<GroupExpenseSplit> result = splits.Select(x =>
        {
            decimal percentage = x.Percentage ?? throw new InvalidOperationException("Each split requires a percentage.");
            return new GroupExpenseSplit
            {
                MemberId = x.MemberId,
                Percentage = percentage,
                OwedAmount = Math.Round(amount * percentage / 100, 2, MidpointRounding.AwayFromZero)
            };
        }).ToList();

        decimal delta = amount - result.Sum(x => x.OwedAmount);
        result[0].OwedAmount += delta;
        return result;
    }
}

