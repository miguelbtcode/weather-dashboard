import React, { useState } from "react";
import { BarChart3, Calendar, TrendingUp, Globe } from "lucide-react";
import { useWeather } from "../../../context/WeatherContext";
import { ForecastCard } from "../../Weather/ForecastCard";
import { ForecastSection } from "../ForecastSection";

const EnhancedForecastSection = ({ isExpanded }) => {
  const [forecastView, setForecastView] = useState("hourly");
  const { forecast, hourlyForecast } = useWeather();

  const views = [
    { id: "hourly", label: "Next 24 Hours", icon: BarChart3 },
    { id: "daily", label: "7-Day Forecast", icon: Calendar },
    { id: "extended", label: "14-Day Outlook", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 w-fit">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setForecastView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              forecastView === view.id
                ? "bg-white text-gray-800 shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
          >
            <view.icon size={16} />
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      {/* Forecast Content */}
      <div className="space-y-6">
        {forecastView === "hourly" && <ForecastCard />}
        {forecastView === "daily" && forecast && <ForecastSection />}
        {forecastView === "extended" && (
          <div className="glass rounded-3xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">
              Extended 14-Day Outlook
            </h4>
            <div className="text-center py-8">
              <Calendar className="text-white/50 mx-auto mb-4" size={48} />
              <p className="text-white/70">Extended forecast coming soon</p>
              <p className="text-white/50 text-sm mt-2">
                14-day weather trends and patterns
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Extended Information (only show when expanded) */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Forecast Charts */}
          <div className="glass rounded-3xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">
              Temperature Trend
            </h4>
            <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="text-white/50 mx-auto mb-4" size={48} />
                <p className="text-white/70">Interactive temperature chart</p>
                <p className="text-white/50 text-sm mt-2">
                  24-hour temperature and precipitation trend
                </p>
              </div>
            </div>
          </div>

          {/* Weather Radar */}
          <div className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">
                Weather Radar
              </h4>
              <button className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
                Animate
              </button>
            </div>
            <div className="h-80 bg-white/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Globe className="text-white/50 mx-auto mb-4" size={48} />
                <p className="text-white/70">Live weather radar</p>
                <p className="text-white/50 text-sm mt-2">
                  Precipitation and cloud movement
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedForecastSection;
