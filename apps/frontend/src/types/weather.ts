export interface WeatherResponse {
  success: boolean;
  message: string;
  data: WeatherData | null;
  timestamp: string;
}

export interface WeatherData {
  name: string;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  coord: {
    lon: number;
    lat: number;
  };
  sys: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  visibility?: number;
  clouds?: {
    all: number;
  };
  rain?: {
    "1h": number;
    "3h": number;
  };
  snow?: {
    "1h": number;
    "3h": number;
  };
  timezone?: number;
}

// Respuesta del backend para pronóstico
export interface ForecastResponse {
  success: boolean;
  message: string;
  data: ForecastData | null;
  timestamp: string;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
      feels_like: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    pop: number; // Probability of precipitation
    visibility?: number;
    clouds?: {
      all: number;
    };
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
    population?: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Respuesta del backend para alertas
export interface AlertsResponse {
  success: boolean;
  message: string;
  data: WeatherAlert[] | null;
  timestamp: string;
}

export interface WeatherAlert {
  id: string;
  city: string;
  type:
    | "High Temperature"
    | "Low Temperature"
    | "Strong Wind"
    | "Severe Weather"
    | "Precipitation"
    | "Visibility";
  message: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  value: number;
  threshold: number;
  expiresAt?: string;
  recommendations?: string[];
}

// Types para el contexto (lo que ya usamos)
export interface CurrentWeather {
  name: string;
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  uvi?: number;
  wind_speed: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  temp_max: number;
  temp_min: number;
  pressure: number;
  visibility: number;
  sunrise?: number;
  sunset?: number;
  coord?: {
    lat: number;
    lon: number;
  };
  timezone?: number;
  cloudiness?: number;
  rain?: number;
  snow?: number;
}

export interface ForecastItem {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
  humidity?: number;
  pressure?: number;
  wind_speed?: number;
  clouds?: number;
}

export interface HourlyForecastItem {
  dt: number;
  temp: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation (0-1)
  humidity?: number;
  pressure?: number;
  wind_speed?: number;
  feels_like?: number;
}

export interface SavedCity {
  name: string;
  country: string;
  temp: number;
  weather: Array<{ icon: string }>;
}
