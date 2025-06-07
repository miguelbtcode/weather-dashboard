import React, { useEffect } from "react";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { WeatherProvider } from "./context/WeatherContext";
import { ErrorBoundary } from "./utils/errorBoundary";
import { APP_CONFIG } from "./config/constants";

function App() {
  useEffect(() => {
    // Set initial theme variables
    document.documentElement.style.setProperty("--weather-primary", "#3b82f6");
    document.documentElement.style.setProperty(
      "--weather-secondary",
      "#2563eb"
    );
    document.documentElement.style.setProperty("--weather-accent", "#1d4ed8");
    document.documentElement.style.setProperty(
      "--weather-glow",
      "rgba(59, 130, 246, 0.3)"
    );

    // Set document title
    document.title = `${APP_CONFIG.name} - Real-time Weather Intelligence`;

    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professional weather dashboard with real-time forecasts, alerts, and beautiful visualizations."
      );
    }
  }, []);

  return (
    <ErrorBoundary>
      <WeatherProvider>
        <Layout>
          <Dashboard />
        </Layout>
      </WeatherProvider>
    </ErrorBoundary>
  );
}

export default App;
