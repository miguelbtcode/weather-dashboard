import {
  WeatherResponse,
  ForecastResponse,
  AlertsResponse,
} from "../types/weather";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7105/api";

export type TemperatureUnit = "metric" | "imperial";

interface RequestOptions {
  units?: TemperatureUnit;
  timeout?: number;
  retries?: number;
}

class WeatherService {
  private defaultOptions: RequestOptions = {
    units: "metric",
    timeout: 10000,
    retries: 2,
  };

  private async fetchFromApi<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { units, timeout, retries } = { ...this.defaultOptions, ...options };

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (units) {
      url.searchParams.append("units", units);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // Si no se puede parsear el JSON, usar el mensaje por defecto
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format from weather service");
        }

        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Si no es el último intento, esperar antes de reintentar
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
      }
    }

    console.error(
      `Error fetching ${endpoint} after ${retries + 1} attempts:`,
      lastError
    );
    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCurrentWeather(
    city: string,
    options: RequestOptions = {}
  ): Promise<WeatherResponse> {
    if (!city || !city.trim()) {
      throw new Error("City name is required");
    }

    return this.fetchFromApi<WeatherResponse>(
      `/weather/${encodeURIComponent(city.trim())}`,
      options
    );
  }

  async getCurrentWeatherByCoords(
    lat: number,
    lon: number,
    options: RequestOptions = {}
  ): Promise<WeatherResponse> {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (lon < -180 || lon > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    return this.fetchFromApi<WeatherResponse>(
      `/weather-coords?lat=${lat}&lon=${lon}`,
      options
    );
  }

  async getForecast(
    city: string,
    options: RequestOptions = {}
  ): Promise<ForecastResponse> {
    if (!city || !city.trim()) {
      throw new Error("City name is required");
    }

    return this.fetchFromApi<ForecastResponse>(
      `/forecast/${encodeURIComponent(city.trim())}`,
      options
    );
  }

  async getForecastByCoords(
    lat: number,
    lon: number,
    options: RequestOptions = {}
  ): Promise<ForecastResponse> {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (lon < -180 || lon > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    return this.fetchFromApi<ForecastResponse>(
      `/forecast-coords?lat=${lat}&lon=${lon}`,
      options
    );
  }

  async getAlerts(
    city: string,
    options: RequestOptions = {}
  ): Promise<AlertsResponse> {
    if (!city || !city.trim()) {
      throw new Error("City name is required");
    }

    return this.fetchFromApi<AlertsResponse>(
      `/alerts/${encodeURIComponent(city.trim())}`,
      options
    );
  }

  async getAlertsByCoords(
    lat: number,
    lon: number,
    options: RequestOptions = {}
  ): Promise<AlertsResponse> {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (lon < -180 || lon > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    return this.fetchFromApi<AlertsResponse>(
      `/alerts-coords?lat=${lat}&lon=${lon}`,
      options
    );
  }

  async getWeatherStats(city: string): Promise<any> {
    if (!city || !city.trim()) {
      throw new Error("City name is required");
    }

    return this.fetchFromApi<any>(`/stats/${encodeURIComponent(city.trim())}`);
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetchFromApi<{ status: string; timestamp: string }>("/health");
  }

  async searchLocation(query: string): Promise<any[]> {
    try {
      const weather = await this.getCurrentWeather(query);
      if (weather.success && weather.data) {
        return [
          {
            name: weather.data.name,
            lat: weather.data.coord?.lat,
            lon: weather.data.coord?.lon,
            country: "Unknown",
          },
        ];
      }
      return [];
    } catch (error) {
      console.warn("Location search failed:", error);
      return [];
    }
  }

  async getMultipleCities(
    cities: string[],
    options: RequestOptions = {}
  ): Promise<
    Array<{ city: string; data: WeatherResponse | null; error?: string }>
  > {
    const results = await Promise.allSettled(
      cities.map((city) => this.getCurrentWeather(city, options))
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          city: cities[index],
          data: result.value,
        };
      } else {
        return {
          city: cities[index],
          data: null,
          error: result.reason?.message || "Unknown error",
        };
      }
    });
  }

  private cache = new Map<string, { data: any; expiry: number }>();

  async getCurrentWeatherCached(
    city: string,
    options: RequestOptions = {},
    cacheMinutes: number = 15
  ): Promise<WeatherResponse> {
    const cacheKey = `weather_${city}_${options.units || "metric"}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    const data = await this.getCurrentWeather(city, options);

    // Guardar en cache
    this.cache.set(cacheKey, {
      data,
      expiry: Date.now() + cacheMinutes * 60 * 1000,
    });

    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  setDefaultOptions(options: Partial<RequestOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  getDefaultOptions(): RequestOptions {
    return { ...this.defaultOptions };
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  async getApiInfo(): Promise<any> {
    try {
      return await this.fetchFromApi<any>("/info");
    } catch (error) {
      console.warn("API info not available:", error);
      return {
        baseUrl: API_BASE_URL,
        defaultOptions: this.defaultOptions,
        cacheSize: this.cache.size,
      };
    }
  }
}

// Exportar instancia única con configuración
export const weatherService = new WeatherService();

// Configurar opciones por defecto basadas en el entorno
if (import.meta.env.DEV) {
  weatherService.setDefaultOptions({
    timeout: 15000, // Más tiempo en desarrollo
    retries: 1,
  });
}

export default weatherService;
