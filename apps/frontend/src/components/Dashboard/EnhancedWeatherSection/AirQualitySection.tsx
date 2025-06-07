import React from "react";

const AirQualitySection = () => {
  const airQualityData = [
    {
      metric: "AQI",
      value: 42,
      unit: "",
      status: "Good",
      color: "text-green-400",
    },
    {
      metric: "UV Index",
      value: 6,
      unit: "",
      status: "High",
      color: "text-orange-400",
    },
    {
      metric: "Pollen",
      value: 15,
      unit: "",
      status: "Moderate",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <h4 className="text-lg font-semibold text-white mb-4">
        Air Quality & Environment
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {airQualityData.map((item, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <div className="text-white/70 text-sm">{item.metric}</div>
            <div className={`${item.color} text-xs`}>{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualitySection;
