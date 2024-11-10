// Array to store prediction history
let predictionHistory = [];
let predictionChart;

// Function to submit prediction data
function submitPrediction() {
    const signalStrength = parseFloat(document.getElementById('sliderValue1').value);
    const latency = parseFloat(document.getElementById('sliderValue2').value);
    const bandwidthUtilization = parseFloat(document.getElementById('sliderValue3').value);
    
    // Get checked application types
    const applicationTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(input => input.name.replace('Application_Type_', '').replace(/_/g, ' '));
    
    // Mock prediction calculation
    const predictionValue = Math.random() * 100;
    const predictionText = `${predictionValue.toFixed(2)}% - ${getPredictionText(predictionValue)}`;

    // Update result box with color coding
    const resultBox = document.getElementById('prediction-result');
    const resultClass = getPredictionClass(predictionValue);
    resultBox.innerHTML = `<p class="result-box ${resultClass}">Prediction: ${predictionText}</p>`;
    
    // Add to prediction history
    const historyEntry = `Prediction: ${predictionValue.toFixed(2)}% - ${getPredictionText(predictionValue)}`;
    predictionHistory.push(historyEntry);
    updatePredictionHistory();
    updatePredictionChart(predictionValue);
}

// Function to get prediction text based on value
function getPredictionText(value) {
    if (value > 75) return 'Great network configuration!';
    else if (value > 50) return 'Moderate network configuration.';
    else return 'Poor network configuration.';
}

// Function to get the prediction box color class based on value
function getPredictionClass(value) {
    if (value > 75) return 'good';
    else if (value > 50) return 'moderate';
    else return 'poor';
}

// Function to update prediction history list
function updatePredictionHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    predictionHistory.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    });
}

// Function to clear prediction history
function clearHistory() {
    predictionHistory = [];
    document.getElementById('history-list').innerHTML = '';
    if (predictionChart) {
        predictionChart.data.labels = [];
        predictionChart.data.datasets[0].data = [];
        predictionChart.update();
    }
}

// Function to toggle prediction history visibility
function toggleHistory() {
    const historyList = document.getElementById('history-list');
    historyList.style.display = historyList.style.display === 'none' ? 'block' : 'none';
}

// Function to restore default values
function restoreDefaults() {
    document.getElementById('sliderValue1').value = 0;
    document.getElementById('sliderValue2').value = 0;
    document.getElementById('sliderValue3').value = 0;
    Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => checkbox.checked = false);
    document.getElementById('signalStrengthValue').textContent = '0.00';
    document.getElementById('latencyValue').textContent = '0.00';
    document.getElementById('bandwidthUtilizationValue').textContent = '0.00';
    document.getElementById('prediction-result').innerHTML = '<p>Results will appear here after form submission.</p>';
}

// Function to update slider value displays
function updateSliderValue(sliderId, outputId) {
    const value = parseFloat(document.getElementById(sliderId).value).toFixed(2);
    document.getElementById(outputId).textContent = value;
}

// Function to update prediction chart
function updatePredictionChart(predictionValue) {
    if (!predictionChart) {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        predictionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(predictionHistory.length).fill(''),
                datasets: [{
                    label: 'Prediction (%)',
                    data: predictionHistory.map(entry => parseFloat(entry.split(': ')[1])),
                    borderColor: '#560bad',
                    fill: false,
                    lineTension: 0.1,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    } else {
        predictionChart.data.labels.push('');
        predictionChart.data.datasets[0].data.push(predictionValue);
        predictionChart.update();
    }
}

// Function to download prediction history as a file
function downloadHistory() {
    const blob = new Blob([predictionHistory.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'prediction_history.txt');
}
