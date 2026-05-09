using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HexaTrack.Api.Application.Dtos;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;

namespace HexaTrack.Api.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService, ICurrentUser currentUser) : ControllerBase
{
    [HttpPost("register")]
    public Task<AuthResponse> Register(RegisterRequest request, CancellationToken cancellationToken)
        => authService.RegisterAsync(request, cancellationToken);

    [HttpPost("login")]
    public Task<AuthResponse> Login(LoginRequest request, CancellationToken cancellationToken)
        => authService.LoginAsync(request, cancellationToken);

    [HttpPost("google")]
    public Task<AuthResponse> Google(GoogleLoginRequest request, CancellationToken cancellationToken)
        => authService.GoogleLoginAsync(request, cancellationToken);

    [Authorize]
    [HttpGet("me")]
    public Task<AuthMeResponse> Me(CancellationToken cancellationToken)
        => authService.GetMeAsync(currentUser.UserId, cancellationToken);

    [AllowAnonymous]
    [HttpPost("invite/accept")]
    public Task<AuthResponse> AcceptInvite(InviteAcceptRequest request, CancellationToken cancellationToken)
        => authService.AcceptWorkspaceInviteAsync(request, cancellationToken);
}

