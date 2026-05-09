using System.Linq.Expressions;

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

public sealed class UserScopedRepository<TEntity>(HexaTrackDbContext dbContext) : Repository<TEntity>(dbContext), IUserScopedRepository<TEntity>
    where TEntity : class
{
    public IQueryable<TEntity> ForUser(Guid userId)
    {
        var parameter = Expression.Parameter(typeof(TEntity), "x");
        var property = Expression.Property(parameter, "UserId");
        var equals = Expression.Equal(property, Expression.Constant(userId));
        var predicate = Expression.Lambda<Func<TEntity, bool>>(equals, parameter);

        return Query().Where(predicate);
    }
}

