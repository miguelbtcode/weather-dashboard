// src/utils/weatherThemes.ts
export interface WeatherTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  backgroundGradient: string;
  iconColor: string;
  glowColor: string;
  particleColor: string;
}

export const weatherThemes: Record<string, WeatherTheme> = {
  // Soleado
  clear: {
    primary: "#fbbf24", // yellow-400
    secondary: "#f59e0b", // yellow-500
    accent: "#d97706", // yellow-600
    gradient: "from-yellow-400 via-orange-400 to-orange-500",
    backgroundGradient: "from-sky-400 via-blue-400 to-blue-500",
    iconColor: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.3)",
    particleColor: "#fef3c7",
  },

  // Nublado
  clouds: {
    primary: "#6b7280", // gray-500
    secondary: "#4b5563", // gray-600
    accent: "#374151", // gray-700
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    backgroundGradient: "from-gray-600 via-gray-700 to-gray-800",
    iconColor: "#9ca3af",
    glowColor: "rgba(156, 163, 175, 0.2)",
    particleColor: "#e5e7eb",
  },

  // Lluvia
  rain: {
    primary: "#3b82f6", // blue-500
    secondary: "#2563eb", // blue-600
    accent: "#1d4ed8", // blue-700
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    backgroundGradient: "from-gray-700 via-blue-900 to-gray-900",
    iconColor: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.3)",
    particleColor: "#bfdbfe",
  },

  // Tormenta
  thunderstorm: {
    primary: "#6366f1", // indigo-500
    secondary: "#4f46e5", // indigo-600
    accent: "#4338ca", // indigo-700
    gradient: "from-purple-500 via-indigo-500 to-purple-600",
    backgroundGradient: "from-gray-900 via-purple-900 to-gray-900",
    iconColor: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.4)",
    particleColor: "#c4b5fd",
  },

  // Nieve
  snow: {
    primary: "#e5e7eb", // gray-200
    secondary: "#d1d5db", // gray-300
    accent: "#9ca3af", // gray-400
    gradient: "from-gray-100 via-gray-200 to-gray-300",
    backgroundGradient: "from-blue-100 via-gray-200 to-blue-200",
    iconColor: "#f3f4f6",
    glowColor: "rgba(243, 244, 246, 0.4)",
    particleColor: "#ffffff",
  },

  // Neblina
  mist: {
    primary: "#94a3b8", // slate-400
    secondary: "#64748b", // slate-500
    accent: "#475569", // slate-600
    gradient: "from-slate-300 via-slate-400 to-slate-500",
    backgroundGradient: "from-slate-400 via-slate-600 to-slate-700",
    iconColor: "#cbd5e1",
    glowColor: "rgba(203, 213, 225, 0.3)",
    particleColor: "#f1f5f9",
  },

  // Atardecer/Amanecer
  sunset: {
    primary: "#f97316", // orange-500
    secondary: "#ea580c", // orange-600
    accent: "#dc2626", // red-600
    gradient: "from-orange-400 via-red-400 to-pink-500",
    backgroundGradient: "from-orange-300 via-red-400 to-purple-500",
    iconColor: "#fb923c",
    glowColor: "rgba(251, 146, 60, 0.4)",
    particleColor: "#fed7aa",
  },

  // Noche
  night: {
    primary: "#1e293b", // slate-800
    secondary: "#0f172a", // slate-900
    accent: "#334155", // slate-700
    gradient: "from-slate-800 via-slate-900 to-black",
    backgroundGradient: "from-slate-900 via-blue-900 to-black",
    iconColor: "#64748b",
    glowColor: "rgba(100, 116, 139, 0.3)",
    particleColor: "#475569",
  },
};

// Mapeo de códigos de OpenWeather a temas
export const getWeatherTheme = (
  weatherCode: string,
  isNight: boolean = false
): WeatherTheme => {
  if (isNight) return weatherThemes.night;

  if (weatherCode.includes("01")) return weatherThemes.clear;
  if (
    weatherCode.includes("02") ||
    weatherCode.includes("03") ||
    weatherCode.includes("04")
  )
    return weatherThemes.clouds;
  if (weatherCode.includes("09") || weatherCode.includes("10"))
    return weatherThemes.rain;
  if (weatherCode.includes("11")) return weatherThemes.thunderstorm;
  if (weatherCode.includes("13")) return weatherThemes.snow;
  if (weatherCode.includes("50")) return weatherThemes.mist;

  // Detectar atardecer/amanecer por hora
  const hour = new Date().getHours();
  if ((hour >= 17 && hour <= 19) || (hour >= 5 && hour <= 7)) {
    return weatherThemes.sunset;
  }

  return weatherThemes.clear; // Default
};

// Utilidades para aplicar temas
export const applyWeatherTheme = (theme: WeatherTheme) => {
  const root = document.documentElement;
  root.style.setProperty("--weather-primary", theme.primary);
  root.style.setProperty("--weather-secondary", theme.secondary);
  root.style.setProperty("--weather-accent", theme.accent);
  root.style.setProperty("--weather-glow", theme.glowColor);
  root.style.setProperty("--weather-particle", theme.particleColor);
};

// Hook para usar temas del clima
export const useWeatherTheme = (weatherCode?: string) => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  const theme = weatherCode
    ? getWeatherTheme(weatherCode, isNight)
    : weatherThemes.clear;

  return {
    theme,
    isNight,
    applyTheme: () => applyWeatherTheme(theme),
    isDaytime: !isNight,
  };
};
