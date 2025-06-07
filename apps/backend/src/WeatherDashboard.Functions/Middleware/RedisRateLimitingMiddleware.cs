using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using StackExchange.Redis;
using WeatherDashboard.Functions.Configuration;

namespace WeatherDashboard.Functions.Middleware;

public class RedisRateLimitingMiddleware : IFunctionsWorkerMiddleware
{
    private readonly IDatabase? _redisDb;
    private readonly int _limit = 5;
    private readonly TimeSpan _window = TimeSpan.FromSeconds(10);

    public RedisRateLimitingMiddleware(RedisConfiguration redisConfig, AppSettings appSettings)
    {
        _redisDb = redisConfig.GetDatabase();
        _limit = appSettings.RateLimitMaxRequests;
        _window = TimeSpan.FromSeconds(appSettings.RateLimitWindowSeconds);
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        if (_redisDb == null)
        {
            // Redis no disponible, simplemente continúa sin rate limit
            await next(context);
            return;
        }

        var httpRequest = await context.GetHttpRequestDataAsync();
        if (httpRequest == null)
        {
            await next(context);
            return;
        }

        var ip = httpRequest.Headers.TryGetValues("X-Forwarded-For", out var values)
            ? values.First().Split(',')[0]
            : context.GetHttpContext()?.Connection?.RemoteIpAddress?.ToString() ?? "unknown";

        string redisKey = $"rate-limit:{ip}";

        var count = await _redisDb.StringIncrementAsync(redisKey);
        if (count == 1)
        {
            await _redisDb.KeyExpireAsync(redisKey, _window);
        }

        if (count > _limit)
        {
            var response = httpRequest.CreateResponse(HttpStatusCode.TooManyRequests);
            response.Headers.Add("Retry-After", _window.TotalSeconds.ToString());
            await response.WriteStringAsync("Too many requests. Intenta nuevamente más tarde.");
            context.GetInvocationResult().Value = response;
            return;
        }

        await next(context);
    }
}
