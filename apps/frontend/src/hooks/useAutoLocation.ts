import { useEffect, useState } from "react";
import { useGeolocation } from "./useGeolocation";
import { useWeather } from "../context/WeatherContext";

export const useAutoLocation = () => {
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const { getCurrentLocation } = useGeolocation();
  const { searchByCoords, currentWeather } = useWeather();

  useEffect(() => {
    const initializeLocation = async () => {
      // Only check once and if no weather data is loaded
      if (hasCheckedLocation || currentWeather) return;

      try {
        // Check if user has previously allowed location
        const hasPermission = localStorage.getItem("locationPermissionGranted");

        if (hasPermission === "true") {
          const location = await getCurrentLocation();
          if (location) {
            await searchByCoords(location.lat, location.lon);
            console.log("Auto-location successful:", location);
          }
        }
      } catch (error) {
        console.log("Auto-location failed:", error);
        // Silent fail - user can manually search
      } finally {
        setHasCheckedLocation(true);
      }
    };

    // Small delay to let the app render first
    const timer = setTimeout(initializeLocation, 1000);
    return () => clearTimeout(timer);
  }, [hasCheckedLocation, currentWeather, getCurrentLocation, searchByCoords]);

  return { hasCheckedLocation };
};
