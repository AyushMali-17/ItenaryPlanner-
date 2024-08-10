document.addEventListener('DOMContentLoaded', loadItinerary);

document.getElementById('itinerary-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;

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
    localStorage.removeItem('itinerary');
    displayItinerary();
});

function displayItinerary() {
    const itineraryList = document.getElementById('itinerary-list');
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    
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

function deleteItem(index) {
    const itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    itinerary.splice(index, 1);
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
    displayItinerary();
}

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

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('edit-modal').style.display = 'none';
});

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
