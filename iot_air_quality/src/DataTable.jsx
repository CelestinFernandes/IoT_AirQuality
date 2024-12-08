import React from "react";

const DataTable = ({
  dataPoints,
  setDataPoints, // Add this function prop to update the parent state
  filterText,
  setFilterText,
  sortedField,
  setSortedField,
  sortDirection,
  setSortDirection,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleSort = (field) => {
    const direction = sortedField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortDirection(direction);

    const sortedData = [...dataPoints].sort(([keyA, valueA], [keyB, valueB]) => {
      const valA = valueA[field] || ""; // Default empty string if the field doesn't exist
      const valB = valueB[field] || "";

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setDataPoints(sortedData); // Update the sorted data in the parent state
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
    <>
      <h2>All Data</h2>
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
              <td>{entry.pm_data?.pm10 || "N/A"} µg/m³</td>
              <td>{entry.pm_data?.pm25 || "N/A"} µg/m³</td>
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
    </>
  );
};

export default DataTable;
