/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Weather-specific colors
        sunny: "#fbbf24",
        cloudy: "#9ca3af",
        rainy: "#60a5fa",
        stormy: "#6366f1",
        snowy: "#e5e7eb",

        // Dynamic weather colors
        weather: {
          clear: {
            primary: "#fbbf24",
            secondary: "#f59e0b",
            accent: "#d97706",
            glow: "rgba(251, 191, 36, 0.3)",
          },
          clouds: {
            primary: "#6b7280",
            secondary: "#4b5563",
            accent: "#374151",
            glow: "rgba(156, 163, 175, 0.2)",
          },
          rain: {
            primary: "#3b82f6",
            secondary: "#2563eb",
            accent: "#1d4ed8",
            glow: "rgba(96, 165, 250, 0.3)",
          },
          storm: {
            primary: "#6366f1",
            secondary: "#4f46e5",
            accent: "#4338ca",
            glow: "rgba(167, 139, 250, 0.4)",
          },
          snow: {
            primary: "#e5e7eb",
            secondary: "#d1d5db",
            accent: "#9ca3af",
            glow: "rgba(243, 244, 246, 0.4)",
          },
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        lightning: "lightning 8s infinite",
        shimmer: "shimmer 2s infinite",
        "weather-spin": "spin 8s linear infinite",
        "weather-pulse": "weatherPulse 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(5deg)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px var(--weather-glow, rgba(59, 130, 246, 0.3))",
            filter:
              "drop-shadow(0 0 10px var(--weather-glow, rgba(59, 130, 246, 0.3)))",
          },
          "50%": {
            boxShadow: "0 0 40px var(--weather-glow, rgba(59, 130, 246, 0.3))",
            filter:
              "drop-shadow(0 0 20px var(--weather-glow, rgba(59, 130, 246, 0.3)))",
          },
        },
        lightning: {
          "0%, 90%, 100%": { opacity: "0" },
          "1%, 3%": {
            opacity: "1",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent 70%)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        weatherPulse: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
        },
      },

      backdropBlur: {
        xs: "2px",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "weather-sunny": "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
        "weather-cloudy": "linear-gradient(135deg, #6b7280, #4b5563, #374151)",
        "weather-rainy": "linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)",
        "weather-stormy": "linear-gradient(135deg, #6366f1, #4f46e5, #4338ca)",
        "weather-snowy": "linear-gradient(135deg, #e5e7eb, #d1d5db, #9ca3af)",
      },

      boxShadow: {
        weather:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 30px var(--weather-glow, rgba(59, 130, 246, 0.3))",
        "weather-lg":
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px var(--weather-glow, rgba(59, 130, 246, 0.3))",
        glow: "0 0 20px var(--weather-glow, rgba(59, 130, 246, 0.3))",
        "glow-lg": "0 0 40px var(--weather-glow, rgba(59, 130, 246, 0.3))",
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },

      screens: {
        xs: "475px",
        "3xl": "1600px",
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },

      transitionProperty: {
        weather:
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      },

      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        900: "900ms",
      },

      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [
    // Custom plugin for weather utilities
    function ({ addUtilities, addComponents, theme }) {
      // Weather-specific utilities
      const weatherUtilities = {
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".weather-card": {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-5px) scale(1.02)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
        ".weather-button": {
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            transition: "left 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow-lg": {
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      };

      // Weather-themed components
      const weatherComponents = {
        ".weather-gradient-sunny": {
          background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
        },
        ".weather-gradient-cloudy": {
          background: "linear-gradient(135deg, #6b7280, #4b5563, #374151)",
        },
        ".weather-gradient-rainy": {
          background: "linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)",
        },
        ".weather-gradient-stormy": {
          background: "linear-gradient(135deg, #6366f1, #4f46e5, #4338ca)",
        },
        ".weather-gradient-snowy": {
          background: "linear-gradient(135deg, #e5e7eb, #d1d5db, #9ca3af)",
        },
      };

      addUtilities(weatherUtilities);
      addComponents(weatherComponents);
    },
  ],
};
