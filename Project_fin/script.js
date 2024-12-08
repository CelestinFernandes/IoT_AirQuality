// Simulated data for demonstration purposes
function generateRandomData() {
    return {
        aqi: Math.floor(Math.random() * 300),
        temperature: (Math.random() * 40 - 10).toFixed(1),
        humidity: Math.floor(Math.random() * 100),
        pm25: (Math.random() * 250).toFixed(1),
        pm5: (Math.random() * 430).toFixed(1),
        heatIndex: (Math.random() * 45).toFixed(1)
    };
}

// Update gauge colors based on values
function updateGaugeColor(gauge, value) {
    let color;
    if (gauge === 'aqi') {
        if (value <= 50) color = '#00e400';
        else if (value <= 100) color = '#ffff00';
        else if (value <= 150) color = '#ff7e00';
        else color = '#ff0000';
    } else if (gauge === 'temp') {
        if (value < 0) color = '#0000ff';
        else if (value < 20) color = '#00ff00';
        else if (value < 30) color = '#ffff00';
        else color = '#ff0000';
    } else if (gauge === 'humidity') {
        if (value < 30) color = '#ffff00';
        else if (value < 60) color = '#00ff00';
        else color = '#0000ff';
    }
    document.querySelector(`#${gauge}-gauge .gauge-circle`).style.borderColor = color;
}

// Update live data
function updateLiveData(data) {
    document.getElementById('aqi-value').textContent = data.aqi;
    document.getElementById('temp-value').textContent = `${data.temperature}°C`;
    document.getElementById('humidity-value').textContent = `${data.humidity}%`;
    document.getElementById('pm25-value').textContent = `${data.pm25} µg/m³`;
    document.getElementById('pm5-value').textContent = `${data.pm5} µg/m³`;
    document.getElementById('heat-index-value').textContent = `${data.heatIndex}°C`;

    // Update gauges
    document.querySelector('#aqi-gauge .gauge-value').textContent = data.aqi;
    document.querySelector('#temp-gauge .gauge-value').textContent = `${data.temperature}°C`;
    document.querySelector('#humidity-gauge .gauge-value').textContent = `${data.humidity}%`;

    updateGaugeColor('aqi', data.aqi);
    updateGaugeColor('temp', data.temperature);
    updateGaugeColor('humidity', data.humidity);

    // Color code table rows
    const rows = document.querySelectorAll('#live-data-table tbody tr');
    rows.forEach(row => {
        const value = parseFloat(row.cells[1].textContent);
        let color;
        if (row.cells[0].textContent === 'AQI') {
            if (value <= 50) color = '#e6ffe6';
            else if (value <= 100) color = '#ffffcc';
            else if (value <= 150) color = '#ffe6cc';
            else color = '#ffcccc';
        } else if (row.cells[0].textContent === 'Temperature') {
            if (value < 0) color = '#e6f3ff';
            else if (value < 20) color = '#e6ffe6';
            else if (value < 30) color = '#ffffcc';
            else color = '#ffcccc';
        } else if (row.cells[0].textContent === 'Humidity') {
            if (value < 30) color = '#ffffcc';
            else if (value < 60) color = '#e6ffe6';
            else color = '#e6f3ff';
        }
        row.style.backgroundColor = color;
    });
}

// Update historical data
const historicalData = [];
function updateHistoricalData(data) {
    historicalData.unshift({...data, timestamp: new Date().toLocaleString()});
    if (historicalData.length > 30) historicalData.pop();

    const tbody = document.getElementById('historical-data-body');
    tbody.innerHTML = '';
    historicalData.forEach(entry => {
        const row = tbody.insertRow();
        row.insertCell().textContent = entry.timestamp;
        row.insertCell().textContent = entry.aqi;
        row.insertCell().textContent = `${entry.temperature}°C`;
        row.insertCell().textContent = `${entry.humidity}%`;
        row.insertCell().textContent = `${entry.pm25} µg/m³`;
        row.insertCell().textContent = `${entry.pm5} µg/m³`;
        row.insertCell().textContent = `${entry.heatIndex}°C`;
    });
}

// Simulate real-time updates
setInterval(() => {
    const data = generateRandomData();
    updateLiveData(data);
    updateHistoricalData(data);
}, 5000);

// Download PDF functionality
document.getElementById('download-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: '#historical-data-table' });
    doc.save('air_quality_data.pdf');
});