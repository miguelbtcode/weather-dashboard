import { useState } from "react";
import { useWeather } from "../../../context/WeatherContext";
import SectionControls from "./SectionControls";
import WeatherAlertsWidget from "./WeatherAlertsWidget";
import SmartLayoutGrid from "./SmartLayoutGrid";
import HistoricalComparison from "./HistoricalComparison";
import AirQualitySection from "./AirQualitySection";
import { CurrentWeatherCard } from "../../Weather/CurrentWeatherCard";
import { WeatherHighlightsCard } from "../../Weather/WeatherHighlightsCard";
import { SavedCitiesCard } from "../../Weather/SavedCitiesCard";
import { WeatherInsightsCard } from "../../Weather/WeatherInsightsCard";
import { QuickStatsCard } from "../../Weather/QuickStatsCard";
import EnhancedForecastSection from "./EnhancedForecastSection";
import { BarChart3 } from "lucide-react";

export const EnhancedWeatherSection = () => {
  const { currentWeather } = useWeather();
  const [sectionsExpanded, setSectionsExpanded] = useState({
    overview: false,
    forecast: false,
    analytics: false,
  });

  const [preferences, setPreferences] = useState({
    showAlerts: true,
    showMetrics: true,
    autoRefresh: true,
    compactMode: false,
  });

  const toggleSection = (section) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleShare = (section) => {
    // Implement share functionality
    console.log(`Sharing ${section} data`);
  };

  const handleSettings = (section) => {
    // Implement settings modal
    console.log(`Opening settings for ${section}`);
  };

  if (!currentWeather) return null;

  return (
    <div className="space-y-8">
      {/* Weather Alerts */}
      {preferences.showAlerts && <WeatherAlertsWidget />}

      {/* Current Weather Overview */}
      <section className="animate-slide-up-delay-1">
        <SectionControls
          title="Current Overview"
          isExpanded={sectionsExpanded.overview}
          onToggle={() => toggleSection("overview")}
          onSettings={() => handleSettings("overview")}
          onShare={() => handleShare("overview")}
        />

        <SmartLayoutGrid isExpanded={sectionsExpanded.overview}>
          {{
            main: (
              <div className="space-y-8">
                <CurrentWeatherCard />
                {/* Enhanced Forecast Section */}
                <section className="animate-slide-up-delay-2">
                  <SectionControls
                    title="Weather Forecast"
                    isExpanded={sectionsExpanded.forecast}
                    onToggle={() => toggleSection("forecast")}
                    onSettings={() => handleSettings("forecast")}
                    onShare={() => handleShare("forecast")}
                  />

                  <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                    <EnhancedForecastSection
                      isExpanded={sectionsExpanded.forecast}
                    />
                  </div>
                </section>

                {/* Analytics Section */}
                <section className="animate-slide-up-delay-3">
                  <SectionControls
                    title="Weather Analytics"
                    isExpanded={sectionsExpanded.analytics}
                    onToggle={() => toggleSection("analytics")}
                    onSettings={() => handleSettings("analytics")}
                    onShare={() => handleShare("analytics")}
                  />

                  {sectionsExpanded.analytics && (
                    <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                      <div className="text-center py-12">
                        <BarChart3
                          className="text-white/50 mx-auto mb-4"
                          size={64}
                        />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Advanced Weather Analytics
                        </h3>
                        <p className="text-white/70 mb-6">
                          Detailed weather patterns, historical trends, and
                          predictive insights
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white/5 rounded-xl p-6">
                            <h4 className="text-white font-medium mb-2">
                              Trend Analysis
                            </h4>
                            <p className="text-white/60 text-sm">
                              7-day temperature and precipitation patterns
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-6">
                            <h4 className="text-white font-medium mb-2">
                              Seasonal Comparison
                            </h4>
                            <p className="text-white/60 text-sm">
                              Compare current conditions with seasonal averages
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-6">
                            <h4 className="text-white font-medium mb-2">
                              Climate Insights
                            </h4>
                            <p className="text-white/60 text-sm">
                              Long-term climate patterns and projections
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            ),
            sidebar: (
              <>
                <WeatherHighlightsCard />
                <SavedCitiesCard />
                <WeatherInsightsCard />
                <QuickStatsCard />
              </>
            ),
            extended: sectionsExpanded.overview && (
              <div className="space-y-8">
                <AirQualitySection />
                <HistoricalComparison />
              </div>
            ),
          }}
        </SmartLayoutGrid>
      </section>
    </div>
  );
};
