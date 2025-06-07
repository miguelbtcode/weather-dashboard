using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace WeatherDashboard.Functions;

public class WeatherHttpTrigger
{
    private readonly ILogger<WeatherHttpTrigger> _logger;

    public WeatherHttpTrigger(ILogger<WeatherHttpTrigger> logger)
    {
        _logger = logger;
    }

    [Function("WeatherHttpTrigger")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req
    )
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        return new OkObjectResult("Welcome to Azure Functions!");
    }
}
