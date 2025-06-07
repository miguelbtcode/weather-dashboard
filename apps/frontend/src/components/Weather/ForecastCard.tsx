import React from "react";
import { HourlyForecast } from "./HourlyForecast";

export const ForecastCard: React.FC = () => {
  return (
    <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
      <HourlyForecast />
    </div>
  );
};
