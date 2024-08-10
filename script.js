document.addEventListener('DOMContentLoaded', () => {
    loadItinerary();
    initMap();
});

document.getElementById('itinerary-form').addEventListener('submit', function(e) {
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
});

document.getElementById('print-btn').addEventListener('click', function() {
    window.print();
});

document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the itinerary?')) {
        localStorage.removeItem('itinerary');
        displayItinerary();
    }
});

document.getElementById('sort-day').addEventListener('click', function() {
    sortItinerary('day');
});

document.getElementById('sort-location').addEventListener('click', function() {
    sortItinerary('location');
});

document.getElementById('filter-day').addEventListener('input', function() {
    const value = this.value;
    filterItinerary('day', value);
});

document.getElementById('filter-location').addEventListener('input', function() {
    const value = this.value;
    filterItinerary('location', value);
});

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
}

function initMap() {
    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
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

document.getElementById('login-btn').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'block';
});

document.getElementById('signup-btn').addEventListener('click', function() {
    document.getElementById('signup-modal').style.display = 'block';
});

document.querySelectorAll('.close, .close-login, .close-signup').forEach(span => {
    span.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Handle login logic here
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (email && password) {
        alert('Login successful!');
        document.getElementById('login-modal').style.display = 'none';
    } else {
        alert('Please enter both email and password.');
    }
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Handle signup logic here
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (email && password) {
        alert('Signup successful!');
        document.getElementById('signup-modal').style.display = 'none';
    } else {
        alert('Please enter both email and password.');
    }
});

function editItem(index) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    const item = itinerary[index];

    document.getElementById('edit-day').value = item.day;
    document.getElementById('edit-activity').value = item.activity;
    document.getElementById('edit-location').value = item.location;
    document.getElementById('edit-notes').value = item.notes;
    document.getElementById('edit-index').value = index;

    document.getElementById('edit-modal').style.display = 'block';
}

document.getElementById('edit-form').addEventListener('submit', function(e) {
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
    document.getElementById('edit-modal').style.display = 'none';
});

function deleteItem(index) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.splice(index, 1);
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
    displayItinerary();
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
