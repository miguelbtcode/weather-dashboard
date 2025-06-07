using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using WeatherDashboard.Functions.Models;
using WeatherDashboard.Functions.Services.Interfaces;

namespace WeatherDashboard.Functions.Functions
{
    public class WeatherFunctions
    {
        private readonly IWeatherService _weatherService;
        private readonly ILogger<WeatherFunctions> _logger;

        public WeatherFunctions(IWeatherService weatherService, ILogger<WeatherFunctions> logger)
        {
            _weatherService = weatherService;
            _logger = logger;
        }

        [Function("GetCurrentWeather")]
        [OpenApiOperation(
            operationId: "GetCurrentWeather",
            tags: new[] { "Weather" },
            Summary = "Get current weather for a city",
            Description = "Returns current weather conditions including temperature, humidity, wind speed, and weather description. Supports both metric and imperial units."
        )]
        [OpenApiParameter(
            name: "city",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "City name (e.g., London, Paris, Tokyo)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<WeatherResponse>),
            Description = "Current weather data"
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.BadRequest,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<WeatherResponse>),
            Description = "City not found or invalid request"
        )]
        public async Task<HttpResponseData> GetCurrentWeather(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather/{city}")]
                HttpRequestData req,
            string city
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var units = query["units"] ?? "metric";

            _logger.LogInformation("Getting weather for {City} in {Units} units", city, units);

            var result = await _weatherService.GetCurrentWeatherAsync(city, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetForecast")]
        [OpenApiOperation(
            operationId: "GetForecast",
            tags: new[] { "Weather" },
            Summary = "Get 5-day weather forecast",
            Description = "Returns 5-day weather forecast with 3-hour intervals including temperature trends and weather conditions. Supports both metric and imperial units."
        )]
        [OpenApiParameter(
            name: "city",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "City name (e.g., London, Paris, Tokyo)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<ForecastResponse>),
            Description = "5-day weather forecast"
        )]
        public async Task<HttpResponseData> GetForecast(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "forecast/{city}")]
                HttpRequestData req,
            string city
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var units = query["units"] ?? "metric";

            _logger.LogInformation("Getting forecast for {City} in {Units} units", city, units);

            var result = await _weatherService.GetForecastAsync(city, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetAlerts")]
        [OpenApiOperation(
            operationId: "GetAlerts",
            tags: new[] { "Alerts" },
            Summary = "Get weather alerts for a city",
            Description = "Evaluates current weather conditions and returns any active alerts for extreme temperatures, wind, etc. Alerts are adjusted based on temperature units."
        )]
        [OpenApiParameter(
            name: "city",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "City name (e.g., London, Paris, Tokyo)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<List<WeatherAlert>>),
            Description = "List of active weather alerts"
        )]
        public async Task<HttpResponseData> GetAlerts(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "alerts/{city}")]
                HttpRequestData req,
            string city
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var units = query["units"] ?? "metric";

            _logger.LogInformation("Getting alerts for {City} in {Units} units", city, units);

            var result = await _weatherService.EvaluateAlertsAsync(city, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetCurrentWeatherByCoords")]
        [OpenApiOperation(
            operationId: "GetCurrentWeatherByCoords",
            tags: new[] { "Weather" },
            Summary = "Get current weather by coordinates",
            Description = "Returns current weather conditions for specific latitude and longitude coordinates."
        )]
        [OpenApiParameter(
            name: "lat",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Latitude (-90 to 90)"
        )]
        [OpenApiParameter(
            name: "lon",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Longitude (-180 to 180)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        public async Task<HttpResponseData> GetCurrentWeatherByCoords(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather-coords")]
                HttpRequestData req
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);

            if (
                !double.TryParse(query["lat"], out var lat)
                || !double.TryParse(query["lon"], out var lon)
            )
            {
                var errorResponse = ApiResponse<WeatherResponse>.Error(
                    "Invalid latitude or longitude parameters. Please provide valid numeric values."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            {
                var errorResponse = ApiResponse<WeatherResponse>.Error(
                    "Coordinates out of valid range. Latitude must be between -90 and 90, longitude between -180 and 180."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            var units = query["units"] ?? "metric";

            _logger.LogInformation(
                "Getting weather for coordinates {Lat}, {Lon} in {Units} units",
                lat,
                lon,
                units
            );

            var result = await _weatherService.GetCurrentWeatherByCoordinatesAsync(lat, lon, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetForecastByCoords")]
        [OpenApiOperation(
            operationId: "GetForecastByCoords",
            tags: new[] { "Weather" },
            Summary = "Get 5-day weather forecast by coordinates",
            Description = "Returns 5-day weather forecast for specific latitude and longitude coordinates."
        )]
        [OpenApiParameter(
            name: "lat",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Latitude (-90 to 90)"
        )]
        [OpenApiParameter(
            name: "lon",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Longitude (-180 to 180)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        public async Task<HttpResponseData> GetForecastByCoords(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "forecast-coords")]
                HttpRequestData req
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);

            if (
                !double.TryParse(query["lat"], out var lat)
                || !double.TryParse(query["lon"], out var lon)
            )
            {
                var errorResponse = ApiResponse<ForecastResponse>.Error(
                    "Invalid latitude or longitude parameters. Please provide valid numeric values."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            {
                var errorResponse = ApiResponse<ForecastResponse>.Error(
                    "Coordinates out of valid range. Latitude must be between -90 and 90, longitude between -180 and 180."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            var units = query["units"] ?? "metric";

            _logger.LogInformation(
                "Getting forecast for coordinates {Lat}, {Lon} in {Units} units",
                lat,
                lon,
                units
            );

            var result = await _weatherService.GetForecastByCoordinatesAsync(lat, lon, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetAlertsByCoords")]
        [OpenApiOperation(
            operationId: "GetAlertsByCoords",
            tags: new[] { "Alerts" },
            Summary = "Get weather alerts by coordinates",
            Description = "Evaluates weather conditions for specific coordinates and returns active alerts."
        )]
        [OpenApiParameter(
            name: "lat",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Latitude (-90 to 90)"
        )]
        [OpenApiParameter(
            name: "lon",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(double),
            Description = "Longitude (-180 to 180)"
        )]
        [OpenApiParameter(
            name: "units",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
        )]
        public async Task<HttpResponseData> GetAlertsByCoords(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "alerts-coords")]
                HttpRequestData req
        )
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);

            if (
                !double.TryParse(query["lat"], out var lat)
                || !double.TryParse(query["lon"], out var lon)
            )
            {
                var errorResponse = ApiResponse<List<WeatherAlert>>.Error(
                    "Invalid latitude or longitude parameters. Please provide valid numeric values."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            {
                var errorResponse = ApiResponse<List<WeatherAlert>>.Error(
                    "Coordinates out of valid range. Latitude must be between -90 and 90, longitude between -180 and 180."
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
            }

            var units = query["units"] ?? "metric";

            _logger.LogInformation(
                "Getting alerts for coordinates {Lat}, {Lon} in {Units} units",
                lat,
                lon,
                units
            );

            var result = await _weatherService.EvaluateAlertsByCoordinatesAsync(lat, lon, units);
            return await CreateResponse(
                req,
                result,
                result.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest
            );
        }

        [Function("GetWeatherStats")]
        [OpenApiOperation(
            operationId: "GetWeatherStats",
            tags: new[] { "Analytics" },
            Summary = "Get weather statistics",
            Description = "Returns weather statistics and trends for a city including historical comparison."
        )]
        [OpenApiParameter(
            name: "city",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "City name"
        )]
        public async Task<HttpResponseData> GetWeatherStats(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "stats/{city}")]
                HttpRequestData req,
            string city
        )
        {
            try
            {
                // Get current weather and forecast data
                var currentTask = _weatherService.GetCurrentWeatherAsync(city);
                var forecastTask = _weatherService.GetForecastAsync(city);

                await Task.WhenAll(currentTask, forecastTask);

                var currentResult = await currentTask;
                var forecastResult = await forecastTask;

                if (!currentResult.Success || !forecastResult.Success)
                {
                    var errorResponse = ApiResponse<object>.Error(
                        "Unable to retrieve weather data for statistics"
                    );
                    return await CreateResponse(req, errorResponse, HttpStatusCode.BadRequest);
                }

                // Calculate statistics
                var stats = new
                {
                    City = city,
                    CurrentConditions = currentResult.Data,
                    WeeklyStats = new
                    {
                        AverageTemp = forecastResult.Data?.List?.Average(f => f.Main.Temp) ?? 0,
                        MaxTemp = forecastResult.Data?.List?.Max(f => f.Main.TempMax) ?? 0,
                        MinTemp = forecastResult.Data?.List?.Min(f => f.Main.TempMin) ?? 0,
                        RainyDays = forecastResult.Data?.List?.Count(f =>
                            f.Weather.Any(w => w.Main.ToLower().Contains("rain"))
                        ) ?? 0,
                        SunnyDays = forecastResult.Data?.List?.Count(f =>
                            f.Weather.Any(w => w.Main.ToLower().Contains("clear"))
                        ) ?? 0,
                    },
                    GeneratedAt = DateTime.UtcNow,
                };

                var response = ApiResponse<object>.Ok(
                    stats,
                    "Weather statistics generated successfully"
                );
                return await CreateResponse(req, response, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating weather stats for {City}", city);
                var errorResponse = ApiResponse<object>.Error(
                    "Statistics service temporarily unavailable"
                );
                return await CreateResponse(req, errorResponse, HttpStatusCode.InternalServerError);
            }
        }

        private async Task<HttpResponseData> CreateResponse<T>(
            HttpRequestData req,
            T data,
            HttpStatusCode statusCode
        )
        {
            var response = req.CreateResponse(statusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            // CORS preflight
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.Headers.Add(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With"
            );
            response.Headers.Add("Access-Control-Max-Age", "3600");

            // Additional headers to improve performance
            response.Headers.Add("Cache-Control", "public, max-age=900"); // 15 minutes
            response.Headers.Add("X-Content-Type-Options", "nosniff");
            response.Headers.Add("X-Frame-Options", "DENY");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System
                    .Text
                    .Json
                    .Serialization
                    .JsonIgnoreCondition
                    .WhenWritingNull,
                WriteIndented = false,
            };

            var json = JsonSerializer.Serialize(data, options);
            await response.WriteStringAsync(json);

            return response;
        }

        [Function("HandleOptions")]
        public async Task<HttpResponseData> HandleOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "{*path}")]
                HttpRequestData req
        )
        {
            var response = req.CreateResponse(HttpStatusCode.OK);

            // CORS preflight
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.Headers.Add(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With"
            );
            response.Headers.Add("Access-Control-Max-Age", "3600");

            return response;
        }
    }
}
