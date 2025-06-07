import React from "react";
import { Sun, TrendingUp, Zap, AlertTriangle, Sparkles } from "lucide-react";

export const WelcomeSection: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Accurate Forecasts",
      description: "7-day detailed weather predictions",
      color: "text-blue-400",
    },
    {
      icon: Zap,
      title: "Real-time Data",
      description: "Live weather updates every 15 minutes",
      color: "text-yellow-400",
    },
    {
      icon: AlertTriangle,
      title: "Smart Alerts",
      description: "Intelligent weather warnings",
      color: "text-red-400",
    },
  ];

  return (
    <div className="text-center py-20 animate-fade-scale">
      <div className="max-w-3xl mx-auto">
        {/* Hero Icon */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center weather-float shadow-weather-lg">
            <div className="text-8xl weather-glow">🌤️</div>
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Sun className="text-white" size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Welcome to SkySense
        </h2>
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          Get real-time weather data with beautiful visualizations, accurate
          forecasts, and intelligent insights
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 weather-card"
            >
              <feature.icon
                className={`w-8 h-8 ${feature.color} mx-auto mb-3`}
              />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="inline-flex items-center space-x-3 glass px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-lg font-medium">
            Search for a city to get started
          </span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>
    </div>
  );
};
