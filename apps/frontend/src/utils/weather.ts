import { WeatherCondition } from "../types/common";

export const getWeatherCondition = (iconCode: string): WeatherCondition => {
  if (iconCode.includes("01")) return "clear";
  if (
    iconCode.includes("02") ||
    iconCode.includes("03") ||
    iconCode.includes("04")
  )
    return "clouds";
  if (iconCode.includes("09") || iconCode.includes("10")) return "rain";
  if (iconCode.includes("11")) return "storm";
  if (iconCode.includes("13")) return "snow";
  if (iconCode.includes("50")) return "mist";
  return "clear";
};

export const getWeatherInsight = (
  condition: string,
  temp: number,
  humidity: number,
  unit: string
): string => {
  const celsiusTemp = unit === "imperial" ? ((temp - 32) * 5) / 9 : temp;

  if (condition === "Clear" && celsiusTemp > 25) {
    return "Perfect day for outdoor activities! Don't forget sunscreen.";
  }
  if (condition === "Rain") {
    return "Rainy weather ahead. Perfect for staying cozy indoors.";
  }
  if (condition === "Clouds" && celsiusTemp > 20) {
    return "Nice cloudy weather, great for a walk in the park.";
  }
  if (celsiusTemp < 5) {
    return "Bundle up! It's quite cold outside today.";
  }
  if (humidity > 80) {
    return "High humidity levels. Stay hydrated!";
  }
  if (condition === "Thunderstorm") {
    return "Stormy weather! Stay indoors and stay safe.";
  }
  if (condition === "Snow") {
    return "Snow day! Drive carefully and dress warmly.";
  }
  return "Have a wonderful day!";
};

export const formatTemperature = (temp: number, unit: string): string => {
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;
};

export const formatTime = (
  timestamp: number,
  format: "12h" | "24h" = "24h"
): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: format === "12h",
  });
};

export const formatDate = (
  timestamp: number,
  format: "short" | "long" = "short"
): string => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// src/utils/validation.ts
export const validateCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const validateCityName = (city: string): boolean => {
  return city.trim().length > 0 && city.trim().length <= 100;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};
