document.addEventListener('DOMContentLoaded', () => {
    // Load favorite time zone from localStorage
    const favoriteZone = localStorage.getItem('favoriteZone');
    if (favoriteZone) {
        document.getElementById('inputZone').value = favoriteZone;
    }
});

function convertTime() {
    const inputTime = document.getElementById('inputTime').value;
    const inputZone = document.getElementById('inputZone').value;
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');

    // Reset UI
    errorDiv.classList.add('hidden');
    resultsDiv.innerHTML = '';

    // If no input time provided, use current time
    if (!inputTime.trim()) {
        fillLocalTime();
        return;
    }

    // Validate input
    const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!timeRegex.test(inputTime)) {
        errorDiv.textContent = 'Please enter a valid time (YYYY-MM-DD HH:MM)';
        errorDiv.classList.remove('hidden');
        return;
    }

    // Parse input time
    const date = new Date(`${inputTime} ${inputZone}`);
    if (isNaN(date.getTime())) {
        errorDiv.textContent = 'Invalid date or time';
        errorDiv.classList.remove('hidden');
        return;
    }

    // Define target time zones
    const targetZones = [
        { zone: 'UTC', label: 'UTC' },
        { zone: 'America/Los_Angeles', label: 'Pacific Time (PST)' },
        { zone: 'America/New_York', label: 'Eastern Time (EST)' },
        { zone: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
        { zone: 'Europe/Paris', label: 'Central European Time (CET)' },
        { zone: 'Australia/Sydney', label: 'Australian Eastern Time (AEDT)' }
    ];

    // Convert and display times
    resultsDiv.innerHTML = '<h2 class="text-lg font-semibold mb-2">Converted Times:</h2>';
    targetZones.forEach(({ zone, label }) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const formattedTime = formatter.format(date);
        const div = document.createElement('div');
        div.className = 'p-2 bg-gray-50 rounded mb-1';
        div.textContent = `${label}: ${formattedTime}`;
        resultsDiv.appendChild(div);
    });
}

function fillLocalTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Format as YYYY-MM-DD HH:MM
    const localTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // Fill input field
    document.getElementById('inputTime').value = localTime;

    // Set local timezone as input zone
    try {
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneSelect = document.getElementById('inputZone');
        const options = Array.from(timezoneSelect.options);
        
        // Check if local timezone exists in options
        const hasLocalZone = options.some(option => option.value === localTimezone);
        if (hasLocalZone) {
            timezoneSelect.value = localTimezone;
        } else {
            // Fallback to UTC if local timezone not in options
            timezoneSelect.value = 'UTC';
        }
    } catch (e) {
        // Fallback to UTC if timezone detection fails
        document.getElementById('inputZone').value = 'UTC';
    }

    // Trigger time conversion
    convertTime();
}

function saveFavoriteZone() {
    const inputZone = document.getElementById('inputZone').value;
    localStorage.setItem('favoriteZone', inputZone);
    alert('Favorite time zone saved!');
}