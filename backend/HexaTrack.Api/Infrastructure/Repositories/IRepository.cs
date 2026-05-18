using System.Linq.Expressions;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;

namespace HexaTrack.Api.Infrastructure.Repositories;

public interface IRepository<TEntity>
    where TEntity : class
{
    IQueryable<TEntity> Query();
    Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken);
    void Update(TEntity entity);
    void Remove(TEntity entity);
}

public class Repository<TEntity>(HexaTrackDbContext dbContext) : IRepository<TEntity>
    where TEntity : class
{
    public IQueryable<TEntity> Query() => dbContext.Set<TEntity>();

    public Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.Set<TEntity>().FindAsync([id], cancellationToken).AsTask();

    public Task AddAsync(TEntity entity, CancellationToken cancellationToken)
        => dbContext.Set<TEntity>().AddAsync(entity, cancellationToken).AsTask();

    public void Update(TEntity entity) => dbContext.Set<TEntity>().Update(entity);

    public void Remove(TEntity entity) => dbContext.Set<TEntity>().Remove(entity);
}

public interface IUserScopedRepository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    IQueryable<TEntity> ForUser(Guid userId);
}

public sealed class UserScopedRepository<TEntity>(HexaTrackDbContext dbContext, ICurrentUser currentUser) : Repository<TEntity>(dbContext), IUserScopedRepository<TEntity>
    where TEntity : class
{
    public IQueryable<TEntity> ForUser(Guid userId)
    {
        var parameter = Expression.Parameter(typeof(TEntity), "x");
        Expression? body = null;

        var mode = currentUser.Mode;
        var userOrgId = currentUser.OrganizationId;
        var userBranchId = currentUser.BranchId;

        var orgIdProp = typeof(TEntity).GetProperty("OrganizationId");
        var branchIdProp = typeof(TEntity).GetProperty("BranchId");
        var userIdProp = typeof(TEntity).GetProperty("UserId");

        if (mode == UserMode.Individual)
        {
            if (userIdProp != null)
            {
                body = Expression.Equal(
                    Expression.Property(parameter, userIdProp),
                    Expression.Constant(currentUser.UserId)
                );
            }
        }
        else if (mode == UserMode.OrganizationOwner || mode == UserMode.OrganizationStaff)
        {
            if (orgIdProp != null && userOrgId.HasValue)
            {
                body = Expression.Equal(
                    Expression.Property(parameter, orgIdProp),
                    Expression.Constant(userOrgId.Value, typeof(Guid?))
                );
            }
            else if (userIdProp != null)
            {
                body = Expression.Equal(
                    Expression.Property(parameter, userIdProp),
                    Expression.Constant(currentUser.UserId)
                );
            }
        }
        else if (mode == UserMode.BranchManager)
        {
            if (orgIdProp != null && userOrgId.HasValue)
            {
                var orgExpr = Expression.Equal(
                    Expression.Property(parameter, orgIdProp),
                    Expression.Constant(userOrgId.Value, typeof(Guid?))
                );
                body = orgExpr;

                if (branchIdProp != null && userBranchId.HasValue)
                {
                    var branchExpr = Expression.Equal(
                        Expression.Property(parameter, branchIdProp),
                        Expression.Constant(userBranchId.Value, typeof(Guid?))
                    );
                    body = Expression.AndAlso(body, branchExpr);
                }
            }
            else if (userIdProp != null)
            {
                body = Expression.Equal(
                    Expression.Property(parameter, userIdProp),
                    Expression.Constant(currentUser.UserId)
                );
            }
        }
        else if (mode == UserMode.SuperAdmin)
        {
            // SuperAdmin - fallback to workspace isolation (no-op here)
        }

        if (body == null)
        {
            if (userIdProp != null)
            {
                body = Expression.Equal(
                    Expression.Property(parameter, userIdProp),
                    Expression.Constant(userId)
                );
            }
            else
            {
                return Query();
            }
        }

        var predicate = Expression.Lambda<Func<TEntity, bool>>(body, parameter);
        return Query().Where(predicate);
    }
}

