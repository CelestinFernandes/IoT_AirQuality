import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { db } from './firebase.js'; // Import the initialized database instance

const dbRef = ref(db, "sensor_data");

// Variables to store the most recent PM values
let latestPM10 = "N/A";
let latestPM25 = "N/A";

// Function to populate the table with data
function updateTable(data) {
    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = ""; // Clear existing table rows

    // Add rows for the last 30 data points
    const entries = Object.entries(data).slice(-30); // Get the last 30 entries
    entries.forEach(([timestamp, entry]) => {
        // Update fallback PM values if present
        if (entry.pm_data) {
            if (entry.pm_data.pm10) latestPM10 = entry.pm_data.pm10;
            if (entry.pm_data.pm25) latestPM25 = entry.pm_data.pm25;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${entry.airCondition || 'N/A'}</td>
            <td>${entry.airQuality || 'N/A'}</td>
            <td>${entry.heatIndexCondition || 'N/A'}</td>
            <td>${entry.humidity || 'N/A'}</td>
            <td>${entry.temperature || 'N/A'}°C</td>
            <td>${entry.mq135 || 'N/A'}</td>
            <td>${entry.pm_data?.pm10 || latestPM10} µg/m³</td>
            <td>${entry.pm_data?.pm25 || latestPM25} µg/m³</td>
        `;
        tableBody.appendChild(row);
    });
}

// Listen to real-time updates
onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        const latestKey = Object.keys(data).pop(); // Get the latest timestamp key
        const latestData = data[latestKey]; // Get the data for the latest timestamp

        // Update fallback PM values for live data display
        if (latestData.pm_data) {
            if (latestData.pm_data.pm10) latestPM10 = latestData.pm_data.pm10;
            if (latestData.pm_data.pm25) latestPM25 = latestData.pm_data.pm25;
        }

        // Update individual data items
        document.getElementById('airCondition').textContent = `Air Condition: ${latestData.airCondition}`;
        document.getElementById('airQuality').textContent = `Air Quality: ${latestData.airQuality}`;
        document.getElementById('heatIndexCondition').textContent = `Heat Index Condition: ${latestData.heatIndexCondition}`;
        document.getElementById('humidity').textContent = `Humidity: ${latestData.humidity}`;
        document.getElementById('temperature').textContent = `Temperature: ${latestData.temperature}°C`;
        document.getElementById('mq135').textContent = `MQ135: ${latestData.mq135}`;
        document.getElementById('pm10').textContent = `PM10: ${latestData.pm_data?.pm10 || latestPM10} µg/m³`;
        document.getElementById('pm25').textContent = `PM2.5: ${latestData.pm_data?.pm25 || latestPM25} µg/m³`;

        // Update the table with the last 30 data points
        updateTable(data);
    } else {
        console.log("No data available");
    }
}, (error) => {
    console.error("Error reading data:", error);
});
