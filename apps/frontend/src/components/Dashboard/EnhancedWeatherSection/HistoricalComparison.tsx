import React from "react";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useWeather } from "../../../context/WeatherContext";

const HistoricalComparison = () => {
  const { currentWeather, tempUnit } = useWeather();

  if (!currentWeather) return null;

  const comparisons = [
    {
      metric: "Temperature",
      current: Math.round(currentWeather.temp),
      change: "+3",
      trend: "up",
      description: "Above average",
      icon: Thermometer,
      color: "text-red-400",
    },
    {
      metric: "Humidity",
      current: currentWeather.humidity,
      change: "-5",
      trend: "down",
      description: "Below average",
      icon: Droplets,
      color: "text-blue-400",
    },
    {
      metric: "Wind Speed",
      current: Math.round(currentWeather.wind_speed),
      change: "+2",
      trend: "up",
      description: "Above average",
      icon: Wind,
      color: "text-green-400",
    },
    {
      metric: "UV Index",
      current: currentWeather.uvi || 5,
      change: "0",
      trend: "stable",
      description: "Normal",
      icon: Sun,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <h4 className="text-lg font-semibold text-white mb-4">
        vs. Historical Average
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisons.map((comp, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <comp.icon className={comp.color} size={16} />
              {comp.trend === "up" ? (
                <TrendingUp className="text-red-400" size={16} />
              ) : comp.trend === "down" ? (
                <TrendingDown className="text-blue-400" size={16} />
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded-full" />
              )}
              <span
                className={`font-medium ${
                  comp.trend === "up"
                    ? "text-red-400"
                    : comp.trend === "down"
                    ? "text-blue-400"
                    : "text-white"
                }`}
              >
                {comp.change !== "0" ? comp.change : ""}
              </span>
            </div>
            <div className="text-white font-medium">{comp.metric}</div>
            <div className="text-white/70 text-sm">{comp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalComparison;
