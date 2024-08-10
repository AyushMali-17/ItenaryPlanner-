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
    document.getElementById('filter-day').addEventListener('input', (e) => filterItinerary('day', e.target.value));
    document.getElementById('filter-location').addEventListener('input', (e) => filterItinerary('location', e.target.value));
    document.getElementById('login-btn').addEventListener('click', () => toggleModal('login-modal', true));
    document.getElementById('signup-btn').addEventListener('click', () => toggleModal('signup-modal', true));
    document.querySelectorAll('.close, .close-login, .close-signup').forEach(span => {
        span.addEventListener('click', () => toggleModal(span.closest('.modal').id, false));
    });
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('edit-form').addEventListener('submit', handleEdit);
    document.getElementById('map-type').addEventListener('change', initMap);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;

    if (day === '' || activity === '' || location === '') {
        alert('Please fill out all required fields.');
        return;
    }

    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.push({ day, activity, location, notes });
    localStorage.setItem('itinerary', JSON.stringify(itinerary));

    displayItinerary();
    document.getElementById('itinerary-form').reset();
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
    const mapType = document.getElementById('map-type').value;
    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeId: mapType
    });

    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.forEach(item => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: item.location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: item.activity
                });
            }
        });
    });
}

function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    // Handle login logic
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
    // Handle signup logic
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
