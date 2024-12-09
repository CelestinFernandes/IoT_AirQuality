import React, { useEffect, useState } from "react";
import axios from "axios";

const getDialColor = (value, thresholds) => {
  if (value === "N/A") return "#ccc";
  if (value < thresholds.good) return "green";
  if (value < thresholds.moderate) return "orange";
  return "red";
};

const sendEmailAlert = (alerts) => {
  const alertMessages = alerts.map(
    ({ label, value }) => `${label}: ${value}`
  ).join("\n");

  axios
    .post("http://localhost:3000/send-email", {
      to: "akshata.shanmugam@gmail.com",
      subject: "IoT Alert: Multiple Parameters Exceeded Threshold",
      text: `The following parameters have exceeded their thresholds:\n\n${alertMessages}\n\nImmediate action required!`,
    })
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

const Dial = ({ label, value, thresholds, unit, addToAlerts }) => {
  const color = getDialColor(value, thresholds);

  useEffect(() => {
    if (color === "red") {
      addToAlerts({ label, value: value === "N/A" ? "N/A" : `${value}${unit}` });
    }
  }, [color, label, value, unit, addToAlerts]);

  return (
    <div className="dial">
      <div
        className="dial-circle"
        style={{ backgroundColor: color }}
      >
        <span className="dial-value">{value === "N/A" ? "N/A" : `${value}${unit}`}</span>
      </div>
      <div className="dial-label">{label}</div>
    </div>
  );
};

const Dials = ({ latestData, fallbackPM }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alerts.length > 0) {
        sendEmailAlert(alerts);
        setAlerts([]); // Clear alerts after sending email
      }
    }, 100000); 

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [alerts]);

  const addToAlerts = (alert) => {
    setAlerts((prevAlerts) => {
      // Avoid duplicate alerts for the same parameter
      if (!prevAlerts.some((item) => item.label === alert.label)) {
        return [...prevAlerts, alert];
      }
      return prevAlerts;
    });
  };

  return (
    <div className="dial-container">
      <Dial
        label="PM10"
        value={latestData.pm_data?.pm10 || fallbackPM.pm10}
        thresholds={{ good: 50, moderate: 100 }}
        unit=" µg/m³"
        addToAlerts={addToAlerts}
      />
      <Dial
        label="PM2.5"
        value={latestData.pm_data?.pm25 || fallbackPM.pm25}
        thresholds={{ good: 35, moderate: 75 }}
        unit=" µg/m³"
        addToAlerts={addToAlerts}
      />
      <Dial
        label="Temperature"
        value={latestData.temperature || "N/A"}
        thresholds={{ good: 20, moderate: 30 }}
        unit="°C"
        addToAlerts={addToAlerts}
      />
      <Dial
        label="Humidity"
        value={latestData.humidity || "N/A"}
        thresholds={{ good: 30, moderate: 60 }}
        unit=""
        addToAlerts={addToAlerts}
      />
      <Dial
        label="MQ135"
        value={latestData.mq135 || "N/A"}
        thresholds={{ good: 200, moderate: 400 }}
        unit=""
        addToAlerts={addToAlerts}
      />
    </div>
  );
};

export default Dials;
