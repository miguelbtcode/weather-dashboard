import React, { useEffect } from "react";
import {
  RefreshCw,
  Clock,
  Thermometer,
  Eye,
  Wind,
  Droplets,
  Gauge,
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { useWeatherTheme, applyWeatherTheme } from "../../utils/weatherThemes";
import { useTemperature } from "../../utils/temperatureUtils";
import { getWeatherInsight } from "../../utils/weather";
import { Button } from "../UI/Button";
import { WeatherCard } from "./WeatherCard";
import { WeatherIcon } from "../UI/WeatherIcon";

export const CurrentWeatherCard: React.FC = () => {
  const {
    currentWeather,
    tempUnit,
    setTempUnit,
    lastUpdated,
    refreshWeather,
    loading,
  } = useWeather();

  if (!currentWeather) return null;

  const {
    temp,
    feels_like,
    humidity,
    weather,
    wind_speed,
    dt,
    temp_max,
    temp_min,
    pressure,
    visibility,
  } = currentWeather;

  const date = new Date(dt * 1000);
  const weatherCode = weather[0].icon;
  const { theme } = useWeatherTheme(weatherCode);

  const tempDisplay = useTemperature(temp, tempUnit);
  const feelsLikeDisplay = useTemperature(feels_like, tempUnit);
  const tempMaxDisplay = useTemperature(temp_max, tempUnit);
  const tempMinDisplay = useTemperature(temp_min, tempUnit);

  useEffect(() => {
    applyWeatherTheme(theme);
  }, [theme]);

  const formatVisibility = (visibility: number) => {
    const km = visibility / 1000;
    if (tempUnit === "imperial") {
      const miles = km * 0.621371;
      return `${miles.toFixed(1)} mi`;
    }
    return `${km.toFixed(1)} km`;
  };

  const formatPressure = (pressure: number) => {
    if (tempUnit === "imperial") {
      const inHg = pressure * 0.02953;
      return `${inHg.toFixed(2)} inHg`;
    }
    return `${pressure} hPa`;
  };

  return (
    <div
      className="relative rounded-3xl p-8 backdrop-blur-lg shadow-2xl transition-all duration-700 weather-glow overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.gradient
          .split(" ")
          .join(", ")})`,
        boxShadow: `0 25px 50px -12px ${theme.glowColor}`,
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: theme.accent }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white">{currentWeather.name}</span>
              <span className="text-white/70">•</span>
              <span className="text-white/70">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {lastUpdated && (
                <>
                  <span className="text-white/70">•</span>
                  <Clock size={12} className="text-white/70" />
                  <span className="text-white/70 text-xs">
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-4xl font-bold mt-4 text-white drop-shadow-lg">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </h2>
            <p className="text-white/80 text-lg">
              {date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={refreshWeather}
              loading={loading}
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              aria-label="Refresh weather data"
            />

            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setTempUnit("metric")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  tempUnit === "metric"
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit("imperial")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  tempUnit === "imperial"
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Main Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Temperature */}
          <div className="text-center lg:text-left">
            <div className="flex items-end justify-center lg:justify-start mb-4">
              <span className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl">
                {Math.round(tempDisplay.displayTemp)}
              </span>
              <span className="text-4xl text-white/80 mb-4">
                {tempDisplay.unitSymbol}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-medium text-white">
                {weather[0].main}
              </p>
              <p className="text-white/70 capitalize">
                {weather[0].description}
              </p>
              <p className="text-white/60">
                H: {Math.round(tempMaxDisplay.displayTemp)}° L:{" "}
                {Math.round(tempMinDisplay.displayTemp)}°
              </p>
            </div>
          </div>

          {/* Weather Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <WeatherIcon iconCode={weather[0].icon} size={120} />
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{
                  background: `radial-gradient(circle, ${theme.primary}, transparent 70%)`,
                }}
              />
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <WeatherCard
              title="Feels like"
              value={Math.round(feelsLikeDisplay.displayTemp)}
              unit="°"
              icon={Thermometer}
            />
            <WeatherCard
              title="Humidity"
              value={humidity}
              unit="%"
              icon={Droplets}
            />
            <WeatherCard
              title="Wind"
              value={Math.round(tempDisplay.convertSpeed(wind_speed))}
              unit={tempDisplay.speedUnit}
              icon={Wind}
            />
            <WeatherCard
              title="Pressure"
              value={formatPressure(pressure)}
              icon={Gauge}
            />
          </div>
        </div>

        {/* Extended Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye size={24} className="text-white/80 mr-3" />
                <span className="text-white text-lg">Visibility</span>
              </div>
              <span className="text-white text-xl font-semibold">
                {formatVisibility(visibility || 10000)}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <p className="text-white text-lg">
                {getWeatherInsight(
                  weather[0].main,
                  tempDisplay.displayTemp,
                  humidity,
                  tempUnit
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
