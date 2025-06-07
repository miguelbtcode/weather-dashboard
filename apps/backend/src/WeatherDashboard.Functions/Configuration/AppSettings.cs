using Microsoft.Extensions.Configuration;

namespace WeatherDashboard.Functions.Configuration
{
    public class AppSettings
    {
        public string OpenWeatherMapApiKey { get; set; } = string.Empty;
        public string RedisConnectionString { get; set; } = string.Empty;
        public int CacheDurationMinutes { get; set; } = 15;
        public int ForecastCacheDurationMinutes { get; set; } = 60;

        // Simplified alert configuration
        public double HighTemperatureThreshold { get; set; } = 35.0;
        public double LowTemperatureThreshold { get; set; } = 0.0;
        public double HighWindSpeedThreshold { get; set; } = 15.0;

        // Rate limiting configuration
        public int RateLimitMaxRequests { get; set; } = 3;
        public int RateLimitWindowSeconds { get; set; } = 10;

        public static AppSettings LoadFromConfiguration(IConfiguration configuration)
        {
            return new AppSettings
            {
                OpenWeatherMapApiKey = configuration["OpenWeatherMapApiKey"] ?? string.Empty,
                RedisConnectionString = configuration["RedisConnectionString"] ?? string.Empty,
                CacheDurationMinutes = GetConfigValue(configuration, "CacheDurationMinutes", 15),
                ForecastCacheDurationMinutes = GetConfigValue(
                    configuration,
                    "ForecastCacheDurationMinutes",
                    60
                ),
                HighTemperatureThreshold = GetConfigValue(
                    configuration,
                    "HighTemperatureThreshold",
                    35.0
                ),
                LowTemperatureThreshold = GetConfigValue(
                    configuration,
                    "LowTemperatureThreshold",
                    0.0
                ),
                HighWindSpeedThreshold = GetConfigValue(
                    configuration,
                    "HighWindSpeedThreshold",
                    15.0
                ),
                RateLimitMaxRequests = GetConfigValue(configuration, "RateLimitMaxRequests", 3),
                RateLimitWindowSeconds = GetConfigValue(
                    configuration,
                    "RateLimitWindowSeconds",
                    10
                ),
            };
        }

        public bool IsValid => !string.IsNullOrWhiteSpace(OpenWeatherMapApiKey);

        public bool HasRedis => !string.IsNullOrWhiteSpace(RedisConnectionString);

        public TimeSpan CacheDuration => TimeSpan.FromMinutes(CacheDurationMinutes);

        public TimeSpan ForecastCacheDuration => TimeSpan.FromMinutes(ForecastCacheDurationMinutes);

        private static int GetConfigValue(IConfiguration config, string key, int defaultValue)
        {
            return int.TryParse(config[key], out var value) ? value : defaultValue;
        }

        private static double GetConfigValue(IConfiguration config, string key, double defaultValue)
        {
            return double.TryParse(config[key], out var value) ? value : defaultValue;
        }
    }
}
