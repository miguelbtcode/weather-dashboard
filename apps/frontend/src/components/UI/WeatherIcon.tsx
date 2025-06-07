// src/components/ui/WeatherIcon.tsx
import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  CloudDrizzle,
} from "lucide-react";

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode,
  size = 24,
  className = "",
}) => {
  const getIcon = () => {
    // Mapeo basado en códigos de OpenWeatherMap
    if (iconCode.includes("01"))
      return <Sun className={`text-sunny ${className}`} size={size} />;
    if (iconCode.includes("02"))
      return (
        <CloudDrizzle className={`text-cloudy ${className}`} size={size} />
      );
    if (iconCode.includes("03") || iconCode.includes("04"))
      return <Cloud className={`text-cloudy ${className}`} size={size} />;
    if (iconCode.includes("09"))
      return <CloudRain className={`text-rainy ${className}`} size={size} />;
    if (iconCode.includes("10"))
      return <CloudRain className={`text-rainy ${className}`} size={size} />;
    if (iconCode.includes("11"))
      return (
        <CloudLightning className={`text-stormy ${className}`} size={size} />
      );
    if (iconCode.includes("13"))
      return <CloudSnow className={`text-snowy ${className}`} size={size} />;
    if (iconCode.includes("50"))
      return <Wind className={`text-cloudy ${className}`} size={size} />;

    // Default
    return <Sun className={`text-sunny ${className}`} size={size} />;
  };

  return getIcon();
};
