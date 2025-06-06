document.addEventListener('DOMContentLoaded', function() {
  // Get saved events from localStorage
  const savedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  
  // Initialize FullCalendar
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    events: savedEvents,
    eventClick: function(info) {
      showEventDetails(info.event);
    },
    eventContent: function(arg) {
      // Format the event time if it exists
      let timeStr = '';
      if (arg.event.start) {
        const startTime = arg.event.start.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        timeStr = `<div class="fc-time">${startTime}</div>`;
      }
      
      return {
        html: `
          <div class="fc-content">
            <div class="fc-title">${arg.event.title}</div>
            ${timeStr}
          </div>
        `
      };
    },
    // Allow date clicking to add custom events
    dateClick: function(info) {
      showAddEventModal(info.dateStr);
    },
    editable: true, // Allow event dragging
    eventDrop: function(info) {
      // Update the event in localStorage when dragged to a new date
      updateEventDate(info.event);
    },
    // Make calendar more zoomed out
    aspectRatio: 1.5, // Decreased from 1.8 to make calendar taller
    contentHeight: 700, // Fixed height in pixels instead of 'auto' to prevent footer overlap
    dayMaxEvents: 4, // Increased from 3 to show more events per day before showing "more" link
    views: {
      dayGrid: {
        dayMaxEvents: 4 // Increased from 3
      }
    },
    // Improve accessibility
    buttonText: {
      today: 'Today',
      month: 'Month view',
      prev: 'Previous month',
      next: 'Next month'
    },
    // Add keyboard navigation
    selectable: true,
    navLinks: true,
    // Accessibility labels
    allDayText: 'All day events',
    moreLinkText: 'plus {0} more',
    noEventsText: 'No events to display'
  });

  calendar.render();

  // Add a listener for calendar events changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'calendarEvents') {
      // Refresh calendar events
      const updatedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      calendar.removeAllEvents();
      calendar.addEventSource(updatedEvents);
    }
  });

  // Function to show event details in modal
  function showEventDetails(event) {
    // Set button data attributes for delete, edit and export
    document.getElementById('deleteEvent').dataset.eventId = event.id;
    document.getElementById('editEvent').dataset.eventId = event.id;
    document.getElementById('addToPersonalCalendar').dataset.eventId = event.id;
    
    // Set modal title to event title
    document.getElementById('eventTitle').textContent = event.title;
    
    // Set event date in badge format
    const eventDate = new Date(event.start);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('eventDate').textContent = formattedDate;
    
    // Set event time if available
    const timeContainer = document.getElementById('eventTimeContainer');
    if (event.extendedProps && event.extendedProps.time) {
      document.getElementById('eventTime').textContent = event.extendedProps.time;
      timeContainer.style.display = 'flex';
    } else {
      timeContainer.style.display = 'none';
    }
    
    // Set event location if available
    const locationContainer = document.getElementById('eventLocationContainer');
    if (event.extendedProps && event.extendedProps.location) {
      document.getElementById('eventLocation').textContent = event.extendedProps.location;
      locationContainer.style.display = 'flex';
    } else {
      locationContainer.style.display = 'none';
    }
    
    // Set event description if available
    const descriptionContainer = document.getElementById('eventDescriptionContainer');
    if (event.extendedProps && event.extendedProps.description) {
      document.getElementById('eventDescription').textContent = event.extendedProps.description;
      descriptionContainer.style.display = 'flex';
    } else {
      descriptionContainer.style.display = 'none';
    }
    
    // Show all buttons by default (restore original UI)
    document.getElementById('deleteEvent').style.display = 'inline-block';
    document.getElementById('editEvent').style.display = 'inline-block';
    document.getElementById('addToPersonalCalendar').style.display = 'inline-block';
    
    // Make the modal a bit wider to give more space for buttons
    const modalElement = document.getElementById('eventModal');
    modalElement.querySelector('.modal-dialog').classList.add('modal-lg');
    
    // Get the current modal instance
    const currentModal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    if (currentModal) {
      currentModal.dispose();
    }
    
    // Show the modal
    const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
    eventModal.show();
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`Event details for ${event.title} on ${formattedDate} are now displayed`);
    }
  }

  // Function to show add event modal
  function showAddEventModal(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    document.getElementById('addEventDate').value = date;
    const addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));
    addEventModal.show();
    
    // Focus on the title field for easier entry
    setTimeout(() => {
      document.getElementById('addEventTitle').focus();
    }, 500);
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`Add event form opened for ${formattedDate}`);
    }
  }

  // Function to show edit event modal
  function showEditEventModal(eventId) {
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const eventToEdit = existingEvents.find(event => event.id === eventId);
    
    if (eventToEdit) {
      document.getElementById('editEventId').value = eventId;
      document.getElementById('editEventTitle').value = eventToEdit.title;
      document.getElementById('editEventTime').value = eventToEdit.extendedProps.time || '';
      document.getElementById('editEventLocation').value = eventToEdit.extendedProps.location || '';
      document.getElementById('editEventDescription').value = eventToEdit.extendedProps.description || '';
      
      const editEventModal = new bootstrap.Modal(document.getElementById('editEventModal'));
      editEventModal.show();
      
      // Focus on the title field for easier editing
      setTimeout(() => {
        document.getElementById('editEventTitle').focus();
      }, 500);
      
      // Announce to screen reader
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Editing event: ${eventToEdit.title}`);
      }
    }
  }

  // Function to update event date when dragged
  function updateEventDate(event) {
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const updatedEvents = existingEvents.map(evt => {
      if (evt.id === event.id) {
        // Update the start date
        evt.start = event.startStr;
      }
      return evt;
    });
    
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    // Show success message
    showToast('Event updated successfully!');
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
      const formattedDate = new Date(event.startStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
      window.announceToScreenReader(`Event ${event.title} moved to ${formattedDate}`);
    }
  }

  // Function to delete event
  function deleteEvent(eventId) {
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const eventToDelete = existingEvents.find(event => event.id === eventId);
    const updatedEvents = existingEvents.filter(event => event.id !== eventId);
    
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    // Refresh calendar
    calendar.removeAllEvents();
    calendar.addEventSource(updatedEvents);
    
    // Show success message
    showToast('Event deleted successfully!');
    
    // Announce to screen reader
    if (window.announceToScreenReader && eventToDelete) {
      window.announceToScreenReader(`Event ${eventToDelete.title} has been deleted`);
    }
  }

  // Function to add a new custom event
  function addCustomEvent(eventData) {
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Check if this is a beach cleanup event
    const isBeachCleanupEvent = eventData.title.toLowerCase().includes('beach clean') || 
                               eventData.title.toLowerCase().includes('beach cleanup');
    
    // If it's a beach cleanup event, check for duplicates (same title, date, and location)
    if (isBeachCleanupEvent) {
      const duplicateEvent = existingEvents.find(event => {
        const sameDate = event.start === eventData.date;
        const sameLocation = (!event.extendedProps.location && !eventData.location) || 
                           (event.extendedProps.location === eventData.location);
        const isBeachCleanup = event.title.toLowerCase().includes('beach clean') || 
                              event.title.toLowerCase().includes('beach cleanup');
        
        return isBeachCleanup && sameDate && sameLocation;
      });
      
      if (duplicateEvent) {
        // Show error message
        showErrorToast('A beach cleanup event already exists on this date and location. Please choose a different date or location.');
        
        // Announce to screen reader
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Duplicate event error: A beach cleanup event already exists on this date and location');
        }
        
        return false; // Indicate failure
      }
    }
    
    // Create new event with unique ID
    const newEvent = {
      id: 'custom-' + Date.now(),
      title: eventData.title,
      start: eventData.date,
      allDay: !eventData.time, // Make it all-day event if no time specified
      extendedProps: {
        time: eventData.time || '',
        location: eventData.location || '',
        description: eventData.description || '',
        isCustom: true
      }
    };
    
    existingEvents.push(newEvent);
    localStorage.setItem('calendarEvents', JSON.stringify(existingEvents));
    
    // Refresh calendar
    calendar.removeAllEvents();
    calendar.addEventSource(existingEvents);
    
    // Format date for announcement
    const formattedDate = new Date(eventData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    // Show success message
    showToast('Event added successfully!');
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`Event ${eventData.title} added for ${formattedDate}`);
    }
    
    return true; // Indicate success
  }

  // Function to update an existing event
  function updateEvent(eventData) {
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const eventToUpdate = existingEvents.find(event => event.id === eventData.id);
    
    const updatedEvents = existingEvents.map(event => {
      if (event.id === eventData.id) {
        // Update event properties
        event.title = eventData.title;
        event.extendedProps.time = eventData.time || '';
        event.extendedProps.location = eventData.location || '';
        event.extendedProps.description = eventData.description || '';
        // Update allDay property based on time presence
        event.allDay = !eventData.time;
      }
      return event;
    });
    
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    // Refresh calendar
    calendar.removeAllEvents();
    calendar.addEventSource(updatedEvents);
    
    // Show success message
    showToast('Event updated successfully!');
    
    // Announce to screen reader
    if (window.announceToScreenReader && eventToUpdate) {
      window.announceToScreenReader(`Event ${eventData.title} has been updated`);
    }
  }

  // Function to show toast notification
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close notification"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
      toast.remove();
    });
  }

  // Function to show error toast notification
  function showErrorToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close error message"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
      toast.remove();
    });
  }

  // Add event listeners for form submissions and buttons
  
  // Add Custom Event Form
  document.getElementById('addEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const eventData = {
      title: document.getElementById('addEventTitle').value,
      date: document.getElementById('addEventDate').value,
      time: document.getElementById('addEventTime').value,
      location: document.getElementById('addEventLocation').value,
      description: document.getElementById('addEventDescription').value
    };
    
    // Only close the modal and reset the form if the event was successfully added
    const eventAdded = addCustomEvent(eventData);
    
    if (eventAdded) {
      // Close modal and reset form
      document.getElementById('addEventForm').reset();
      bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
    }
  });
  
  // Edit Event Form
  document.getElementById('editEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const eventData = {
      id: document.getElementById('editEventId').value,
      title: document.getElementById('editEventTitle').value,
      time: document.getElementById('editEventTime').value,
      location: document.getElementById('editEventLocation').value,
      description: document.getElementById('editEventDescription').value
    };
    
    updateEvent(eventData);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('editEventModal')).hide();
  });
  
  // Delete button
  document.getElementById('deleteEvent').addEventListener('click', function() {
    const eventId = this.dataset.eventId;
    
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
    }
  });
  
  // Edit button
  document.getElementById('editEvent').addEventListener('click', function() {
    const eventId = this.dataset.eventId;
    bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
    showEditEventModal(eventId);
  });
  
  // Add to personal calendar button
  document.getElementById('addToPersonalCalendar').addEventListener('click', function() {
    const eventId = document.getElementById('deleteEvent').dataset.eventId;
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const eventToExport = existingEvents.find(event => event.id === eventId);
    
    if (eventToExport) {
      console.log("Exporting event:", eventToExport); // Debug log
      
      // Parse date properly - handle both formats
      let startDate;
      try {
        // If time is present, add it to the date string with a T separator
        if (eventToExport.extendedProps.time) {
          startDate = new Date(`${eventToExport.start}T${eventToExport.extendedProps.time}`);
        } else {
          // For all-day events, use just the date
          startDate = new Date(`${eventToExport.start}T00:00:00`);
        }
        
        // If date is invalid, create a fallback
        if (isNaN(startDate.getTime())) {
          console.warn("Invalid date detected, using current date as fallback");
          startDate = new Date();
        }
      } catch (e) {
        console.error("Error parsing date:", e);
        startDate = new Date(); // Fallback to current date
      }
      
      // Create calendar file content
      const icsEvent = {
        title: eventToExport.title,
        location: eventToExport.extendedProps.location || '',
        description: eventToExport.extendedProps.description || '',
        start: startDate,
        duration: 120 // 2 hours
      };
      
      console.log("ICS Event:", icsEvent); // Debug log
      
      const icsContent = createICSFile(icsEvent);
      
      // Create and trigger download
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'beach-cleanup-event.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Event downloaded to your personal calendar');
      
      // Announce to screen reader
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`${eventToExport.title} has been exported to your calendar`);
      }
    } else {
      // If event not found, show error message
      showErrorToast('Unable to export event. Please try again.');
    }
  });
  
  // Add keyboard support for calendar navigation
  document.addEventListener('keydown', function(e) {
    // Only if the focus is within the calendar container
    if (e.target.closest('.calendar-container')) {
      // Left arrow navigates to previous month
      if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        calendar.prev();
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Previous month');
        }
      }
      // Right arrow navigates to next month
      else if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        calendar.next();
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Next month');
        }
      }
      // Home key navigates to today
      else if (e.key === 'Home' && e.altKey) {
        e.preventDefault();
        calendar.today();
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Navigated to current month');
        }
      }
    }
  });
  
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