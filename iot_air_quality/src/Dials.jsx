import React from "react";

const getDialColor = (value, thresholds) => {
  if (value === "N/A") return "#ccc";
  if (value < thresholds.good) return "green";
  if (value < thresholds.moderate) return "orange";
  return "red";
};

const Dial = ({ label, value, thresholds, unit }) => (
  <div className="dial">
    <div
      className="dial-circle"
      style={{ backgroundColor: getDialColor(value, thresholds) }}
    >
      <span className="dial-value">{value === "N/A" ? "N/A" : `${value}${unit}`}</span>
    </div>
    <div className="dial-label">{label}</div>
  </div>
);

const Dials = ({ latestData, fallbackPM }) => (
  <div className="dial-container">
    <Dial
      label="PM10"
      value={latestData.pm_data?.pm10 || fallbackPM.pm10}
      thresholds={{ good: 50, moderate: 100 }}
      unit=" µg/m³"
    />
    <Dial
      label="PM2.5"
      value={latestData.pm_data?.pm25 || fallbackPM.pm25}
      thresholds={{ good: 35, moderate: 75 }}
      unit=" µg/m³"
    />
    <Dial
      label="Temperature"
      value={latestData.temperature || "N/A"}
      thresholds={{ good: 20, moderate: 30 }}
      unit="°C"
    />
    <Dial
      label="Humidity"
      value={latestData.humidity || "N/A"}
      thresholds={{ good: 30, moderate: 60 }}
      unit="%"
    />
    <Dial
      label="MQ135"
      value={latestData.mq135 || "N/A"}
      thresholds={{ good: 200, moderate: 400 }}
      unit=""
    />
  </div>
);

export default Dials;
