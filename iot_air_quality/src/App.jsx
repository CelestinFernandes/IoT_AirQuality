import React, { useState, useEffect } from "react";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { db } from "./firebase";
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
          const entries = Object.entries(data); // Retrieve all data
          setDataPoints(entries);

          const latestKey = Object.keys(data).pop(); // Get latest timestamp
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

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleSort = (field) => {
    const direction = sortedField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortDirection(direction);

    const sortedData = [...dataPoints].sort(([keyA, valueA], [keyB, valueB]) => {
      const valA = valueA[field] || "";
      const valB = valueB[field] || "";

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setDataPoints(sortedData);
  };

  const filteredData = dataPoints.filter(([timestamp, entry]) =>
    Object.values(entry).some((value) => value?.toString().toLowerCase().includes(filterText.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="app">
      <h1>IoT Air Monitoring</h1>
      <div className="data-item">Air Condition: {latestData.airCondition || "N/A"}</div>
      <div className="data-item">Air Quality: {latestData.airQuality || "N/A"}</div>
      <div className="data-item">Heat Index Condition: {latestData.heatIndexCondition || "N/A"}</div>
      <div className="data-item">Humidity: {latestData.humidity || "N/A"}</div>
      <div className="data-item">Temperature: {latestData.temperature || "N/A"}°C</div>
      <div className="data-item">MQ135: {latestData.mq135 || "N/A"}</div>
      <div className="data-item">PM10: {latestData.pm_data?.pm10 || fallbackPM.pm10} µg/m³</div>
      <div className="data-item">PM2.5: {latestData.pm_data?.pm25 || fallbackPM.pm25} µg/m³</div>

      <h2>All Data (Paginated)</h2>
      <div className="filter-container">
        <input
          type="text"
          className="filter-input"
          placeholder="Filter data..."
          value={filterText}
          onChange={handleFilterChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("timestamp")}>Timestamp</th>
            <th onClick={() => handleSort("airCondition")}>Air Condition</th>
            <th onClick={() => handleSort("airQuality")}>Air Quality</th>
            <th onClick={() => handleSort("heatIndexCondition")}>Heat Index Condition</th>
            <th onClick={() => handleSort("humidity")}>Humidity</th>
            <th onClick={() => handleSort("temperature")}>Temperature</th>
            <th onClick={() => handleSort("mq135")}>MQ135</th>
            <th onClick={() => handleSort("pm_data.pm10")}>PM10</th>
            <th onClick={() => handleSort("pm_data.pm25")}>PM2.5</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(([timestamp, entry]) => (
            <tr key={timestamp}>
              <td>{timestamp}</td>
              <td>{entry.airCondition || "N/A"}</td>
              <td>{entry.airQuality || "N/A"}</td>
              <td>{entry.heatIndexCondition || "N/A"}</td>
              <td>{entry.humidity || "N/A"}</td>
              <td>{entry.temperature || "N/A"}°C</td>
              <td>{entry.mq135 || "N/A"}</td>
              <td>{entry.pm_data?.pm10 || fallbackPM.pm10} µg/m³</td>
              <td>{entry.pm_data?.pm25 || fallbackPM.pm25} µg/m³</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
