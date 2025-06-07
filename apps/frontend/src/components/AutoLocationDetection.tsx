// src/components/AutoLocationDetection.tsx
import React, { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useWeather } from "../context/WeatherContext";

export const AutoLocationDetection: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getCurrentLocation } = useGeolocation();
  const { searchByCoords, currentWeather } = useWeather();

  useEffect(() => {
    // Check session storage for dismissal
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

        // Show success message briefly
        const successDiv = document.createElement("div");
        successDiv.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        successDiv.textContent = "📍 Location detected successfully!";
        document.body.appendChild(successDiv);

        setTimeout(() => {
          if (document.body.contains(successDiv)) {
            document.body.removeChild(successDiv);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Location error:", error);

      // Show error message
      const errorDiv = document.createElement("div");
      errorDiv.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
      errorDiv.textContent = "❌ Could not access location";
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setIsProcessing(false);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("locationPromptDismissed", "true");
  };

  // Don't show if dismissed, has weather data, or user already granted permission
  if (isDismissed) return null;

  return (
    <div className="glass rounded-2xl p-6 mb-8 animate-slide-up shadow-weather">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Animated location icon */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center weather-pulse">
              <span className="text-2xl">📍</span>
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
            <div
              className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              🌍 Detect Your Location?
            </h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              Get instant weather updates for your current location. We'll show
              you personalized forecasts and alerts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAllowLocation}
                disabled={isProcessing}
                className="weather-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    <span>Allow Location</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="weather-button text-white/80 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10"
              >
                Maybe Later
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
              <div className="flex items-center space-x-1">
                <span>⚡</span>
                <span>Instant weather</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Precise forecasts</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔔</span>
                <span>Weather alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
