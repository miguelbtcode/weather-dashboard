import React from "react";
import { WeatherLoading } from "./LoadingStates";

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass rounded-3xl p-8 border border-white/20">
        <WeatherLoading message="Updating weather data..." />
      </div>
    </div>
  );
};
