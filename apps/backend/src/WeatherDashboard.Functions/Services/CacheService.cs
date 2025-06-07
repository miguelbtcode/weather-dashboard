using System.Text.Json;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using WeatherDashboard.Functions.Configuration;
using WeatherDashboard.Functions.Services.Interfaces;

namespace WeatherDashboard.Functions.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDatabase? _database;
        private readonly ILogger<CacheService> _logger;

        public CacheService(RedisConfiguration redisConfig, ILogger<CacheService> logger)
        {
            _logger = logger;
            _database = redisConfig.GetDatabase();

            if (_database == null)
            {
                _logger.LogWarning(
                    "Redis not configured or connection not established. Cache disabled."
                );
            }
            else
            {
                _logger.LogInformation("Redis cache initialized from RedisConfiguration.");
            }
        }

        public async Task<T?> GetAsync<T>(string key)
            where T : class
        {
            if (_database == null)
                return null;

            try
            {
                var value = await _database.StringGetAsync(key);
                if (!value.HasValue)
                    return null;

                return JsonSerializer.Deserialize<T>(value!);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cache get error for key: {Key}", key);
                return null;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
            where T : class
        {
            if (_database == null || value == null)
                return;

            try
            {
                var json = JsonSerializer.Serialize(value);
                await _database.StringSetAsync(key, json, expiration ?? TimeSpan.FromMinutes(30));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cache set error for key: {Key}", key);
            }
        }

        /// <summary>
        /// Additional method for health check
        /// </summary>
        public async Task<bool> IsHealthyAsync()
        {
            if (_database == null)
                return false;

            try
            {
                var ping = await _database.PingAsync();
                return ping.TotalMilliseconds < 1000;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Additional method for clearing cache (useful for development)
        /// </summary>
        public async Task<bool> ClearAsync(string pattern = "*")
        {
            if (_database == null)
                return false;

            try
            {
                var endpoints = _database.Multiplexer.GetEndPoints();
                var server = _database.Multiplexer.GetServer(endpoints.First());
                var keys = server.Keys(pattern: pattern);

                foreach (var key in keys)
                {
                    await _database.KeyDeleteAsync(key);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache");
                return false;
            }
        }
    }
}
