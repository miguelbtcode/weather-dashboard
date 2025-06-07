using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WeatherDashboard.Functions.Models;
using WeatherDashboard.Functions.Services.Interfaces;

namespace WeatherDashboard.Functions.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly ICacheService _cache;
        private readonly ILogger<WeatherService> _logger;
        private readonly string _apiKey;
        private readonly string _baseUrl = "https://api.openweathermap.org/data/2.5";

        public WeatherService(
            HttpClient httpClient,
            ICacheService cache,
            IConfiguration config,
            ILogger<WeatherService> logger
        )
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;
            _apiKey =
                config["OpenWeatherMapApiKey"] ?? throw new ArgumentException("API Key required");
        }

        public async Task<ApiResponse<WeatherResponse>> GetCurrentWeatherAsync(
            string city,
            string units = "metric"
        )
        {
            try
            {
                // Validate units
                if (units != "metric" && units != "imperial")
                {
                    units = "metric";
                }

                // Try cache first
                var cacheKey = $"weather:{city.ToLower()}:{units}";
                var cached = await _cache.GetAsync<WeatherResponse>(cacheKey);
                if (cached != null)
                {
                    _logger.LogInformation("Cache hit for weather: {City} ({Units})", city, units);
                    return ApiResponse<WeatherResponse>.Ok(cached, "From cache");
                }

                // Call API with specific units
                var url =
                    $"{_baseUrl}/weather?q={Uri.EscapeDataString(city)}&appid={_apiKey}&units={units}";

                _logger.LogInformation(
                    "Calling OpenWeatherMap API: {Url}",
                    url.Replace(_apiKey, "***")
                );

                var response = await _httpClient.GetStringAsync(url);
                var weather = JsonSerializer.Deserialize<WeatherResponse>(
                    response,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (weather != null)
                {
                    // Enrich data if necessary
                    weather = await EnrichWeatherData(weather, units);

                    await _cache.SetAsync(cacheKey, weather, TimeSpan.FromMinutes(15));
                    _logger.LogInformation("Weather data cached for {City} ({Units})", city, units);

                    return ApiResponse<WeatherResponse>.Ok(weather);
                }

                return ApiResponse<WeatherResponse>.Error("Failed to parse weather data");
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("404"))
            {
                _logger.LogWarning("City not found: {City}", city);
                return ApiResponse<WeatherResponse>.Error($"City '{city}' not found");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error getting weather for {City}", city);
                return ApiResponse<WeatherResponse>.Error(
                    "Weather service temporarily unavailable"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting weather for {City}", city);
                return ApiResponse<WeatherResponse>.Error("Weather service unavailable");
            }
        }

        public async Task<ApiResponse<ForecastResponse>> GetForecastAsync(
            string city,
            string units = "metric"
        )
        {
            try
            {
                if (units != "metric" && units != "imperial")
                {
                    units = "metric";
                }

                var cacheKey = $"forecast:{city.ToLower()}:{units}";
                var cached = await _cache.GetAsync<ForecastResponse>(cacheKey);
                if (cached != null)
                {
                    _logger.LogInformation("Cache hit for forecast: {City} ({Units})", city, units);
                    return ApiResponse<ForecastResponse>.Ok(cached, "From cache");
                }

                var url =
                    $"{_baseUrl}/forecast?q={Uri.EscapeDataString(city)}&appid={_apiKey}&units={units}";

                _logger.LogInformation("Calling OpenWeatherMap forecast API for {City}", city);

                var response = await _httpClient.GetStringAsync(url);
                var forecast = JsonSerializer.Deserialize<ForecastResponse>(
                    response,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (forecast != null)
                {
                    // Process and enrich forecast data
                    forecast = await ProcessForecastData(forecast, units);

                    await _cache.SetAsync(cacheKey, forecast, TimeSpan.FromHours(1));
                    _logger.LogInformation(
                        "Forecast data cached for {City} ({Units})",
                        city,
                        units
                    );

                    return ApiResponse<ForecastResponse>.Ok(forecast);
                }

                return ApiResponse<ForecastResponse>.Error("Failed to parse forecast data");
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("404"))
            {
                _logger.LogWarning("City not found for forecast: {City}", city);
                return ApiResponse<ForecastResponse>.Error($"City '{city}' not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting forecast for {City}", city);
                return ApiResponse<ForecastResponse>.Error("Forecast service unavailable");
            }
        }

        public async Task<ApiResponse<List<WeatherAlert>>> EvaluateAlertsAsync(
            string city,
            string units = "metric"
        )
        {
            try
            {
                var weatherResult = await GetCurrentWeatherAsync(city, units);
                if (!weatherResult.Success || weatherResult.Data == null)
                    return ApiResponse<List<WeatherAlert>>.Error(
                        "Cannot get weather data for alerts"
                    );

                var weather = weatherResult.Data;
                var alerts = new List<WeatherAlert>();

                // Dynamic alerts based on units
                var tempUnit = units == "metric" ? "°C" : "°F";
                var speedUnit = units == "metric" ? "km/h" : "mph";

                // Thresholds adjusted according to the unit
                var highTempThreshold = units == "metric" ? 35.0 : 95.0; // 35°C = 95°F
                var lowTempThreshold = units == "metric" ? 0.0 : 32.0; // 0°C = 32°F
                var windThreshold = units == "metric" ? 50.0 : 31.0; // 50 km/h = ~31 mph

                // High temperature alert
                if (weather.TemperatureCelsius > (units == "metric" ? 35 : 95))
                {
                    alerts.Add(
                        new WeatherAlert
                        {
                            City = city,
                            Type = "High Temperature",
                            Message =
                                $"Extreme heat warning: {weather.TemperatureCelsius:F1}{tempUnit}",
                            Severity =
                                weather.TemperatureCelsius > (units == "metric" ? 40 : 104)
                                    ? "High"
                                    : "Medium",
                            Value = weather.TemperatureCelsius,
                            Threshold = highTempThreshold,
                        }
                    );
                }

                // Low temperature alert
                if (weather.TemperatureCelsius < (units == "metric" ? 0 : 32))
                {
                    alerts.Add(
                        new WeatherAlert
                        {
                            City = city,
                            Type = "Low Temperature",
                            Message =
                                $"Freezing conditions: {weather.TemperatureCelsius:F1}{tempUnit}",
                            Severity =
                                weather.TemperatureCelsius < (units == "metric" ? -10 : 14)
                                    ? "High"
                                    : "Medium",
                            Value = weather.TemperatureCelsius,
                            Threshold = lowTempThreshold,
                        }
                    );
                }

                // Strong wind alert
                var windSpeed =
                    units == "metric" ? weather.Wind.Speed : weather.Wind.Speed * 0.621371;
                if (windSpeed > windThreshold)
                {
                    alerts.Add(
                        new WeatherAlert
                        {
                            City = city,
                            Type = "Strong Wind",
                            Message = $"High wind speeds: {windSpeed:F1} {speedUnit}",
                            Severity =
                                windSpeed > (units == "metric" ? 70 : 43) ? "High" : "Medium",
                            Value = windSpeed,
                            Threshold = windThreshold,
                        }
                    );
                }

                // Severe weather alert
                var condition = weather.Weather.FirstOrDefault()?.Main?.ToLower();
                if (condition == "thunderstorm")
                {
                    alerts.Add(
                        new WeatherAlert
                        {
                            City = city,
                            Type = "Severe Weather",
                            Message = "Thunderstorm conditions detected",
                            Severity = "High",
                            Value = 1,
                            Threshold = 0,
                        }
                    );
                }

                // Cache alerts
                var cacheKey = $"alerts:{city.ToLower()}:{units}";
                await _cache.SetAsync(cacheKey, alerts, TimeSpan.FromMinutes(10));

                _logger.LogInformation(
                    "Generated {AlertCount} alerts for {City}",
                    alerts.Count,
                    city
                );

                return ApiResponse<List<WeatherAlert>>.Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error evaluating alerts for {City}", city);
                return ApiResponse<List<WeatherAlert>>.Error("Alert service unavailable");
            }
        }

        public async Task<ApiResponse<WeatherResponse>> GetCurrentWeatherByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        )
        {
            try
            {
                if (units != "metric" && units != "imperial")
                {
                    units = "metric";
                }

                var cacheKey = $"weather:coords:{lat:F2}:{lon:F2}:{units}";
                var cached = await _cache.GetAsync<WeatherResponse>(cacheKey);
                if (cached != null)
                    return ApiResponse<WeatherResponse>.Ok(cached, "From cache");

                var weatherUrl =
                    $"{_baseUrl}/weather?lat={lat}&lon={lon}&appid={_apiKey}&units={units}";
                var weatherResponse = await _httpClient.GetStringAsync(weatherUrl);
                var weather = JsonSerializer.Deserialize<WeatherResponse>(
                    weatherResponse,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (weather != null)
                {
                    // Get correct location name
                    var correctLocationName = await GetCorrectLocationNameAsync(lat, lon);
                    weather.Name = correctLocationName;

                    // Enrich data
                    weather = await EnrichWeatherData(weather, units);

                    await _cache.SetAsync(cacheKey, weather, TimeSpan.FromMinutes(15));
                    return ApiResponse<WeatherResponse>.Ok(weather);
                }

                return ApiResponse<WeatherResponse>.Error("Failed to parse weather data");
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("400"))
            {
                return ApiResponse<WeatherResponse>.Error("Invalid coordinates provided");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error getting weather for coordinates {Lat}, {Lon}",
                    lat,
                    lon
                );
                return ApiResponse<WeatherResponse>.Error("Weather service unavailable");
            }
        }

        public async Task<ApiResponse<ForecastResponse>> GetForecastByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        )
        {
            try
            {
                if (units != "metric" && units != "imperial")
                {
                    units = "metric";
                }

                var cacheKey = $"forecast:coords:{lat:F2}:{lon:F2}:{units}";
                var cached = await _cache.GetAsync<ForecastResponse>(cacheKey);
                if (cached != null)
                    return ApiResponse<ForecastResponse>.Ok(cached, "From cache");

                var url = $"{_baseUrl}/forecast?lat={lat}&lon={lon}&appid={_apiKey}&units={units}";
                var response = await _httpClient.GetStringAsync(url);
                var forecast = JsonSerializer.Deserialize<ForecastResponse>(
                    response,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (forecast != null)
                {
                    forecast = await ProcessForecastData(forecast, units);
                    await _cache.SetAsync(cacheKey, forecast, TimeSpan.FromHours(1));
                    return ApiResponse<ForecastResponse>.Ok(forecast);
                }

                return ApiResponse<ForecastResponse>.Error("Failed to parse forecast data");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error getting forecast for coordinates {Lat}, {Lon}",
                    lat,
                    lon
                );
                return ApiResponse<ForecastResponse>.Error("Forecast service unavailable");
            }
        }

        public async Task<ApiResponse<List<WeatherAlert>>> EvaluateAlertsByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        )
        {
            try
            {
                var weatherResult = await GetCurrentWeatherByCoordinatesAsync(lat, lon, units);
                if (!weatherResult.Success || weatherResult.Data == null)
                    return ApiResponse<List<WeatherAlert>>.Error(
                        "Cannot get weather data for alerts"
                    );

                var cityName = weatherResult.Data.Name ?? $"Location {lat:F2}, {lon:F2}";
                return await EvaluateAlertsAsync(cityName, units);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error evaluating alerts for coordinates {Lat}, {Lon}",
                    lat,
                    lon
                );
                return ApiResponse<List<WeatherAlert>>.Error("Alert service unavailable");
            }
        }

        // Private helper methods
        private async Task<WeatherResponse> EnrichWeatherData(WeatherResponse weather, string units)
        {
            //TODO: Here I can add logic to enrich the data
            // For example, calculating additional indexes, adding metadata, etc.

            return weather;
        }

        private async Task<ForecastResponse> ProcessForecastData(
            ForecastResponse forecast,
            string units
        )
        {
            //TODO: Process and optimize forecast data
            // For example, filter out irrelevant data, calculate averages, etc.

            return forecast;
        }

        private async Task<string> GetCorrectLocationNameAsync(double lat, double lon)
        {
            try
            {
                var reverseUrl =
                    $"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={_apiKey}";
                var reverseResponse = await _httpClient.GetStringAsync(reverseUrl);
                var locations = JsonSerializer.Deserialize<LocationResult[]>(
                    reverseResponse,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                var location = locations?.FirstOrDefault();
                if (location != null)
                {
                    return string.IsNullOrEmpty(location.State)
                        ? $"{location.Name}, {location.Country}"
                        : $"{location.Name}, {location.State}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed reverse geocoding for {Lat}, {Lon}", lat, lon);
            }

            return $"Location {lat:F4}, {lon:F4}";
        }
    }
}
