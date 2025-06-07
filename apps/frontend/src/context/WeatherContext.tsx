// src/context/WeatherContext.tsx (Versión mejorada)

import React, { createContext, useContext, useState, useEffect } from "react";
import weatherService from "../services/weatherService";
import { TemperatureUnit } from "../utils/temperatureUtils";
import {
  CurrentWeather,
  ForecastItem,
  HourlyForecastItem,
  SavedCity,
} from "../types/weather";

type ViewMode = "today" | "week";

interface WeatherContextType {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  hourlyForecast: HourlyForecastItem[];
  savedCities: SavedCity[];
  loading: boolean;
  error: string | null;
  tempUnit: TemperatureUnit;
  viewMode: ViewMode;
  lastUpdated: Date | null;
  searchCity: (city: string) => Promise<void>;
  searchByCoords: (lat: number, lon: number) => Promise<void>;
  switchToCity: (city: string) => Promise<void>;
  setTempUnit: (unit: TemperatureUnit) => void;
  setViewMode: (mode: ViewMode) => void;
  refreshWeather: () => Promise<void>;
  clearError: () => void;
  removeSavedCity: (cityName: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>(
    []
  );
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnitState] = useState<TemperatureUnit>("metric");
  const [viewMode, setViewModeState] = useState<ViewMode>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    city: string;
    coords?: { lat: number; lon: number };
  } | null>(null);

  // Persistir configuraciones en localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem(
      "temperatureUnit"
    ) as TemperatureUnit;
    const savedViewMode = localStorage.getItem("viewMode") as ViewMode;
    const savedCitiesData = localStorage.getItem("savedCities");

    if (savedUnit && (savedUnit === "metric" || savedUnit === "imperial")) {
      setTempUnitState(savedUnit);
    }

    if (
      savedViewMode &&
      (savedViewMode === "today" || savedViewMode === "week")
    ) {
      setViewModeState(savedViewMode);
    }

    if (savedCitiesData) {
      try {
        const cities = JSON.parse(savedCitiesData);
        setSavedCities(cities);
      } catch (e) {
        console.error("Error loading saved cities:", e);
      }
    }
  }, []);

  // Guardar configuraciones
  const setTempUnit = (unit: TemperatureUnit) => {
    setTempUnitState(unit);
    localStorage.setItem("temperatureUnit", unit);
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem("viewMode", mode);
  };

  // Función para transformar respuesta del backend a formato del frontend
  const transformWeatherData = (backendData: any): CurrentWeather => {
    return {
      name: backendData.name,
      dt: backendData.dt,
      temp: backendData.main.temp,
      feels_like: backendData.main.feels_like,
      humidity: backendData.main.humidity,
      wind_speed: backendData.wind.speed,
      weather: backendData.weather,
      temp_max: backendData.main.temp_max,
      temp_min: backendData.main.temp_min,
      uvi: 5, // Valor por defecto
      pressure: backendData.main.pressure,
      visibility: backendData.visibility || 10000,
    };
  };

  const transformForecastData = (backendData: any[]): ForecastItem[] => {
    // Agrupar por día
    const dailyData: { [key: string]: any[] } = {};

    backendData.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    return Object.entries(dailyData)
      .slice(0, 7) // 7 días para la vista semanal
      .map(([date, items]) => {
        // Calcular min/max del día
        const temps = items.map((item) => item.main.temp);
        const tempMin = Math.min(...temps);
        const tempMax = Math.max(...temps);

        // Usar el pronóstico del mediodía (12:00) o el más cercano
        const noonForecast =
          items.find((item) => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
          }) || items[Math.floor(items.length / 2)];

        return {
          dt: noonForecast.dt,
          temp: {
            min: tempMin,
            max: tempMax,
          },
          weather: noonForecast.weather,
          pop: noonForecast.pop || 0,
        };
      });
  };

  const transformHourlyData = (backendData: any[]): HourlyForecastItem[] => {
    return backendData.slice(0, 24).map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather,
      pop: item.pop || 0,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      wind_speed: item.wind?.speed,
      feels_like: item.main.feels_like,
    }));
  };

  const addToSavedCities = (weather: CurrentWeather) => {
    const cityExists = savedCities.some(
      (c) => c.name.toLowerCase() === weather.name.toLowerCase()
    );

    if (!cityExists) {
      const newCity: SavedCity = {
        name: weather.name,
        country: "XX",
        temp: Math.round(weather.temp),
        weather: weather.weather,
      };

      const updatedCities = [newCity, ...savedCities].slice(0, 6); // Máximo 6 ciudades
      setSavedCities(updatedCities);
      localStorage.setItem("savedCities", JSON.stringify(updatedCities));
    }
  };

  const removeSavedCity = (cityName: string) => {
    const updatedCities = savedCities.filter(
      (city) => city.name.toLowerCase() !== cityName.toLowerCase()
    );
    setSavedCities(updatedCities);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  };

  const searchCity = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Obtener clima actual
      const weatherResponse = await weatherService.getCurrentWeather(city);

      if (!weatherResponse.success || !weatherResponse.data) {
        throw new Error(
          weatherResponse.message || "No se pudo obtener el clima"
        );
      }

      const transformedWeather = transformWeatherData(weatherResponse.data);
      setCurrentWeather(transformedWeather);
      setCurrentLocation({ city, coords: undefined });

      // Obtener pronóstico
      try {
        const forecastResponse = await weatherService.getForecast(city);
        if (forecastResponse.success && forecastResponse.data) {
          const transformedForecast = transformForecastData(
            forecastResponse.data.list
          );
          const transformedHourly = transformHourlyData(
            forecastResponse.data.list
          );

          setForecast(transformedForecast);
          setHourlyForecast(transformedHourly);
        }
      } catch (forecastError) {
        console.warn("No se pudo obtener el pronóstico:", forecastError);
      }

      // Agregar a ciudades guardadas
      addToSavedCities(transformedWeather);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error searching city:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener clima actual por coordenadas
      const weatherResponse = await weatherService.getCurrentWeatherByCoords(
        lat,
        lon
      );

      if (!weatherResponse.success || !weatherResponse.data) {
        throw new Error(
          weatherResponse.message ||
            "No se pudo obtener el clima para esta ubicación"
        );
      }

      const transformedWeather = transformWeatherData(weatherResponse.data);
      setCurrentWeather(transformedWeather);
      setCurrentLocation({
        city: transformedWeather.name,
        coords: { lat, lon },
      });

      // Obtener pronóstico por coordenadas
      try {
        const forecastResponse = await weatherService.getForecastByCoords(
          lat,
          lon
        );
        if (forecastResponse.success && forecastResponse.data) {
          const transformedForecast = transformForecastData(
            forecastResponse.data.list
          );
          const transformedHourly = transformHourlyData(
            forecastResponse.data.list
          );

          setForecast(transformedForecast);
          setHourlyForecast(transformedHourly);
        }
      } catch (forecastError) {
        console.warn("No se pudo obtener el pronóstico:", forecastError);
      }

      // Agregar a ciudades guardadas
      addToSavedCities(transformedWeather);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error obteniendo clima por ubicación";
      setError(errorMessage);
      console.error("Error searching by coords:", err);
    } finally {
      setLoading(false);
    }
  };

  const switchToCity = async (city: string) => {
    await searchCity(city);
  };

  const refreshWeather = async () => {
    if (!currentLocation) return;

    if (currentLocation.coords) {
      await searchByCoords(
        currentLocation.coords.lat,
        currentLocation.coords.lon
      );
    } else {
      await searchCity(currentLocation.city);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        hourlyForecast,
        savedCities,
        loading,
        error,
        tempUnit,
        viewMode,
        lastUpdated,
        searchCity,
        searchByCoords,
        switchToCity,
        setTempUnit,
        setViewMode,
        refreshWeather,
        clearError,
        removeSavedCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
