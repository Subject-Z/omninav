let timezones = [
  { name: "UTC-12:00", offset: -12, cities: ["Baker Island", "Howland Island"], pinned: false },
  { name: "UTC-11:00", offset: -11, cities: ["Pago Pago", "Niue", "Midway Atoll"], pinned: false },
  { name: "UTC-10:00", offset: -10, cities: ["Honolulu", "Anchorage (summer)", "Tahiti"], pinned: false },
  { name: "UTC-09:00", offset: -9, cities: ["Anchorage", "Juneau", "Gambier Islands"], pinned: false },
  { name: "UTC-08:00", offset: -8, cities: ["Los Angeles", "San Francisco", "Vancouver"], pinned: false },
  { name: "UTC-07:00", offset: -7, cities: ["Denver", "Phoenix", "Edmonton"], pinned: false },
  { name: "UTC-06:00", offset: -6, cities: ["Chicago", "Mexico City", "Winnipeg"], pinned: false },
  { name: "UTC-05:00", offset: -5, cities: ["New York", "Toronto", "Lima"], pinned: false },
  { name: "UTC-04:00", offset: -4, cities: ["Santiago", "Halifax", "Caracas"], pinned: false },
  { name: "UTC-03:00", offset: -3, cities: ["Buenos Aires", "São Paulo", "Rio de Janeiro"], pinned: false },
  { name: "UTC-02:00", offset: -2, cities: ["Fernando de Noronha", "South Georgia"], pinned: false },
  { name: "UTC-01:00", offset: -1, cities: ["Azores", "Cape Verde"], pinned: false },
  { name: "UTC±00:00", offset: 0, cities: ["London", "Dublin", "Lisbon", "Reykjavik"], pinned: false },
  { name: "UTC+01:00", offset: 1, cities: ["Paris", "Berlin", "Madrid", "Rome"], pinned: false },
  { name: "UTC+02:00", offset: 2, cities: ["Cairo", "Athens", "Jerusalem", "Helsinki"], pinned: false },
  { name: "UTC+03:00", offset: 3, cities: ["Moscow", "Istanbul", "Nairobi", "Riyadh"], pinned: false },
  { name: "UTC+04:00", offset: 4, cities: ["Dubai", "Baku", "Tbilisi", "Yerevan"], pinned: false },
  { name: "UTC+05:00", offset: 5, cities: ["Karachi", "Tashkent", "Yekaterinburg"], pinned: false },
  { name: "UTC+06:00", offset: 6, cities: ["Dhaka", "Almaty", "Omsk"], pinned: false },
  { name: "UTC+07:00", offset: 7, cities: ["Bangkok", "Jakarta", "Hanoi"], pinned: false },
  { name: "UTC+08:00", offset: 8, cities: ["Shanghai", "Beijing", "Singapore", "Perth"], pinned: false },
  { name: "UTC+09:00", offset: 9, cities: ["Tokyo", "Seoul", "Pyongyang"], pinned: false },
  { name: "UTC+10:00", offset: 10, cities: ["Sydney", "Melbourne", "Brisbane", "Guam"], pinned: false },
  { name: "UTC+11:00", offset: 11, cities: ["Nouméa", "Honiara", "Magadan"], pinned: false },
  { name: "UTC+12:00", offset: 12, cities: ["Auckland", "Fiji", "Kamchatka"], pinned: false },
  { name: "UTC+13:00", offset: 13, cities: ["Apia", "Nuku'alofa"], pinned: false },
  { name: "UTC+14:00", offset: 14, cities: ["Kiritimati"], pinned: false }
];

// Load pinned timezones from localStorage
function loadPinnedTimezones() {
  const pinned = JSON.parse(localStorage.getItem('pinnedTimezones') || '[]');
  timezones.forEach(tz => {
    tz.pinned = pinned.includes(tz.name);
  });
}

// Save pinned timezones to localStorage
function savePinnedTimezones() {
  const pinned = timezones.filter(tz => tz.pinned).map(tz => tz.name);
  localStorage.setItem('pinnedTimezones', JSON.stringify(pinned));
}

// Load selected city from localStorage
function loadSelectedCity() {
  return localStorage.getItem('selectedCity') || '';
}

// Save selected city to localStorage
function saveSelectedCity(city) {
  localStorage.setItem('selectedCity', city);
}

function updateTimezoneList() {
  const tbody = document.querySelector("#timezone-list tbody");
  tbody.innerHTML = "";
  
  // Sort timezones - pinned first, then by offset
  const sortedTimezones = [...timezones].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.offset - b.offset;
  });

  sortedTimezones.forEach(tz => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tzTime = new Date(utcTime + (3600000 * tz.offset));
    const dateStr = tzTime.toLocaleString("en-US", {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = tzTime.toLocaleString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const row = document.createElement("tr");
    if (tz.pinned) row.classList.add("pinned");
    
    row.innerHTML = `
      <td>${tz.name} (UTC${tz.offset >= 0 ? "+" : ""}${tz.offset})</td>
      <td>
        <div>${timeStr}</div>
        <div>${dateStr}</div>
      </td>
      <td>${tz.cities.join(", ")}</td>
      <td>
        <button class="pin-btn" data-timezone="${tz.name}" title="${tz.pinned ? 'Unpin' : 'Pin to top'}">
          ${tz.pinned ? '📌' : '📍'}
        </button>
      </td>
    `;
    
    row.querySelector(".pin-btn").addEventListener("click", () => {
      tz.pinned = !tz.pinned;
      savePinnedTimezones();
      updateTimezoneList();
    });
    
    tbody.appendChild(row);
  });
}

function populateCitySelector() {
  const selector = document.getElementById("city-selector");
  selector.innerHTML = '<option value="">-- Select a city --</option>';
  
  const allCities = [];
  timezones.forEach(tz => {
    tz.cities.forEach(city => {
      allCities.push({
        name: city,
        offset: tz.offset
      });
    });
  });
  
  allCities.sort((a, b) => a.name.localeCompare(b.name));
  
  allCities.forEach(city => {
    const option = document.createElement("option");
    option.value = `${city.name}|${city.offset}`;
    option.textContent = city.name;
    selector.appendChild(option);
  });
  
  // Load saved city selection
  const savedCity = loadSelectedCity();
  if (savedCity) {
    selector.value = savedCity;
    updateSelectedCityTime();
  }
}

function updateSelectedCityTime() {
  const selector = document.getElementById("city-selector");
  const display = document.getElementById("selected-city-time");
  
  if (!selector.value) {
    display.innerHTML = '<p>Select a city to see its current time</p>';
    return;
  }
  
  const [city, offset] = selector.value.split('|');
  saveSelectedCity(selector.value);
  
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const cityTime = new Date(utcTime + (3600000 * Number(offset)));
  const dateStr = cityTime.toLocaleString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = cityTime.toLocaleString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  display.innerHTML = `
    <h3>${city}</h3>
    <p>Current Time: ${timeStr}</p>
    <p>${dateStr}</p>
  `;
}

function updateLocalTime() {
  const now = new Date();
  const timeStr = now.toLocaleString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  const dateStr = now.toLocaleString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById("local-time").textContent = `Current Time: ${timeStr}`;
  document.getElementById("local-timezone").textContent = dateStr;
}

function init() {
  // Load saved data
  loadPinnedTimezones();
  
  // Initialize displays
  populateCitySelector();
  updateTimezoneList();
  updateLocalTime();
  
  // Set up event listeners
  document.getElementById("city-selector").addEventListener("change", updateSelectedCityTime);
  
  // Set up timers
  setInterval(() => {
    updateTimezoneList();
    updateLocalTime();
    
    // Also update selected city time if one is selected
    if (document.getElementById("city-selector").value) {
      updateSelectedCityTime();
    }
  }, 1000);
}

window.onload = init;
