using WeatherDashboard.Functions.Models;

namespace WeatherDashboard.Functions.Services.Interfaces
{
    public interface IWeatherService
    {
        Task<ApiResponse<WeatherResponse>> GetCurrentWeatherAsync(
            string city,
            string units = "metric"
        );
        Task<ApiResponse<ForecastResponse>> GetForecastAsync(string city, string units = "metric");
        Task<ApiResponse<List<WeatherAlert>>> EvaluateAlertsAsync(
            string city,
            string units = "metric"
        );
        Task<ApiResponse<WeatherResponse>> GetCurrentWeatherByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        );
        Task<ApiResponse<ForecastResponse>> GetForecastByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        );
        Task<ApiResponse<List<WeatherAlert>>> EvaluateAlertsByCoordinatesAsync(
            double lat,
            double lon,
            string units = "metric"
        );
    }
}
