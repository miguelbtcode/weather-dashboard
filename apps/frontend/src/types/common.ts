export type TemperatureUnit = "metric" | "imperial";
export type ViewMode = "today" | "week";
export type WeatherCondition =
  | "clear"
  | "clouds"
  | "rain"
  | "storm"
  | "snow"
  | "mist";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface Location {
  lat: number;
  lon: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
}
