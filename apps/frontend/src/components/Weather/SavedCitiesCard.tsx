import React from "react";
import { OtherCities } from "./OtherCities";

export const SavedCitiesCard: React.FC = () => {
  return (
    <div className="glass rounded-3xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
      <OtherCities />
    </div>
  );
};
