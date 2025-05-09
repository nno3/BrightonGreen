document.addEventListener('DOMContentLoaded', function() {


  // Get event ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event');

  // Event data mapping
  const eventsData = {
    // May Events
    'brighton-pier-may20': {
      title: "Brighton Pier Beach Clean Up",
      date: "2025-05-20",
      time: "9:00 AM - 11:00 AM",
      location: "Brighton Beach (Near Palace Pier)",
      description: "Join us for our first summer cleanup session! Perfect for families and groups. Refreshments provided. Start your day making a difference with our friendly community of volunteers.",
      coordinates: [50.8185, -0.1372],
      maxParticipants: "35",
      popupText: "Brighton Pier Beach Clean Up<br>Meeting point near Palace Pier"
    },
    'hove-may18': {
      title: "Hove Beach Morning Clean",
      date: "2025-05-18",
      time: "8:30 AM - 10:30 AM",
      location: "Hove Beach (Near King Alfred Centre)",
      description: "Early morning cleanup with breakfast provided. Great way to start your Sunday! Join us for a refreshing morning of beach cleaning followed by a complimentary breakfast.",
      coordinates: [50.8271, -0.1746],
      maxParticipants: "30",
      popupText: "Hove Beach Morning Clean<br>Meeting point near King Alfred Centre"
    },
    'marina-may24': {
      title: "Marina Conservation Day",
      date: "2025-05-24",
      time: "10:00 AM - 12:00 PM",
      location: "Brighton Marina",
      description: "Help protect our marine life with this special cleanup event focusing on plastic waste. Learn about marine conservation while helping keep our marina clean and safe for wildlife.",
      coordinates: [50.8147, -0.1030],
      maxParticipants: "40",
      popupText: "Marina Conservation Day<br>Meeting point at Brighton Marina"
    },
    'saltdean-may31': {
      title: "Saltdean Beach Rescue",
      date: "2025-05-31",
      time: "11:00 AM - 1:00 PM",
      location: "Saltdean Beach",
      description: "Join our cleanup effort at Saltdean Beach. Family-friendly event with educational activities. Learn about local marine life and coastal conservation while helping keep our beaches clean.",
      coordinates: [50.8021, -0.0474],
      maxParticipants: "25",
      popupText: "Saltdean Beach Rescue<br>Meeting point at Saltdean Beach"
    },
    // June Events
    'brighton-june3': {
      title: "World Environment Day Special",
      date: "2025-06-03",
      time: "9:00 AM - 11:00 AM",
      location: "Brighton Beach",
      description: "Special cleanup event celebrating World Environment Day. Multiple activities planned including environmental workshops, beach cleaning, and educational talks about marine conservation.",
      coordinates: [50.8215, -0.1372],
      maxParticipants: "50",
      popupText: "World Environment Day Special<br>Meeting point at Brighton Beach"
    },
    'hove-june8': {
      title: "World Oceans Day Cleanup",
      date: "2025-06-08",
      time: "10:00 AM - 12:00 PM",
      location: "Hove Beach",
      description: "Celebrate World Oceans Day with us! Special marine life educational session included. Learn about ocean conservation while helping keep our beaches clean.",
      coordinates: [50.8271, -0.1746],
      maxParticipants: "45",
      popupText: "World Oceans Day Cleanup<br>Meeting point at Hove Beach"
    },
    'rottingdean-june15': {
      title: "Rottingdean Beach Care",
      date: "2025-06-15",
      time: "9:30 AM - 11:30 AM",
      location: "Rottingdean Beach",
      description: "Help us maintain the beautiful Rottingdean coastline. Parking available nearby. Join our friendly community in keeping this scenic beach clean and safe for everyone.",
      coordinates: [50.8066, -0.0602],
      maxParticipants: "30",
      popupText: "Rottingdean Beach Care<br>Meeting point at Rottingdean Beach"
    },
    'brighton-june21-am': {
      title: "Summer Solstice Morning Clean",
      date: "2025-06-21",
      time: "5:00 AM - 7:00 AM",
      location: "Brighton Beach",
      description: "Special sunrise cleanup session on the longest day of the year! Start your day with purpose and watch the sunrise while helping keep our beaches clean.",
      coordinates: [50.8215, -0.1372],
      maxParticipants: "25",
      popupText: "Summer Solstice Morning Clean<br>Meeting point at Brighton Beach"
    },
    'brighton-june21-pm': {
      title: "Summer Solstice Evening Clean",
      date: "2025-06-21",
      time: "7:00 PM - 9:00 PM",
      location: "Brighton Beach",
      description: "Evening cleanup session with sunset watching afterward. Join us for this special summer solstice event where we'll clean the beach and then enjoy the beautiful sunset together.",
      coordinates: [50.8215, -0.1372],
      maxParticipants: "30",
      popupText: "Summer Solstice Evening Clean<br>Meeting point at Brighton Beach"
    },
    'marina-june28': {
      title: "Marina Summer Special",
      date: "2025-06-28",
      time: "10:00 AM - 12:00 PM",
      location: "Brighton Marina",
      description: "Summer special cleanup with boat tour for volunteers afterward! Help us keep the marina clean and enjoy a special boat tour as a thank you.",
      coordinates: [50.8147, -0.1030],
      maxParticipants: "40",
      popupText: "Marina Summer Special<br>Meeting point at Brighton Marina"
    },
    // July Events
    'independence-july5': {
      title: "Independence Day Cleanup",
      date: "2025-07-05",
      time: "11:00 AM - 1:00 PM",
      location: "Brighton Beach",
      description: "Special cleanup event with American-themed refreshments! Join us for this fun-themed cleanup followed by refreshments and community gathering.",
      coordinates: [50.8215, -0.1372],
      maxParticipants: "35",
      popupText: "Independence Day Cleanup<br>Meeting point at Brighton Beach"
    },
    'hove-july13': {
      title: "Hove Lagoon Cleanup",
      date: "2025-07-13",
      time: "9:00 AM - 11:00 AM",
      location: "Hove Lagoon",
      description: "Focus on the Lagoon area with special water safety demonstrations. Learn about water safety while helping keep the lagoon area clean and safe for everyone.",
      coordinates: [50.8307, -0.1868],
      maxParticipants: "30",
      popupText: "Hove Lagoon Cleanup<br>Meeting point at Hove Lagoon"
    },
    'brighton-july20': {
      title: "Family Fun Day Clean",
      date: "2025-07-20",
      time: "10:00 AM - 12:00 PM",
      location: "Brighton Beach",
      description: "Family-oriented cleanup with games and activities for children. A perfect way to teach children about environmental responsibility while having fun!",
      coordinates: [50.8215, -0.1372],
      maxParticipants: "45",
      popupText: "Family Fun Day Clean<br>Meeting point at Brighton Beach"
    },
    'kemp-july27-am': {
      title: "Kemp Town Morning Clean",
      date: "2025-07-27",
      time: "8:00 AM - 10:00 AM",
      location: "Kemp Town Beach",
      description: "Morning cleanup session in the Kemp Town area. Help us keep this vibrant area of Brighton clean and beautiful.",
      coordinates: [50.8185, -0.1193],
      maxParticipants: "25",
      popupText: "Kemp Town Morning Clean<br>Meeting point at Kemp Town Beach"
    },
    'kemp-july27-pm': {
      title: "Kemp Town Afternoon Clean",
      date: "2025-07-27",
      time: "2:00 PM - 4:00 PM",
      location: "Kemp Town Beach",
      description: "Afternoon session with ice cream social afterward! Join us for a productive afternoon of beach cleaning followed by a refreshing ice cream social.",
      coordinates: [50.8185, -0.1193],
      maxParticipants: "30",
      popupText: "Kemp Town Afternoon Clean<br>Meeting point at Kemp Town Beach"
    },
    'kemp-august15-pm':{
      title: "Fun Hove Afternoon Clean",
      date: "2025-08-15",
      time: "2:00 PM - 4:00 PM",
      location: "Hove Beach",
      description: "Celebrate World Oceans Day with us! Special marine life educational session included. Learn about ocean conservation while helping keep our beaches clean.",
      coordinates: [50.8271, -0.1746],
      maxParticipants: "45",
      popupText: "World Oceans Day Cleanup<br>Meeting point at Hove Beach"
    }


  };

  // Get the selected event data
  const selectedEvent = eventsData[eventId];
  
  if (!selectedEvent) {
    window.location.href = 'cleanup-events.html';
    return;
  }

  // Update page content with event details
  document.getElementById('event-details-heading').textContent = selectedEvent.title;
  document.querySelector('.event-description p.lead').textContent = "Join us for this special cleanup event!";
  document.querySelector('.event-description p:not(.lead)').textContent = selectedEvent.description;
  
  // Update event info
  const eventInfo = document.querySelector('.event-info');
  eventInfo.innerHTML = `
    <p><i class="far fa-calendar me-2"></i>${selectedEvent.date}</p>
    <p><i class="far fa-clock me-2"></i>${selectedEvent.time}</p>
    <p><i class="fas fa-map-marker-alt me-2"></i>${selectedEvent.location}</p>
    <p><i class="fas fa-users me-2"></i>2-${selectedEvent.maxParticipants} participants</p>
  `;

  // Initialize map with correct location
  const map = L.map('event-map').setView(selectedEvent.coordinates, 15);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add marker for event location
  const eventMarker = L.marker(selectedEvent.coordinates).addTo(map);
  eventMarker.bindPopup(selectedEvent.popupText).openPopup();

  // Pre-fill form if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
    const username = localStorage.getItem('currentUser');
    const email = localStorage.getItem('userEmail');
    
    if (username) document.getElementById('name').value = username;
    if (email) document.getElementById('email').value = email;
  } else {
    window.location.href = 'signUp.html?returnUrl=' + encodeURIComponent(window.location.href);
  }

  // Create success modal
  const modalHtml = `
    <div class="modal-overlay" id="successModal" style="display: none;">
      <div class="success-modal">
        <button type="button" class="close-modal" onclick="closeSuccessModal()">&times;</button>
        <h3>Thank you for signing up!</h3>
        <p>Your support helps make a positive impact on Brighton's beaches.<br>Together, we're creating a cleaner, greener future!</p>
        <button class="add-calendar-btn" onclick="addEventToCalendar()">
          <i class="far fa-calendar-plus me-2"></i>Add to Calendar
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Handle form submission
  document.getElementById('event-signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      tshirtSize: document.getElementById('tshirt-size').value
    };

    // Get event details from the selected event
    const eventData = {
      title: selectedEvent.title,
      date: selectedEvent.date,
      time: selectedEvent.time.split(' - ')[0],
      location: selectedEvent.location,
      description: selectedEvent.description
    };

    // Store registration in localStorage
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    registrations.push({ ...formData, eventData });
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

    // Store event data for calendar
    localStorage.setItem('lastEventData', JSON.stringify(eventData));

    // Show success modal
    document.getElementById('successModal').style.display = 'block';
  });

  // Function to add event to calendar
  window.addToCalendar = function(eventData) {
    // Create calendar event object
    const calendarEvent = {
      id: eventId, // Use eventId from URL params
      title: eventData.title,
      start: eventData.date,
      allDay: false,
      extendedProps: {
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        eventId: eventId // Store original eventId for reference
      }
    };

    // Get existing calendar events
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Check if event already exists
    const eventExists = existingEvents.some(event => 
      event.id === eventId
    );

    if (!eventExists) {
      // Add new event
      existingEvents.push(calendarEvent);
      localStorage.setItem('calendarEvents', JSON.stringify(existingEvents));
      
      // Show calendar confirmation popup
      const calendarConfirmation = document.createElement('div');
      calendarConfirmation.className = 'calendar-confirmation';
      calendarConfirmation.innerHTML = `
        <div class="success-modal" style="text-align: center;">
          <h3>Successfully added to calendar!</h3>
          <p>You can now view the event in the <a href="calendar.html">calendar page</a>.</p>
          <p class="mt-4">Consider donating to support these initiatives and ensure we continue making a difference.</p>
          <a href="donation.html" class="btn btn-primary mt-3">
            <i class="fas fa-heart me-2"></i>Donate Now
          </a>
          <button type="button" class="close-modal" onclick="closeCalendarConfirmation()">&times;</button>
        </div>
        <div class="modal-overlay"></div>
      `;
      document.body.appendChild(calendarConfirmation);
    } else {
      // Show already in calendar message
      const calendarConfirmation = document.createElement('div');
      calendarConfirmation.className = 'calendar-confirmation';
      calendarConfirmation.innerHTML = `
        <div class="success-modal" style="text-align: center;">
          <h3>Event already in calendar!</h3>
          <p>This event is already in your <a href="calendar.html">calendar</a>.</p>
          <p class="mt-4">Consider donating to support these initiatives and ensure we continue making a difference.</p>
          <a href="donation.html" class="btn btn-primary mt-3">
            <i class="fas fa-heart me-2"></i>Donate Now
          </a>
          <button type="button" class="close-modal" onclick="closeCalendarConfirmation()">&times;</button>
        </div>
        <div class="modal-overlay"></div>
      `;
      document.body.appendChild(calendarConfirmation);
    }
  }

  // Function to create ICS file content
  function createICSFile(event) {
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    const start = event.start;
    const end = new Date(start.getTime() + event.duration * 60000);

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
  }
});

// Function to close success modal
window.closeSuccessModal = function() {
  document.getElementById('successModal').style.display = 'none';
  window.location.href = 'cleanup-events.html';
}

// Function to add event to calendar
window.addEventToCalendar = function() {
  const eventData = JSON.parse(localStorage.getItem('lastEventData'));
  if (eventData) {
    window.addToCalendar(eventData);
    
    // Show calendar confirmation popup
    const calendarConfirmation = document.createElement('div');
    calendarConfirmation.className = 'calendar-confirmation';
    calendarConfirmation.innerHTML = `
      <div class="success-modal" style="text-align: center;">
        <h3>Successfully added to calendar!</h3>
        <p>You can now view the event in your calendar.</p>
        <p class="mt-4">Consider donating to support these initiatives and ensure we continue making a difference.</p>
        <a href="donation.html" class="btn btn-primary mt-3">
          <i class="fas fa-heart me-2"></i>Donate Now
        </a>
        <button type="button" class="close-modal" onclick="closeCalendarConfirmation()">&times;</button>
      </div>
      <div class="modal-overlay"></div>
    `;
    document.body.appendChild(calendarConfirmation);
  }
}

// Function to close calendar confirmation
window.closeCalendarConfirmation = function() {
  const confirmation = document.querySelector('.calendar-confirmation');
  if (confirmation) {
    confirmation.remove();
  }
}