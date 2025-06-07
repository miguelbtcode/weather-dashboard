import React, { useEffect, useState } from "react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useWeather } from "../../context/WeatherContext";
import { Button } from "../UI/Button";
import { X } from "lucide-react";

export const AutoLocationPrompt: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getCurrentLocation } = useGeolocation();
  const { searchByCoords, currentWeather } = useWeather();

  useEffect(() => {
    const dismissed =
      sessionStorage.getItem("locationPromptDismissed") === "true";
    const permissionGranted =
      localStorage.getItem("locationPermissionGranted") === "true";
    setIsDismissed(dismissed || permissionGranted || !!currentWeather);
  }, [currentWeather]);

  const handleAllowLocation = async () => {
    setIsProcessing(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        await searchByCoords(location.lat, location.lon);
        localStorage.setItem("locationPermissionGranted", "true");
        setIsDismissed(true);
      }
    } catch (error) {
      console.error("Location error:", error);
    } finally {
      setIsProcessing(false);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("locationPromptDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="glass rounded-2xl p-6 mb-8 animate-slide-up shadow-weather">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center weather-pulse">
              <span className="text-2xl">📍</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              🌍 Detect Your Location?
            </h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              Get instant weather updates for your current location with
              personalized forecasts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAllowLocation}
                loading={isProcessing}
                variant="primary"
                size="md"
              >
                {isProcessing ? "Detecting..." : "📍 Allow Location"}
              </Button>

              <Button onClick={handleDismiss} variant="ghost" size="md">
                Maybe Later
              </Button>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
          aria-label="Dismiss location prompt"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
