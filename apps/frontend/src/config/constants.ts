export const APP_CONFIG = {
  name: "SkySense",
  version: "1.0.0",
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:7105/api",
    timeout: 10000,
    retries: 2,
  },
  cache: {
    defaultTtl: 15 * 60 * 1000, // 15 minutes
    forecastTtl: 60 * 60 * 1000, // 1 hour
  },
  ui: {
    animations: {
      duration: 300,
      stagger: 100,
    },
    maxSavedCities: 6,
    forecastDays: 7,
    hourlyForecastHours: 24,
  },
} as const;

export const WEATHER_CONSTANTS = {
  units: {
    metric: { temp: "°C", speed: "km/h", pressure: "hPa" },
    imperial: { temp: "°F", speed: "mph", pressure: "inHg" },
  },
  alerts: {
    thresholds: {
      metric: { high: 35, low: 0, wind: 50 },
      imperial: { high: 95, low: 32, wind: 31 },
    },
  },
} as const;
