document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = 'signUp.html?returnUrl=' + encodeURIComponent(window.location.href);
    return;
  }

  // Available events data
  const events = {
    "2025-05-20": [{
      id: "brighton-pier-may20",
      title: "Brighton Pier Beach Clean Up",
      time: "9:00 AM",
      location: "Brighton Beach (Near Palace Pier)",
      description: "Join us for our first summer cleanup session! Perfect for families and groups. Refreshments provided.",
      image: "images/Brighton-Beach-Cleanup1.jpeg"
    }],
    "2025-05-18": [{
      id: "hove-may18",
      title: "Hove Beach Morning Clean",
      time: "8:30 AM",
      location: "Hove Beach (Near King Alfred Centre)",
      description: "Early morning cleanup with breakfast provided. Great way to start your Sunday!",
      image: "images/Brighton-Beach-Cleanup2.jpeg"
    }],
    "2025-05-24": [{
      id: "marina-may24",
      title: "Marina Conservation Day",
      time: "10:00 AM",
      location: "Brighton Marina",
      description: "Help protect our marine life with this special cleanup event focusing on plastic waste.",
      image: "images/Brighton-Beach-Cleanup3.jpeg"
    }],
    "2025-05-31": [{
      id: "saltdean-may31",
      title: "Saltdean Beach Rescue",
      time: "11:00 AM",
      location: "Saltdean Beach",
      description: "Join our cleanup effort at Saltdean Beach. Family-friendly event with educational activities.",
      image: "images/Brighton-Beach-Cleanup1.jpeg"
    }],
    "2025-06-03": [{
      id: "brighton-june3",
      title: "World Environment Day Special",
      time: "9:00 AM",
      location: "Brighton Beach",
      description: "Special cleanup event celebrating World Environment Day. Multiple activities planned!",
      image: "images/Brighton-Beach-Cleanup3.jpeg"
    }],
    "2025-06-08": [{
      id: "hove-june8",
      title: "World Oceans Day Cleanup",
      time: "10:00 AM",
      location: "Hove Beach",
      description: "Celebrate World Oceans Day with us! Special marine life educational session included.",
      image: "images/Brighton-Beach-Cleanup5.jpeg"
    }],
    "2025-06-15": [{
      id: "rottingdean-june15",
      title: "Rottingdean Beach Care",
      time: "9:30 AM",
      location: "Rottingdean Beach",
      description: "Help us maintain the beautiful Rottingdean coastline. Parking available nearby.",
      image: "images/Brighton-Beach-Cleanup4.jpeg"
    }],
    "2025-06-21": [{
      id: "brighton-june21-am",
      title: "Summer Solstice Morning Clean",
      time: "5:00 AM",
      location: "Brighton Beach",
      description: "Special sunrise cleanup session on the longest day of the year!",
      image: "images/Brighton-Beach-Cleanup5.jpeg"
    }, {
      id: "brighton-june21-pm",
      title: "Summer Solstice Evening Clean",
      time: "7:00 PM",
      location: "Brighton Beach",
      description: "Evening cleanup session with sunset watching afterward.",
      image: "images/Brighton-Beach-Cleanup1.jpeg"
    }],
    "2025-06-28": [{
      id: "marina-june28",
      title: "Marina Summer Special",
      time: "10:00 AM",
      location: "Brighton Marina",
      description: "Summer special cleanup with boat tour for volunteers afterward!",
      image: "images/Brighton-Beach-Cleanup2.jpeg"
    }],
    "2025-07-05": [{
      id: "independence-july5",
      title: "Independence Day Cleanup",
      time: "11:00 AM",
      location: "Brighton Beach",
      description: "Special cleanup event with American-themed refreshments!",
      image: "images/Brighton-Beach-Cleanup3.jpeg"
    }],
    "2025-07-13": [{
      id: "hove-july13",
      title: "Hove Lagoon Cleanup",
      time: "9:00 AM",
      location: "Hove Lagoon",
      description: "Focus on the Lagoon area with special water safety demonstrations.",
      image: "images/Brighton-Beach-Cleanup5.jpeg"
    }],
    "2025-07-20": [{
      id: "brighton-july20",
      title: "Family Fun Day Clean",
      time: "10:00 AM",
      location: "Brighton Beach",
      description: "Family-oriented cleanup with games and activities for children.",
      image: "images/Brighton-Beach-Cleanup5.jpeg"
    }],
    "2025-07-27": [{
      id: "kemp-july27-am",
      title: "Kemp Town Morning Clean",
      time: "8:00 AM",
      location: "Kemp Town Beach",
      description: "Morning cleanup session in the Kemp Town area.",
      image: "images/Brighton-Beach-Cleanup1.jpeg"
    }, {
      id: "kemp-july27-pm",
      title: "Kemp Town Afternoon Clean",
      time: "2:00 PM",
      location: "Kemp Town Beach",
      description: "Afternoon session with ice cream social afterward!",
      image: "images/Brighton-Beach-Cleanup3.jpeg"
    }],
    "2025-08-15":[{
      id: "kemp-august15-pm",
      title: "Fun Hove Afternoon Clean",
      time: "2:00 PM",
      location: "Hove Beach",
      description: "Afternoon session with ice cream social afterward!",
      image: "images/Brighton-Beach-Cleanup3.jpeg"
  }]
  };



  // Initialize flatpickr calendar
  const calendar = flatpickr("#event-date", {
    dateFormat: "Y-m-d",
    minDate: "2025-05-13",
    enable: Object.keys(events),
    defaultDate: "2025-05-13",
    onChange: function(selectedDates, dateStr) {
      showEventsForDate(dateStr);
    }
  });

  // Show initial events
  showEventsForDate("2025-05-13");

  // Function to show events for selected date
  function showEventsForDate(date) {
    const eventsContainer = document.getElementById('events-container');
    const dateEvents = events[date] || [];
    
    // Clear previous events
    eventsContainer.innerHTML = '<div class="col-12"><h2>Available Events</h2></div>';
    
    if (dateEvents.length > 0) {
      dateEvents.forEach(event => {
        const eventCard = `
          <div class="col-12">
            <div class="event-card">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${event.image}" alt="${event.title}" class="img-fluid event-image">
                </div>
                <div class="col-md-8">
                  <div class="event-content">
                    <h3>${event.title}</h3>
                    <p class="event-time"><i class="far fa-clock me-2"></i>${date} - ${event.time}</p>
                    <p class="event-location"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>
                    <p class="event-description">${event.description}</p>
                    <a href="event-details.html?event=${event.id}" class="btn btn-primary">View Details</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        eventsContainer.innerHTML += eventCard;
      });
    } else {
      eventsContainer.innerHTML += `
        <div class="col-12">
          <p class="text-center">No events available on this date. Please select another date.</p>
        </div>
      `;
    }
  }

  // Function to add event to calendar
  window.addToCalendar = function(eventData) {
    const event = {
      title: eventData.title,
      location: eventData.location,
      description: eventData.description,
      start: new Date(eventData.date + ' ' + eventData.time),
      duration: 120, // 2 hours
    };

    // Create calendar file content
    const icsContent = createICSFile(event);
    
    // Create and trigger download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'beach-cleanup-event.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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