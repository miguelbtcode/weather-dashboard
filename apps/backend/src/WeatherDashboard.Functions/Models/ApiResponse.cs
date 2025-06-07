namespace WeatherDashboard.Functions.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> Ok(T data, string message = "Success") =>
            new()
            {
                Success = true,
                Data = data,
                Message = message,
            };

        public static ApiResponse<T> Error(string message) =>
            new() { Success = false, Message = message };
    }
}
