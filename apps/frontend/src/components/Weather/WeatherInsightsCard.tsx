import React from "react";
import { Sun, CloudRain, AlertTriangle, Cloud } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export const WeatherInsightsCard: React.FC = () => {
  const { currentWeather } = useWeather();

  if (!currentWeather) return null;

  const weatherCode = currentWeather.weather[0].icon;

  const getInsight = () => {
    if (weatherCode.includes("01")) {
      return {
        icon: <Sun className="w-8 h-8" />,
        title: "Perfect Clear Skies",
        message: "Ideal conditions for outdoor activities",
        color: "from-yellow-400 to-orange-500",
        bgColor: "bg-yellow-500/10",
        tips: ["Apply sunscreen", "Stay hydrated", "Great for sports"],
      };
    }
    if (weatherCode.includes("10")) {
      return {
        icon: <CloudRain className="w-8 h-8" />,
        title: "Rain Expected",
        message: "Pack an umbrella before heading out",
        color: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-500/10",
        tips: ["Bring umbrella", "Drive carefully", "Indoor activities"],
      };
    }
    if (weatherCode.includes("11")) {
      return {
        icon: <AlertTriangle className="w-8 h-8" />,
        title: "Storm Warning",
        message: "Severe weather conditions expected",
        color: "from-purple-500 to-indigo-600",
        bgColor: "bg-purple-500/10",
        tips: ["Stay indoors", "Avoid travel", "Charge devices"],
      };
    }
    return {
      icon: <Cloud className="w-8 h-8" />,
      title: "Weather Update",
      message: "Stay informed about changing conditions",
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-500/10",
      tips: ["Check hourly", "Plan ahead", "Stay safe"],
    };
  };

  const insight = getInsight();

  return (
    <div
      className={`glass rounded-3xl p-6 ${insight.bgColor} border border-white/10 hover:bg-white/20 transition-all duration-300`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-r ${insight.color} weather-float`}
        >
          <div className="text-white">{insight.icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {insight.title}
          </h3>
          <p className="text-white/80 mb-3">{insight.message}</p>
          <div className="space-y-1">
            {insight.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-white/70"
              >
                <div className="w-1 h-1 bg-white/50 rounded-full mr-2" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
