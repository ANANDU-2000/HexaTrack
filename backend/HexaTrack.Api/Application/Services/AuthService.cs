using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Domain;
using HexaTrack.Api.Domain.Entities;
using HexaTrack.Api.Infrastructure.Repositories;
using HexaTrack.Api.Infrastructure;

namespace HexaTrack.Api.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<AuthResponse> GoogleLoginAsync(GoogleLoginRequest request, CancellationToken cancellationToken);
    Task<AuthMeResponse> GetMeAsync(Guid userId, CancellationToken cancellationToken);
    Task<AuthResponse> AcceptWorkspaceInviteAsync(InviteAcceptRequest request, CancellationToken cancellationToken);
}

public sealed class AuthService(
    IUserScopedRepository<User> users,
    IUserScopedRepository<Account> accounts,
    IUserScopedRepository<Category> categories,
    HexaTrackDbContext dbContext,
    IUnitOfWork unitOfWork,
    IOptions<JwtOptions> jwtOptions,
    IOptions<GoogleAuthOptions> googleOptions) : IAuthService
{
    public Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            string email = request.Email.Trim().ToLowerInvariant();
            if (await users.Query().AnyAsync(x => x.Email == email, ct))
            {
                throw new InvalidOperationException("Email is already registered.");
            }

            var user = new User
            {
                Email = email,
                DisplayName = request.DisplayName.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            await users.AddAsync(user, ct);
            await SeedStarterWorkspaceAsync(user.Id, ct);
            return CreateAuthResponse(user);
        }, cancellationToken);

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        string email = request.Email.Trim().ToLowerInvariant();
        User user = await users.Query().SingleOrDefaultAsync(x => x.Email == email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (user.IsLocked)
        {
            throw new UnauthorizedAccessException("Account locked.");
        }

        if (user.PasswordHash is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> GoogleLoginAsync(GoogleLoginRequest request, CancellationToken cancellationToken)
    {
        GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(
            request.IdToken,
            new GoogleJsonWebSignature.ValidationSettings { Audience = [googleOptions.Value.ClientId] });

        string email = payload.Email.Trim().ToLowerInvariant();

        return await unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            User? user = await users.Query().SingleOrDefaultAsync(x => x.Email == email || x.GoogleSubject == payload.Subject, ct);
            if (user is not null && user.IsLocked)
            {
                throw new UnauthorizedAccessException("Account locked.");
            }

            if (user is null)
            {
                user = new User
                {
                    Email = email,
                    DisplayName = payload.Name ?? email,
                    GoogleSubject = payload.Subject
                };
                await users.AddAsync(user, ct);
                await SeedStarterWorkspaceAsync(user.Id, ct);
            }
            else if (user.GoogleSubject is null)
            {
                user.GoogleSubject = payload.Subject;
                users.Update(user);
            }

            return CreateAuthResponse(user);
        }, cancellationToken);
    }

    private async Task SeedStarterWorkspaceAsync(Guid userId, CancellationToken cancellationToken)
    {
        var workspace = new Workspace
        {
            OwnerUserId = userId,
            Name = "Personal",
            Type = WorkspaceType.Personal,
            Currency = "USD",
            IsDefault = true,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        dbContext.Workspaces.Add(workspace);
        dbContext.WorkspaceMembers.Add(new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = userId,
            Role = WorkspaceRole.Owner
        });

        Guid workspaceId = workspace.Id;

        Account[] starterAccounts =
        [
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Primary Bank", Type = AccountType.Bank, Currency = "USD", Balance = 0 },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Everyday Wallet", Type = AccountType.Wallet, Currency = "USD", Balance = 0 },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Cash", Type = AccountType.Cash, Currency = "USD", Balance = 0 },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Credit Card", Type = AccountType.Credit, Currency = "USD", Balance = 0 }
        ];

        Category[] starterCategories =
        [
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Salary", Type = TransactionType.Income, Color = "#10b981", Icon = "Briefcase" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Interest", Type = TransactionType.Income, Color = "#14b8a6", Icon = "TrendingUp" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Food", Type = TransactionType.Expense, Color = "#f97316", Icon = "Utensils" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Transport", Type = TransactionType.Expense, Color = "#2563eb", Icon = "Bus" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Home", Type = TransactionType.Expense, Color = "#14b8a6", Icon = "Home" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Subscriptions", Type = TransactionType.Expense, Color = "#8b5cf6", Icon = "RefreshCw" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Health", Type = TransactionType.Expense, Color = "#ef4444", Icon = "HeartPulse" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Shopping", Type = TransactionType.Expense, Color = "#ec4899", Icon = "ShoppingBag" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Travel", Type = TransactionType.Expense, Color = "#0ea5e9", Icon = "Plane" },
            new() { WorkspaceId = workspaceId, UserId = userId, Name = "Utilities", Type = TransactionType.Expense, Color = "#64748b", Icon = "Zap" }
        ];

        foreach (Account account in starterAccounts)
        {
            await accounts.AddAsync(account, cancellationToken);
        }

        foreach (Category category in starterCategories)
        {
            await categories.AddAsync(category, cancellationToken);
        }
    }

    public async Task<AuthMeResponse> GetMeAsync(Guid userId, CancellationToken cancellationToken)
    {
        User user = await users.Query().AsNoTracking().SingleAsync(x => x.Id == userId, cancellationToken);
        return new AuthMeResponse(new UserDto(user.Id, user.Email, user.DisplayName), user.IsSuperAdmin);
    }

    public Task<AuthResponse> AcceptWorkspaceInviteAsync(InviteAcceptRequest request, CancellationToken cancellationToken)
        => unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            string hash = InviteTokenHasher.Hash(request.Token.Trim());
            WorkspaceInvite? inv = await dbContext.WorkspaceInvites
                .FirstOrDefaultAsync(x => x.TokenHash == hash && x.AcceptedAt == null, ct)
                ?? throw new InvalidOperationException("Invalid or expired invite.");

            if (inv.ExpiresAt < DateTimeOffset.UtcNow)
            {
                throw new InvalidOperationException("Invite expired.");
            }

            string email = inv.Email.Trim().ToLowerInvariant();
            if (await users.Query().AnyAsync(x => x.Email == email, ct))
            {
                throw new InvalidOperationException("An account already exists for this email. Sign in to accept the invite from your account.");
            }

            var user = new User
            {
                Email = email,
                DisplayName = email.Split('@')[0],
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };
            await users.AddAsync(user, ct);

            dbContext.WorkspaceMembers.Add(new WorkspaceMember
            {
                WorkspaceId = inv.WorkspaceId,
                UserId = user.Id,
                Role = inv.Role,
            });

            inv.AcceptedAt = DateTimeOffset.UtcNow;

            return CreateAuthResponse(user);
        }, cancellationToken);

    private AuthResponse CreateAuthResponse(User user)
    {
        JwtOptions options = jwtOptions.Value;
        DateTimeOffset expiresAt = DateTimeOffset.UtcNow.AddMinutes(options.ExpiresMinutes);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.DisplayName),
        };
        if (user.IsSuperAdmin)
        {
            claims.Add(new Claim(ClaimTypes.Role, "SuperAdmin"));
        }

        var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), expiresAt, new UserDto(user.Id, user.Email, user.DisplayName));
    }
}

