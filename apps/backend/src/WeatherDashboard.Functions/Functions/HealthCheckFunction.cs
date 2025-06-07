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
    public class HealthCheckFunction
    {
        private readonly IWeatherService _weatherService;
        private readonly ILogger<HealthCheckFunction> _logger;

        public HealthCheckFunction(
            IWeatherService weatherService,
            ILogger<HealthCheckFunction> logger
        )
        {
            _weatherService = weatherService;
            _logger = logger;
        }

        [Function("HealthCheck")]
        [OpenApiOperation(
            operationId: "HealthCheck",
            tags: new[] { "System" },
            Summary = "API Health Check",
            Description = "Checks the health status of the Weather Dashboard API and its dependencies."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<object>),
            Description = "Service is healthy"
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.ServiceUnavailable,
            contentType: "application/json",
            bodyType: typeof(ApiResponse<object>),
            Description = "Service is unhealthy or degraded"
        )]
        public async Task<HttpResponseData> HealthCheck(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequestData req
        )
        {
            try
            {
                // Basic test of the weather service
                var testResult = await _weatherService.GetCurrentWeatherAsync("London");

                var health = new
                {
                    Status = testResult.Success ? "Healthy" : "Degraded",
                    Timestamp = DateTime.UtcNow,
                    WeatherService = testResult.Success ? "OK" : "Error",
                    Message = testResult.Success
                        ? "All services operational"
                        : "Weather service issues",
                    Version = "1.0.0",
                };

                var response = ApiResponse<object>.Ok(health);
                var statusCode = testResult.Success
                    ? HttpStatusCode.OK
                    : HttpStatusCode.ServiceUnavailable;

                return await CreateResponse(req, response, statusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");

                var health = new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Error = "Service unavailable",
                    Version = "1.0.0",
                };

                var response = ApiResponse<object>.Error("Health check failed");
                response.Data = health;

                return await CreateResponse(req, response, HttpStatusCode.ServiceUnavailable);
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

            // CORS
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            var json = JsonSerializer.Serialize(
                data,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
            );

            await response.WriteStringAsync(json);
            return response;
        }
    }
}
