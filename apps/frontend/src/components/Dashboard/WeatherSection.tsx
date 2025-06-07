import React from "react";
import { CurrentWeatherCard } from "../Weather/CurrentWeatherCard";
import { ForecastCard } from "../Weather/ForecastCard";
import { WeatherHighlightsCard } from "../Weather/WeatherHighlightsCard";
import { SavedCitiesCard } from "../Weather/SavedCitiesCard";
import { WeatherInsightsCard } from "../Weather/WeatherInsightsCard";
import { QuickStatsCard } from "../Weather/QuickStatsCard";
import { useWeather } from "../../context/WeatherContext";
import { ForecastSection } from "./ForecastSection";

export const WeatherSection: React.FC = () => {
  const { currentWeather, viewMode } = useWeather();

  if (!currentWeather) return null;

  return (
    <div className="space-y-8">
      {/* Current Weather Hero */}
      <section className="animate-slide-up-delay-2">
        <CurrentWeatherCard />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Primary Content */}
        <div className="xl:col-span-3 space-y-8">
          <section className="animate-slide-up-delay-3">
            <ForecastCard />
          </section>

          {/* Extended Forecast Section */}
          {viewMode === "week" && (
            <section className="animate-slide-up-delay-4">
              <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                <ForecastSection />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="animate-slide-right">
            <WeatherHighlightsCard />
          </section>

          <section className="animate-slide-up-delay-3">
            <SavedCitiesCard />
          </section>

          <section className="animate-fade-scale">
            <WeatherInsightsCard />
          </section>

          <section className="animate-fade-scale">
            <QuickStatsCard />
          </section>
        </div>
      </div>
    </div>
  );
};
