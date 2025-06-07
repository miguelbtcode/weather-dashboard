using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WeatherDashboard.Functions.Configuration;
using WeatherDashboard.Functions.Middleware;
using WeatherDashboard.Functions.Services;
using WeatherDashboard.Functions.Services.Interfaces;

var builder = FunctionsApplication.CreateBuilder(args);

var appSettings = AppSettings.LoadFromConfiguration(builder.Configuration);

builder.Services.AddSingleton(appSettings);

builder.Services.AddSingleton(sp =>
{
    var logger = sp.GetRequiredService<ILogger<RedisConfiguration>>();
    var redisConfig = new RedisConfiguration(appSettings.RedisConnectionString, logger);

    // Inicializa la conexión en forma síncrona para el startup
    // Como InitializeAsync es async, puedes esperar aquí con .GetAwaiter().GetResult()
    var success = redisConfig.InitializeAsync().GetAwaiter().GetResult();
    if (!success)
    {
        // Puedes lanzar excepción o manejar el caso de fallo de conexión aquí
        logger.LogWarning("No se pudo conectar a Redis. Cache deshabilitada.");
    }
    return redisConfig;
});

builder.ConfigureFunctionsWebApplication();
builder.Services.AddApplicationInsightsTelemetryWorkerService();
builder.Services.ConfigureFunctionsApplicationInsights();

builder.Services.AddSingleton(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    return AppSettings.LoadFromConfiguration(configuration);
});

builder.Services.AddHttpClient<IWeatherService, WeatherService>();
builder.Services.AddSingleton<ICacheService, CacheService>();

builder.UseMiddleware<RedisRateLimitingMiddleware>();

builder.Build().Run();
