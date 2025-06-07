import React from "react";
import { LucideIcon } from "lucide-react";

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
  onClick?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  description,
  trend,
  className = "",
  onClick,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-red-400";
      case "down":
        return "text-blue-400";
      default:
        return "text-white/60";
    }
  };

  return (
    <div
      className={`glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 weather-card ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon size={24} className="text-white/80" />
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        {trend && (
          <div className={`text-xs ${getTrendColor()}`}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-white/70 text-sm">{unit}</span>}
      </div>

      {description && (
        <p className="text-white/60 text-xs mt-2">{description}</p>
      )}
    </div>
  );
};
