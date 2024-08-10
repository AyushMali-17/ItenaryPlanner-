document.addEventListener('DOMContentLoaded', () => {
    loadItinerary();
    initMap();
    setupEventListeners();
    setupDataExport();
});

function setupEventListeners() {
    document.getElementById('itinerary-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('print-btn').addEventListener('click', printItinerary);
    document.getElementById('clear-btn').addEventListener('click', clearItinerary);
    document.getElementById('sort-day').addEventListener('click', () => sortItinerary('day'));
    document.getElementById('sort-location').addEventListener('click', () => sortItinerary('location'));
    document.getElementById('filter-day').addEventListener('input', e => filterItinerary('day', e.target.value));
    document.getElementById('filter-location').addEventListener('input', e => filterItinerary('location', e.target.value));
    document.getElementById('login-btn').addEventListener('click', () => toggleModal('login-modal', true));
    document.getElementById('signup-btn').addEventListener('click', () => toggleModal('signup-modal', true));
    document.querySelector('.close-login').addEventListener('click', () => toggleModal('login-modal', false));
    document.querySelector('.close-signup').addEventListener('click', () => toggleModal('signup-modal', false));
    document.querySelector('.close').addEventListener('click', () => toggleModal('edit-modal', false));
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('edit-form').addEventListener('submit', handleEdit);
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;

    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.push({ day, activity, location, notes });
    localStorage.setItem('itinerary', JSON.stringify(itinerary));

    document.getElementById('itinerary-form').reset();
    displayItinerary();
}

function printItinerary() {
    window.print();
}

function clearItinerary() {
    if (confirm('Are you sure you want to clear the itinerary?')) {
        localStorage.removeItem('itinerary');
        displayItinerary();
    }
}

function sortItinerary(criteria) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.sort((a, b) => a[criteria].localeCompare(b[criteria]));
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
    displayItinerary();
}

function filterItinerary(criteria, value) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    const filtered = itinerary.filter(item => item[criteria].toLowerCase().includes(value.toLowerCase()));
    displayFilteredItinerary(filtered);
}

function displayItinerary() {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    const itineraryList = document.getElementById('itinerary-list');
    itineraryList.innerHTML = '';
    itinerary.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Day:</strong> ${item.day} <br>
                              <strong>Activity:</strong> ${item.activity} <br>
                              <strong>Location:</strong> ${item.location} <br>
                              <strong>Notes:</strong> ${item.notes} <br>
                              <button onclick="editItem(${index})">Edit</button>
                              <button onclick="deleteItem(${index})">Delete</button>`;
        itineraryList.appendChild(listItem);
    });
    initMap(); // Reinitialize map to reflect changes
}

function displayFilteredItinerary(filtered) {
    const itineraryList = document.getElementById('itinerary-list');
    itineraryList.innerHTML = '';
    filtered.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Day:</strong> ${item.day} <br>
                              <strong>Activity:</strong> ${item.activity} <br>
                              <strong>Location:</strong> ${item.location} <br>
                              <strong>Notes:</strong> ${item.notes} <br>
                              <button onclick="editItem(${index})">Edit</button>
                              <button onclick="deleteItem(${index})">Delete</button>`;
        itineraryList.appendChild(listItem);
    });
}

function initMap() {
    const mapElement = document.getElementById('map');
    const map = L.map(mapElement).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.forEach(item => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${item.location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const location = data[0];
                    L.marker([location.lat, location.lon])
                        .addTo(map)
                        .bindPopup(`<strong>${item.activity}</strong><br>${item.location}`)
                        .openPopup();
                }
            });
    });

    // Add user location detection
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', e => {
        L.marker(e.latlng, { icon: L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png' }) })
            .addTo(map)
            .bindPopup('You are here!')
            .openPopup();
    });

    map.on('locationerror', () => {
        alert('Unable to retrieve your location.');
    });
}

function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (email && password) {
        alert('Login successful!');
        toggleModal('login-modal', false);
    } else {
        alert('Please enter both email and password.');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (email && password) {
        alert('Signup successful!');
        toggleModal('signup-modal', false);
    } else {
        alert('Please enter both email and password.');
    }
}

function handleEdit(e) {
    e.preventDefault();

    const index = document.getElementById('edit-index').value;
    const day = document.getElementById('edit-day').value;
    const activity = document.getElementById('edit-activity').value;
    const location = document.getElementById('edit-location').value;
    const notes = document.getElementById('edit-notes').value;

    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary[index] = { day, activity, location, notes };
    localStorage.setItem('itinerary', JSON.stringify(itinerary));

    displayItinerary();
    toggleModal('edit-modal', false);
}

function editItem(index) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    const item = itinerary[index];

    document.getElementById('edit-day').value = item.day;
    document.getElementById('edit-activity').value = item.activity;
    document.getElementById('edit-location').value = item.location;
    document.getElementById('edit-notes').value = item.notes;
    document.getElementById('edit-index').value = index;

    toggleModal('edit-modal', true);
}

function deleteItem(index) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.splice(index, 1);
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
    displayItinerary();
}

function setupDataExport() {
    document.getElementById('export-btn').addEventListener('click', () => {
        const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
        const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'itinerary.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.classList.toggle('dark-mode');
    });
}
