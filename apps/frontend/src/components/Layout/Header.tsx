import React from "react";
import { Zap, Sparkles } from "lucide-react";
import { SearchBar } from "../Weather/SearchBar";
import { useWeather } from "../../context/WeatherContext";
import { APP_CONFIG } from "../../config/constants";

export const Header: React.FC = () => {
  const { lastUpdated } = useWeather();

  return (
    <header className="mb-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl weather-glow">
              <Zap className="text-white" size={32} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="text-white" size={12} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </h1>
            <p className="text-white/80 text-lg">
              Real-time weather intelligence
            </p>
            {lastUpdated && (
              <p className="text-white/60 text-sm">
                Last updated:{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>

        <div className="lg:max-w-md lg:w-full">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};
