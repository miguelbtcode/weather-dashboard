import React from "react";
import { Droplets, Sun, Wind } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export const WeatherHighlights: React.FC = () => {
  const { currentWeather } = useWeather();

  if (!currentWeather) return null;

  const { humidity, uvi = 5, wind_speed, rain } = currentWeather;
  const chanceOfRain = rain ? rain["1h"] : 0;

  return (
    <div className="bg-secondary-800 rounded-2xl p-6 animate-fade-in">
      <h3 className="text-xl font-medium mb-4">Today Highlight</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary-700/30 p-4 rounded-xl">
          <h4 className="text-secondary-400 mb-2">Chance of Rain</h4>
          <div className="flex items-center justify-between">
            <Droplets className="text-rainy" size={36} />
            <span className="text-3xl font-medium">
              {chanceOfRain ? `${Math.round(chanceOfRain * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        <div className="bg-secondary-700/30 p-4 rounded-xl">
          <h4 className="text-secondary-400 mb-2">UV Index</h4>
          <div className="flex items-center justify-between">
            <Sun className="text-sunny" size={36} />
            <div>
              <span className="text-3xl font-medium">UV</span>
              <span className="block text-right text-sm text-secondary-400">
                {uvi < 3
                  ? "Low"
                  : uvi < 6
                  ? "Moderate"
                  : uvi < 8
                  ? "High"
                  : "Very High"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary-700/30 p-4 rounded-xl">
          <h4 className="text-secondary-400 mb-2">Wind Status</h4>
          <div className="flex items-center justify-between">
            <Wind className="text-primary-400" size={36} />
            <div>
              <span className="text-3xl font-medium">
                {Math.round(wind_speed)}
              </span>
              <span className="ml-1">km/h</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary-700/30 p-4 rounded-xl">
          <h4 className="text-secondary-400 mb-2">Humidity</h4>
          <div className="flex items-center justify-between">
            <Droplets className="text-primary-400" size={36} />
            <span className="text-3xl font-medium">{humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
