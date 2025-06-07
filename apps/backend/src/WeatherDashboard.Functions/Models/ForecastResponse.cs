using System.Text.Json.Serialization;

namespace WeatherDashboard.Functions.Models
{
    public class ForecastResponse
    {
        [JsonPropertyName("list")]
        public ForecastItem[] List { get; set; } = Array.Empty<ForecastItem>();

        [JsonPropertyName("city")]
        public CityInfo City { get; set; } = new();
    }

    public class ForecastItem
    {
        [JsonPropertyName("dt")]
        public long Dt { get; set; }

        [JsonPropertyName("main")]
        public WeatherMain Main { get; set; } = new();

        [JsonPropertyName("weather")]
        public WeatherInfo[] Weather { get; set; } = Array.Empty<WeatherInfo>();

        [JsonPropertyName("wind")]
        public WindInfo Wind { get; set; } = new();

        [JsonPropertyName("pop")]
        public double Pop { get; set; } // Probability of precipitation

        public DateTime DateTime => DateTimeOffset.FromUnixTimeSeconds(Dt).DateTime;
        public double TemperatureCelsius => Main.Temp;
        public string Description => Weather.FirstOrDefault()?.Description ?? "";
    }

    public class CityInfo
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("country")]
        public string Country { get; set; } = string.Empty;
    }
}
