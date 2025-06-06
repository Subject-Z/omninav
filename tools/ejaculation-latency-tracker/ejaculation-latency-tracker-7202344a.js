// Initialize DOM elements
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('startBtn');
const finishBtn = document.getElementById('finishBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const timerModeBtn = document.getElementById('timerModeBtn');
const manualModeBtn = document.getElementById('manualModeBtn');
const timerSection = document.getElementById('timerSection');
const manualSection = document.getElementById('manualSection');
const dateInput = document.getElementById('date');
const durationInput = document.getElementById('duration');
const partnersSelect = document.getElementById('partners');
const notesTextarea = document.getElementById('notes');
const historyTable = document.getElementById('historyTable');
const exportBtn = document.querySelector('.export-section .btn-primary');
const importBtn = document.querySelector('.export-section .btn-outline');
const clearBtn = document.querySelector('.export-section .btn-warning');

// Timer variables
let startTime;
let elapsedTime = 0;
let timerInterval;

// Data storage
const STORAGE_KEY = 'ejaculationRecords';
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Set current datetime as default if element exists
if (dateInput) {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    dateInput.value = formattedDateTime;
}

// Calculate time since last record
function getDaysSinceLastRecord() {
    if (records.length === 0) return 0;
    
    // Find the most recent record by date
    let mostRecentDate = new Date(Math.max(...records.map(record => new Date(record.date).getTime())));
    const now = new Date();
    const diffTime = now - mostRecentDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate frequency stats
function getFrequencyStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeekCount = records.filter(r => new Date(r.date) >= oneWeekAgo).length;
    const lastWeekCount = records.filter(r =>
        new Date(r.date) >= twoWeeksAgo && new Date(r.date) < oneWeekAgo
    ).length;
    
    const change = lastWeekCount > 0
        ? ((thisWeekCount - lastWeekCount) / lastWeekCount * 100).toFixed(1)
        : 0;
    
    return {
        thisWeek: thisWeekCount,
        lastWeek: lastWeekCount,
        change: change
    };
}

// Calculate duration stats
function getDurationStats() {
    if (records.length === 0) return { currentMonthAvg: 0, lastMonthAvg: 0, change: 0 };
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Get first day of current month
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    // Get first day of last month
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    // Get first day of month before last month
    const twoMonthsAgoStart = new Date(currentYear, currentMonth - 2, 1);
    
    // Filter records for current month and last month
    const currentMonthRecords = records.filter(r =>
        new Date(r.date) >= currentMonthStart
    );
    
    const lastMonthRecords = records.filter(r =>
        new Date(r.date) >= lastMonthStart && new Date(r.date) < currentMonthStart
    );
    
    // Calculate current month average
    const currentMonthAvg = currentMonthRecords.length > 0
        ? currentMonthRecords.reduce((sum, r) => sum + (r.durationMs / 60000), 0) / currentMonthRecords.length
        : 0;
    
    // Calculate last month average
    const lastMonthAvg = lastMonthRecords.length > 0
        ? lastMonthRecords.reduce((sum, r) => sum + (r.durationMs / 60000), 0) / lastMonthRecords.length
        : 0;
    
    // Calculate percentage change
    const change = lastMonthAvg > 0
        ? ((currentMonthAvg - lastMonthAvg) / lastMonthAvg * 100).toFixed(1)
        : 0;
    
    return {
        currentMonthAvg: currentMonthAvg.toFixed(1),
        lastMonthAvg: lastMonthAvg.toFixed(1),
        change: change
    };
}

// Update dashboard stats
function updateDashboard() {
    // Update streak
    const daysSinceLast = getDaysSinceLastRecord();
    document.querySelector('.streak-number').textContent = daysSinceLast;
    document.querySelector('.streak-label').textContent = daysSinceLast === 1 ? 'Day' : 'Days';
    
    // Update frequency
    const freqStats = getFrequencyStats();
    document.querySelector('.card:nth-child(2) .streak-number').textContent = freqStats.thisWeek;
    document.querySelector('.card:nth-child(2) .streak-label').textContent = freqStats.thisWeek === 1 ? 'This Week' : 'This Week';
    document.querySelector('.card:nth-child(2) div:nth-child(3) div:nth-child(1) span:last-child').textContent = freqStats.lastWeek;
    
    const freqChangeElement = document.querySelector('.card:nth-child(2) div:nth-child(3) div:nth-child(2) span:last-child');
    freqChangeElement.textContent = `${freqStats.change > 0 ? '↑' : '↓'} ${Math.abs(freqStats.change)}%`;
    freqChangeElement.style.color = freqStats.change > 0 ? 'var(--success)' : 'var(--danger)';
    
    // Update duration
    const durationStats = getDurationStats();
    // Show current month average as primary metric
    document.querySelector('.card:nth-child(3) .streak-number').textContent = durationStats.currentMonthAvg;
    
    // Update last month average
    const lastMonthElement = document.querySelector('.card:nth-child(3) div:nth-child(3) div:nth-child(1) span');
    const lastMonthText = lastMonthElement.parentNode.querySelector('span:first-child');
    const lastMonthValue = lastMonthElement.parentNode.querySelector('span:last-child');
    lastMonthText.textContent = 'Last Month';
    lastMonthValue.textContent = `${durationStats.lastMonthAvg} min`;
    
    // Update change
    const changeElement = document.querySelector('.card:nth-child(3) div:nth-child(3) div:nth-child(2) span:nth-child(2)');
    changeElement.textContent = `${durationStats.change > 0 ? '↑' : '↓'} ${Math.abs(durationStats.change)}%`;
    changeElement.style.color = durationStats.change > 0 ? 'var(--success)' : 'var(--danger)';
}

// Toggle between timer and manual modes
timerModeBtn.addEventListener('click', () => {
    timerModeBtn.classList.add('active');
    manualModeBtn.classList.remove('active');
    timerSection.style.display = 'block';
    manualSection.style.display = 'none';
});

manualModeBtn.addEventListener('click', () => {
    manualModeBtn.classList.add('active');
    timerModeBtn.classList.remove('active');
    timerSection.style.display = 'none';
    manualSection.style.display = 'block';
});

// Timer functions
function startTimer() {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 100);
        startBtn.disabled = true;
        finishBtn.disabled = false;
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
    startBtn.disabled = false;
    finishBtn.disabled = true;
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
}

function displayTime(time) {
    const milliseconds = Math.floor(time % 1000 / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor(time / (1000 * 60 * 60));

    timerDisplay.textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Data functions
function saveRecord() {
    let durationMs;
    
    if (timerModeBtn.classList.contains('active')) {
        durationMs = elapsedTime;
    } else {
        const durationInput = document.getElementById('duration');
        const [minutes, seconds] = durationInput.value.split(':').map(Number);
        durationMs = ((minutes || 0) * 60 + (seconds || 0)) * 1000;
    }

    const date = dateInput.value;
    const partners = partnersSelect.value;
    const notes = notesTextarea.value;

    const record = {
        id: Date.now(),
        date,
        durationMs,
        partners,
        notes
    };

    records.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    renderHistory();
    updateDashboard();
    resetTimer();
}

function renderHistory() {
    historyTable.innerHTML = '';
    
    records.forEach(record => {
        const date = new Date(record.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        const minutes = Math.floor(record.durationMs / 60000);
        const seconds = Math.floor((record.durationMs % 60000) / 1000);
        const durationText = `${minutes}m ${seconds}s`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${durationText}</td>
            <td>${record.partners === 'solo' ? 'Solo' : record.partners === 'partner' ? 'Partner' : 'Not specified'}</td>
        `;
        historyTable.appendChild(row);
    });
}

function exportData() {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ejaculation-records-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const importedData = JSON.parse(event.target.result);
                records = importedData;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
                renderHistory();
                updateDashboard();
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        records = [];
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
        updateDashboard();
    }
}

// Button event listeners
startBtn.addEventListener('click', startTimer);
finishBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
saveBtn.addEventListener('click', saveRecord);
exportBtn.addEventListener('click', exportData);
importBtn.addEventListener('click', importData);
clearBtn.addEventListener('click', clearData);
document.getElementById('refreshBtn').addEventListener('click', () => {
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderHistory();
});

// Initialize the app
displayTime(0);
renderHistory();
updateDashboard();