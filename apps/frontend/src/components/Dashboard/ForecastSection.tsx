// src/components/ForecastSection.tsx (Versión mejorada)

import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { useTemperature } from "../../utils/temperatureUtils";

export const ForecastSection: React.FC = () => {
  const { forecast, tempUnit } = useWeather();

  if (!forecast || forecast.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <Cloud size={48} className="mx-auto mb-4 text-white/50" />
        <h3 className="text-xl font-medium mb-2 text-white">
          No Forecast Available
        </h3>
        <p className="text-white/70">
          Forecast data will appear here once you search for a location.
        </p>
      </div>
    );
  }

  const getWeatherIcon = (iconCode: string, size = 32) => {
    const iconClass = "transition-all duration-300 drop-shadow-sm";

    if (iconCode.includes("01"))
      return <Sun className={`text-sunny ${iconClass}`} size={size} />;
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return <Cloud className={`text-cloudy ${iconClass}`} size={size} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className={`text-rainy ${iconClass}`} size={size} />;
    if (iconCode.includes("11"))
      return (
        <CloudLightning className={`text-stormy ${iconClass}`} size={size} />
      );
    if (iconCode.includes("13"))
      return <CloudSnow className={`text-snowy ${iconClass}`} size={size} />;
    if (iconCode.includes("50"))
      return <Wind className={`text-cloudy ${iconClass}`} size={size} />;

    return <Sun className={`text-sunny ${iconClass}`} size={size} />;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const getTempTrend = (currentIndex: number) => {
    if (currentIndex === 0) return null;

    const currentMax = forecast[currentIndex].temp.max;
    const previousMax = forecast[currentIndex - 1].temp.max;

    if (currentMax > previousMax + 2) {
      return <TrendingUp size={16} className="text-red-400" />;
    } else if (currentMax < previousMax - 2) {
      return <TrendingDown size={16} className="text-blue-400" />;
    }
    return null;
  };

  const getConditionDescription = (main: string) => {
    const descriptions = {
      Clear: "Sunny skies",
      Clouds: "Partly cloudy",
      Rain: "Rainy conditions",
      Snow: "Snow expected",
      Thunderstorm: "Storms possible",
      Drizzle: "Light rain",
      Mist: "Misty conditions",
      Fog: "Foggy weather",
    };
    return descriptions[main as keyof typeof descriptions] || main;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Extended Forecast</h3>
        <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
          {forecast.length} days
        </div>
      </div>

      {/* Forecast cards */}
      <div className="space-y-4">
        {forecast.map((day, index) => {
          const tempMaxDisplay = useTemperature(day.temp.max, tempUnit);
          const tempMinDisplay = useTemperature(day.temp.min, tempUnit);
          const tempTrend = getTempTrend(index);
          const isToday = index === 0;

          return (
            <div
              key={index}
              className={`glass rounded-xl p-4 transition-all duration-300 weather-card hover:scale-[1.02] ${
                isToday
                  ? "ring-2 ring-blue-400/50 bg-white/15"
                  : "hover:bg-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Date and condition */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4
                      className={`font-medium ${
                        isToday ? "text-blue-200" : "text-white"
                      }`}
                    >
                      {formatDate(day.dt)}
                    </h4>
                    {isToday && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                    {tempTrend}
                  </div>
                  <p className="text-white/80 text-sm mt-1 capitalize">
                    {getConditionDescription(day.weather[0].main)}
                  </p>
                  <p className="text-white/60 text-xs mt-1 capitalize">
                    {day.weather[0].description}
                  </p>
                </div>

                {/* Weather icon */}
                <div className="flex items-center mx-6">
                  <div className="relative">
                    {getWeatherIcon(day.weather[0].icon, 36)}
                    {isToday && (
                      <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Precipitation probability */}
                {day.pop > 0 && (
                  <div className="flex items-center text-blue-300 text-sm mr-6">
                    <Droplets size={16} className="mr-1" />
                    <span>{Math.round(day.pop * 100)}%</span>
                  </div>
                )}

                {/* Temperature range */}
                <div className="flex items-center space-x-4 text-right">
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">
                      {Math.round(tempMaxDisplay.displayTemp)}°
                    </div>
                    <div className="text-white/60 text-sm">High</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 text-lg">
                      {Math.round(tempMinDisplay.displayTemp)}°
                    </div>
                    <div className="text-white/60 text-sm">Low</div>
                  </div>
                </div>
              </div>

              {/* Temperature bar visualization */}
              <div className="mt-4">
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                    style={{
                      width: "100%",
                      opacity: 0.6,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Low: {Math.round(tempMinDisplay.displayTemp)}°</span>
                  <span>High: {Math.round(tempMaxDisplay.displayTemp)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly summary */}
      <div className="mt-6 p-4 glass rounded-xl">
        <h4 className="text-white font-medium mb-3">Weekly Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/70">Average High: </span>
            <span className="text-white font-medium">
              {Math.round(
                forecast.reduce((sum, day) => {
                  const tempDisplay = useTemperature(day.temp.max, tempUnit);
                  return sum + tempDisplay.displayTemp;
                }, 0) / forecast.length
              )}
              °
            </span>
          </div>
          <div>
            <span className="text-white/70">Rainy Days: </span>
            <span className="text-white font-medium">
              {forecast.filter((day) => day.pop > 0.3).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
