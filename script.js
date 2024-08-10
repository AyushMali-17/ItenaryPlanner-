document.getElementById('itinerary-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;
    
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>Day:</strong> ${day} <br>
                          <strong>Activity:</strong> ${activity} <br>
                          <strong>Location:</strong> ${location} <br>
                          <strong>Notes:</strong> ${notes}`;
    
    document.getElementById('itinerary-list').appendChild(listItem);
    
    document.getElementById('itinerary-form').reset();
});

document.getElementById('print-btn').addEventListener('click', function() {
    window.print();
});
