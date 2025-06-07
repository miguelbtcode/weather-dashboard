import React from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export const OtherCities: React.FC = () => {
  const { savedCities, switchToCity } = useWeather();

  const getWeatherIcon = (iconCode: string, size = 36) => {
    if (iconCode.includes("01"))
      return <Sun className="text-sunny" size={size} />;
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return <Cloud className="text-cloudy" size={size} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className="text-rainy" size={size} />;
    if (iconCode.includes("11"))
      return <CloudLightning className="text-stormy" size={size} />;
    if (iconCode.includes("13"))
      return <CloudSnow className="text-snowy" size={size} />;
    if (iconCode.includes("50"))
      return <Wind className="text-cloudy" size={size} />;

    return <Sun className="text-sunny" size={size} />;
  };

  if (!savedCities || savedCities.length === 0) {
    return (
      <div className="bg-secondary-800 rounded-2xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Other Cities</h3>
          <button className="text-xs text-secondary-400 hover:text-white">
            Show All
          </button>
        </div>
        <div className="text-center py-8 text-secondary-400">
          <p>Search for cities to save them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-800 rounded-2xl p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Other Cities</h3>
        <button className="text-xs text-secondary-400 hover:text-white">
          Show All
        </button>
      </div>

      <div className="space-y-4">
        {savedCities.map((city, index) => (
          <div
            key={index}
            className="bg-secondary-700/30 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-secondary-700/50 transition-colors"
            onClick={() => switchToCity(city.name)}
          >
            <div>
              <h4 className="font-medium">{city.name}</h4>
              <p className="text-secondary-400 text-sm">{city.country}</p>
            </div>

            <div className="flex items-center">
              {getWeatherIcon(city.weather[0].icon, 28)}
              <span className="ml-2 text-2xl font-medium">
                {Math.round(city.temp)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
