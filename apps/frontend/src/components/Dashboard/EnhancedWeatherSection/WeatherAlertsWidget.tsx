import React, { useState } from "react";
import { Bell } from "lucide-react";

const WeatherAlertsWidget = () => {
  const [alerts] = useState([
    {
      id: 1,
      type: "Temperature Alert",
      severity: "Medium",
      message: "Temperature expected to rise above 30°C this afternoon",
      time: "2 hours ago",
      active: true,
      priority: "medium",
    },
    {
      id: 2,
      type: "Wind Advisory",
      severity: "Low",
      message: "Light winds expected to pick up to 20 km/h",
      time: "1 hour ago",
      active: true,
      priority: "low",
    },
  ]);

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="glass rounded-2xl p-4 border border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="text-orange-400" size={20} />
            <div>
              <h4 className="text-white font-medium">Active Weather Alerts</h4>
              <p className="text-white/70 text-sm">
                {alerts.length} alert{alerts.length > 1 ? "s" : ""} for your
                area
              </p>
            </div>
          </div>
          <button className="text-white/70 hover:text-white text-sm px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlertsWidget;
