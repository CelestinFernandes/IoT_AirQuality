import React, { useState, useEffect } from "react";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { db } from "./firebase";
import Dials from "./Dials";
import DataTable from "./DataTable";
import "./App.css";

const App = () => {
  const [latestData, setLatestData] = useState({});
  const [dataPoints, setDataPoints] = useState([]);
  const [fallbackPM, setFallbackPM] = useState({ pm10: "N/A", pm25: "N/A" });
  const [filterText, setFilterText] = useState("");
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const dbRef = ref(db, "sensor_data");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const entries = Object.entries(data);
          setDataPoints(entries);

          const latestKey = Object.keys(data).pop();
          const latestEntry = data[latestKey];

          setFallbackPM((prev) => ({
            pm10: latestEntry.pm_data?.pm10 || prev.pm10,
            pm25: latestEntry.pm_data?.pm25 || prev.pm25,
          }));

          setLatestData(latestEntry);
        } else {
          console.log("No data available");
        }
      },
      (error) => {
        console.error("Error reading data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <h1>IoT Air Monitoring</h1>
      <Dials latestData={latestData} fallbackPM={fallbackPM} />
      <div className="data-item">Air Condition: {latestData.airCondition || "N/A"}</div>
      <div className="data-item">Air Quality: {latestData.airQuality || "N/A"}</div>
      <div className="data-item">Heat Index Condition: {latestData.heatIndexCondition || "N/A"}</div>
      <DataTable
        dataPoints={dataPoints}
        setDataPoints={setDataPoints} // Pass setDataPoints to DataTable
        filterText={filterText}
        setFilterText={setFilterText}
        sortedField={sortedField}
        setSortedField={setSortedField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default App;
