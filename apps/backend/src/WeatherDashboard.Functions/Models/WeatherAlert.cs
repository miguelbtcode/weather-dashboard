namespace WeatherDashboard.Functions.Models
{
    public class WeatherAlert
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string City { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public double Value { get; set; }
        public double Threshold { get; set; }
    }
}
