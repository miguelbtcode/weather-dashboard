using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Caching.Memory;

public class RateLimitingMiddleware : IFunctionsWorkerMiddleware
{
    private readonly IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());

    private readonly int _limit = 5;
    private readonly TimeSpan _window = TimeSpan.FromSeconds(10);

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpRequest = await context.GetHttpRequestDataAsync();

        if (httpRequest != null)
        {
            var ip = httpRequest.Headers.TryGetValues("X-Forwarded-For", out var values)
                ? values.First().Split(',')[0]
                : context.GetHttpContext()?.Connection?.RemoteIpAddress?.ToString() ?? "unknown";

            var cacheKey = $"rate-limit:{ip}";

            var count = _cache.GetOrCreate(
                cacheKey,
                entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = _window;
                    return 0;
                }
            );

            if (count >= _limit)
            {
                var response = httpRequest.CreateResponse(HttpStatusCode.TooManyRequests);
                response.Headers.Add("Retry-After", _window.TotalSeconds.ToString());
                await response.WriteStringAsync("Too many requests. Try again later.");
                context.GetInvocationResult().Value = response;
                return;
            }

            _cache.Set(cacheKey, (int)count + 1, _window);
        }

        await next(context);
    }
}
