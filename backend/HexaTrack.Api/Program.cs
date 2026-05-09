using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HexaTrack.Api.Api;
using HexaTrack.Api.Api.Middleware;
using HexaTrack.Api.Application.Security;
using HexaTrack.Api.Application.Services;
using HexaTrack.Api.Infrastructure;
using HexaTrack.Api.Infrastructure.Repositories;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

string postgresConnection = builder.Configuration.GetConnectionString("Postgres")
    ?? throw new InvalidOperationException("ConnectionStrings:Postgres is required.");
string redisConnection = builder.Configuration.GetConnectionString("Redis")
    ?? throw new InvalidOperationException("ConnectionStrings:Redis is required.");

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<GoogleAuthOptions>(builder.Configuration.GetSection(GoogleAuthOptions.SectionName));
builder.Services.Configure<SuperAdminOptions>(builder.Configuration.GetSection(SuperAdminOptions.SectionName));

JwtOptions jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("Jwt configuration is required.");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCors(options =>
{
    options.AddPolicy("HexaTrackFrontend", policy =>
    {
        string[] allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>()
            ?? ["http://localhost:3000", "http://127.0.0.1:3000"];

        policy
            // Dev ergonomics: Next.js dev server may jump ports (3000/3002/3003...).
            // Allow any localhost/loopback origin in Development, and otherwise fall back
            // to the configured allowlist.
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrWhiteSpace(origin)) return false;
                if (!Uri.TryCreate(origin, UriKind.Absolute, out Uri? uri)) return false;

                if (builder.Environment.IsDevelopment() &&
                    (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) || uri.Host == "127.0.0.1"))
                {
                    return true;
                }

                return allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase);
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<HexaTrackDbContext>(options =>
    options.UseNpgsql(postgresConnection, npgsql => npgsql.EnableRetryOnFailure()));

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
{
    // In dev we want the API to start even if Redis is temporarily down.
    // The multiplexer will keep retrying in the background.
    ConfigurationOptions options = ConfigurationOptions.Parse(redisConnection, ignoreUnknown: true);
    options.AbortOnConnectFail = false;
    options.ConnectRetry = Math.Max(options.ConnectRetry, 3);
    options.ConnectTimeout = Math.Max(options.ConnectTimeout, 5000);
    return ConnectionMultiplexer.Connect(options);
});

builder.Services.AddHangfire(configuration => configuration
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(postgresConnection)));
builder.Services.AddHangfireServer();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdmin", policy =>
        policy.RequireClaim(ClaimTypes.Role, "SuperAdmin"));
});

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped(typeof(IUserScopedRepository<>), typeof(UserScopedRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<ICurrentWorkspace, CurrentWorkspace>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IRecurringTransactionService, RecurringTransactionService>();
builder.Services.AddScoped<IGroupExpenseService, GroupExpenseService>();
builder.Services.AddScoped<IReportsService, ReportsService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IBackupService, BackupService>();
builder.Services.AddScoped<IAdminAuditService, AdminAuditService>();
builder.Services.AddScoped<IAdminUsersService, AdminUsersService>();
builder.Services.AddScoped<IAdminFeatureFlagsService, AdminFeatureFlagsService>();
builder.Services.AddScoped<IAdminGlobalSettingsService, AdminGlobalSettingsService>();
builder.Services.AddScoped<IAdminWorkspacesService, AdminWorkspacesService>();
builder.Services.AddScoped<IAdminAiUsageService, AdminAiUsageService>();
builder.Services.AddScoped<IWorkspaceInviteService, WorkspaceInviteService>();

builder.Services.AddHostedService<SuperAdminBootstrapHostedService>();

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHangfireDashboard("/jobs");
}

// app.UseHttpsRedirection();
app.UseCors("HexaTrackFrontend");
app.UseAuthentication();
app.UseMiddleware<WorkspaceContextMiddleware>();
app.UseAuthorization();
app.MapControllers();

RecurringJob.AddOrUpdate<IRecurringTransactionService>(
    "HexaTrack-recurring-transactions",
    service => service.ProcessDueAsync(CancellationToken.None),
    Cron.Hourly);

app.Run();

