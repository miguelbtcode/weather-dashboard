// src/utils/designTokens.ts

export const designTokens = {
  // Colores del clima
  weather: {
    sunny: "#fbbf24", // amarillo cálido
    cloudy: "#9ca3af", // gris neutro
    rainy: "#60a5fa", // azul lluvia
    stormy: "#6366f1", // púrpura tormenta
    snowy: "#e5e7eb", // blanco nieve
    clear: "#0ea5e9", // azul claro
  },

  // Espaciado consistente
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Radios de borde
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Sombras
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    glow: "0 0 20px rgb(14 165 233 / 0.15)",
  },

  // Transiciones
  transitions: {
    fast: "150ms ease-in-out",
    normal: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },

  // Tipografía
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
  },

  // Z-index
  zIndex: {
    dropdown: 10,
    overlay: 20,
    modal: 30,
    toast: 40,
    tooltip: 50,
  },
};

// Helper para crear clases CSS dinámicas
export const createWeatherGradient = (condition: string) => {
  const gradients = {
    sunny: "from-yellow-400 via-orange-400 to-orange-500",
    cloudy: "from-gray-400 via-gray-500 to-gray-600",
    rainy: "from-blue-400 via-blue-500 to-blue-600",
    stormy: "from-purple-500 via-indigo-500 to-purple-600",
    snowy: "from-gray-100 via-gray-200 to-gray-300",
    clear: "from-blue-400 via-sky-400 to-cyan-400",
  };

  return gradients[condition as keyof typeof gradients] || gradients.clear;
};

// Helper para animaciones
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
};

export default designTokens;
