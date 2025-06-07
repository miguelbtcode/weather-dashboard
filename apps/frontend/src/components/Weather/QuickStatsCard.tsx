import React from "react";
import { useWeather } from "../../context/WeatherContext";

export const QuickStatsCard: React.FC = () => {
  const { currentWeather, forecast } = useWeather();

  if (!currentWeather || !forecast.length) return null;

  const stats = [
    {
      label: "Today's Range",
      value: `${Math.round(currentWeather.temp_min)}° - ${Math.round(
        currentWeather.temp_max
      )}°`,
    },
    {
      label: "Humidity",
      value: `${currentWeather.humidity}%`,
    },
    {
      label: "UV Index",
      value: currentWeather.uvi || "N/A",
    },
    {
      label: "Rainy Days",
      value: `${forecast.filter((day) => day.pop > 0.3).length}/${
        forecast.length
      }`,
    },
  ];

  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-white/70">{stat.label}</span>
            <span className="text-white font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
