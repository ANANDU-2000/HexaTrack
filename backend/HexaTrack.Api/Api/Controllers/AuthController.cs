using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    IAuthService authService,
    ICurrentUser currentUser,
    ILoginThrottle loginThrottle) : ControllerBase
{
    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<AuthResponse> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        string? ip = ClientIpResolver.Resolve(HttpContext);
        AuthResponse response = await authService.RegisterAsync(request, cancellationToken);
        await loginThrottle.OnSuccessAsync(ip, cancellationToken);
        return response;
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<AuthResponse> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        string? ip = ClientIpResolver.Resolve(HttpContext);
        await loginThrottle.EnsureAllowedAsync(ip, cancellationToken);
        try
        {
            AuthResponse response = await authService.LoginAsync(request, cancellationToken);
            await loginThrottle.OnSuccessAsync(ip, cancellationToken);
            return response;
        }
        catch (UnauthorizedAccessException)
        {
            await loginThrottle.OnFailedAttemptAsync(ip, cancellationToken);
            throw;
        }
    }

    [HttpPost("google")]
    [EnableRateLimiting("auth")]
    public async Task<AuthResponse> Google(GoogleLoginRequest request, CancellationToken cancellationToken)
    {
        string? ip = ClientIpResolver.Resolve(HttpContext);
        await loginThrottle.EnsureAllowedAsync(ip, cancellationToken);
        try
        {
            AuthResponse response = await authService.GoogleLoginAsync(request, cancellationToken);
            await loginThrottle.OnSuccessAsync(ip, cancellationToken);
            return response;
        }
        catch (UnauthorizedAccessException)
        {
            await loginThrottle.OnFailedAttemptAsync(ip, cancellationToken);
            throw;
        }
    }

    [Authorize]
    [HttpGet("me")]
    public Task<AuthMeResponse> Me(CancellationToken cancellationToken)
        => authService.GetMeAsync(currentUser.UserId, cancellationToken);

    [AllowAnonymous]
    [HttpPost("invite/accept")]
    [EnableRateLimiting("auth")]
    public async Task<AuthResponse> AcceptInvite(InviteAcceptRequest request, CancellationToken cancellationToken)
    {
        string? ip = ClientIpResolver.Resolve(HttpContext);
        AuthResponse response = await authService.AcceptWorkspaceInviteAsync(request, cancellationToken);
        await loginThrottle.OnSuccessAsync(ip, cancellationToken);
        return response;
    }
}
