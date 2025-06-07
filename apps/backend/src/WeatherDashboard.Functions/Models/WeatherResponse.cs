using System.Text.Json.Serialization;

namespace WeatherDashboard.Functions.Models
{
    public class WeatherResponse
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("main")]
        public WeatherMain Main { get; set; } = new();

        [JsonPropertyName("weather")]
        public WeatherInfo[] Weather { get; set; } = Array.Empty<WeatherInfo>();

        [JsonPropertyName("wind")]
        public WindInfo Wind { get; set; } = new();

        [JsonPropertyName("dt")]
        public long Dt { get; set; }

        [JsonPropertyName("coord")]
        public Coordinates Coord { get; set; } = new();

        [JsonPropertyName("sys")]
        public SystemInfo Sys { get; set; } = new();

        [JsonPropertyName("visibility")]
        public int Visibility { get; set; }

        [JsonPropertyName("clouds")]
        public CloudInfo Clouds { get; set; } = new();

        // Calculated properties
        public DateTime DateTime => DateTimeOffset.FromUnixTimeSeconds(Dt).DateTime;
        public double TemperatureCelsius => Main.Temp;
        public string Description => Weather.FirstOrDefault()?.Description ?? "";
        public string Icon => Weather.FirstOrDefault()?.Icon ?? "";
    }

    public class WeatherMain
    {
        [JsonPropertyName("temp")]
        public double Temp { get; set; }

        [JsonPropertyName("feels_like")]
        public double FeelsLike { get; set; }

        [JsonPropertyName("humidity")]
        public int Humidity { get; set; }

        [JsonPropertyName("pressure")]
        public int Pressure { get; set; }

        [JsonPropertyName("temp_min")]
        public double TempMin { get; set; }

        [JsonPropertyName("temp_max")]
        public double TempMax { get; set; }
    }

    public class WeatherInfo
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("main")]
        public string Main { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("icon")]
        public string Icon { get; set; } = string.Empty;
    }

    public class WindInfo
    {
        [JsonPropertyName("speed")]
        public double Speed { get; set; }

        [JsonPropertyName("deg")]
        public int Deg { get; set; }
    }

    public class Coordinates
    {
        [JsonPropertyName("lon")]
        public double Lon { get; set; }

        [JsonPropertyName("lat")]
        public double Lat { get; set; }
    }

    public class SystemInfo
    {
        [JsonPropertyName("country")]
        public string Country { get; set; } = string.Empty;

        [JsonPropertyName("sunrise")]
        public long Sunrise { get; set; }

        [JsonPropertyName("sunset")]
        public long Sunset { get; set; }
    }

    public class CloudInfo
    {
        [JsonPropertyName("all")]
        public int All { get; set; }
    }
}
