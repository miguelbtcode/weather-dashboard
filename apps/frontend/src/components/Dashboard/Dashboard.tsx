import React from "react";
import { useWeather } from "../../context/WeatherContext";
import { WelcomeSection } from "./WelcomeSection";
import { WeatherSection } from "./WeatherSection";
import { AutoLocationPrompt } from "../Weather/AutoLocationPrompt";
import { LoadingOverlay } from "../UI/LoadingOverlay";
import { ErrorToast } from "../UI/ErrorToast";
import { EnhancedWeatherSection } from "./EnhancedWeatherSection/EnhancedWeatherSection";

export const Dashboard: React.FC = () => {
  const { currentWeather, loading, error, clearError } = useWeather();

  return (
    <>
      <AutoLocationPrompt />

      {currentWeather ? <EnhancedWeatherSection /> : <WelcomeSection />}

      {loading && currentWeather && <LoadingOverlay />}
      {error && currentWeather && (
        <ErrorToast message={error} onClose={clearError} />
      )}
    </>
  );
};
