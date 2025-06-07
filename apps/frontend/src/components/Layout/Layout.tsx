import React from "react";
import { Header } from "./Header";
import { AnimatedBackground, WeatherGlow } from "../Weather/AnimatedBackground";
import { useWeather } from "../../context/WeatherContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentWeather } = useWeather();
  const weatherCode = currentWeather?.weather[0]?.icon || "01d";

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground
        weatherCode={weatherCode}
        intensity={currentWeather ? "medium" : "light"}
      />
      <WeatherGlow weatherCode={weatherCode} />

      <div className="relative z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Header />
          {children}
        </div>
      </div>
    </main>
  );
};
