document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const itineraryLoading = document.getElementById('itinerary-loading');
  const itineraryResults = document.getElementById('itinerary-results');
  const editPreferencesBtn = document.getElementById('edit-preferences-btn');
  const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
  const regenerateItineraryBtn = document.getElementById('regenerate-itinerary-btn');
  const showMoreAttractionsBtn = document.getElementById('show-more-attractions-btn');
  const morningActivities = document.getElementById('morning-activities');
  const afternoonActivities = document.getElementById('afternoon-activities');
  const eveningActivities = document.getElementById('evening-activities');
  
  // Get summary elements
  const summaryDate = document.getElementById('summary-date');
  const summaryActivitiesCount = document.getElementById('summary-activities-count');
  const summaryDiningCount = document.getElementById('summary-dining-count');
  const summaryInterests = document.getElementById('summary-interests');
  const itineraryDateDisplay = document.getElementById('itinerary-date');
  
  // Store all attractions and restaurants data
  let allAttractions = [];
  let allRestaurants = [];
  
  // Store the current itinerary
  let currentItinerary = {
    date: '',
    morning: [],
    afternoon: [],
    evening: []
  };
  
  // Initialize the page
  initPage();
  
  /**
   * Initialize the page
   */
  function initPage() {
    // Load saved preferences and generate itinerary
    const preferences = JSON.parse(localStorage.getItem('itineraryPreferences'));
    if (preferences) {
      // Set the date in the current itinerary
      currentItinerary.date = preferences.visitDate;
      
      // Fetch attractions and generate itinerary
      fetchAttractions()
        .then(() => {
          generatePersonalizedItinerary(preferences);
        })
        .catch(error => {
          console.error('Error loading attractions:', error);
          showToast('Error loading attractions. Please try again later.', 'error');
        });
    } else {
      // No preferences found, show error message
      showToast('No preferences found. Please start planning from the beginning.', 'error');
      setTimeout(() => {
        window.location.href = 'itinerary-planner.html';
      }, 2000);
    }
    
    // Set up event listeners
    if (addToCalendarBtn) {
      addToCalendarBtn.addEventListener('click', addItineraryToCalendar);
    }
    
    // Event delegation for activity interactions
    document.addEventListener('click', function(e) {
      // Preview activity details when clicked
      const activityCard = e.target.closest('.activity-card');
      if (activityCard && !e.target.closest('.activity-action-btn')) {
        const activityId = activityCard.dataset.id;
        previewActivity(activityId);
      }
      
      // Add activity to itinerary
      if (e.target.id === 'add-to-itinerary-btn') {
        const activityId = e.target.dataset.activityId;
        const timeSlot = e.target.dataset.timeSlot;
        addActivityToItinerary(activityId, timeSlot);
      }
      
      // Remove activity from itinerary
      if (e.target.closest('.activity-action-btn.remove-activity')) {
        const activityCard = e.target.closest('.activity-card');
        const activityId = activityCard.dataset.id;
        const timeSlot = activityCard.closest('.activities-container').id.split('-')[0]; // morning, afternoon, evening
        removeActivityFromItinerary(activityId, timeSlot);
      }
    });
  }
  
  /**
   * Fetch attractions from attractions.html
   */
  function fetchAttractions() {
    return fetch('attractions.html')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract regular attractions
        const attractionCards = doc.querySelectorAll('.attraction-card:not(.restaurant-card)');
        attractionCards.forEach((card, index) => {
          const learnMoreBtn = card.querySelector('.learn-more-btn');
          if (learnMoreBtn) {
            allAttractions.push({
              id: `attraction-${index}`,
              title: learnMoreBtn.getAttribute('data-attraction-title'),
              image: learnMoreBtn.getAttribute('data-attraction-img'),
              description: learnMoreBtn.getAttribute('data-attraction-description'),
              type: 'attraction',
              price: '££',
              location: 'Brighton',
              features: [],
              timeEstimate: '2 hours'
            });
          }
        });
        
        // Extract restaurants
        const restaurantCards = doc.querySelectorAll('.restaurant-card');
        restaurantCards.forEach((card, index) => {
          const learnMoreBtn = card.querySelector('.learn-more-btn');
          if (learnMoreBtn) {
            // Get features from restaurant-info-row spans
            const features = [];
            const featureSpans = card.querySelectorAll('.restaurant-feature');
            featureSpans.forEach(span => {
              features.push(span.textContent.trim());
            });
            
            // Get price indicator
            let price = '££';
            const priceIndicator = card.querySelector('.price-indicator');
            if (priceIndicator) {
              price = priceIndicator.textContent.trim().split(' ')[0];
            }
            
            allRestaurants.push({
              id: `restaurant-${index}`,
              title: learnMoreBtn.getAttribute('data-attraction-title'),
              image: learnMoreBtn.getAttribute('data-attraction-img'),
              description: learnMoreBtn.getAttribute('data-attraction-description'),
              type: 'restaurant',
              price: price,
              location: 'Brighton',
              features: features,
              timeEstimate: '1.5 hours'
            });
          }
        });
        
        console.log('Loaded attractions:', allAttractions.length);
        console.log('Loaded restaurants:', allRestaurants.length);
      });
  }
  
  /**
   * Generate personalized itinerary based on user preferences
   */
  function generatePersonalizedItinerary(preferences) {
    // Filter attractions based on preferences
    let filteredAttractions = [...allAttractions];
    let filteredRestaurants = [...allRestaurants];
    
    // Apply budget filtering
    const budgetNum = parseInt(preferences.budget);
    if (budgetNum <= 500) {
      filteredAttractions = filteredAttractions.filter(a => a.price === '£' || a.price === '££');
      filteredRestaurants = filteredRestaurants.filter(r => r.price === '£' || r.price === '££');
    } else if (budgetNum <= 1200) {
      filteredAttractions = filteredAttractions.filter(a => a.price === '££' || a.price === '£££');
      filteredRestaurants = filteredRestaurants.filter(r => r.price === '££' || r.price === '£££');
    }
    
    // Shuffle arrays for variety
    filteredAttractions = shuffleArray(filteredAttractions);
    filteredRestaurants = shuffleArray(filteredRestaurants);
    
    // Add activities to time slots
    currentItinerary.morning = [];
    currentItinerary.afternoon = [];
    currentItinerary.evening = [];
    
    // Add morning activities
    if (preferences.mealBreakfast) {
      currentItinerary.morning.push(filteredRestaurants[0]);
    }
    currentItinerary.morning.push(filteredAttractions[0]);
    
    // Add afternoon activities
    if (preferences.mealLunch) {
      currentItinerary.afternoon.push(filteredRestaurants[1]);
    }
    currentItinerary.afternoon.push(filteredAttractions[1]);
    if (preferences.mealTea) {
      currentItinerary.afternoon.push(filteredRestaurants[2]);
    }
    
    // Add evening activities
    if (preferences.mealDinner) {
      currentItinerary.evening.push(filteredRestaurants[3]);
    }
    currentItinerary.evening.push(filteredAttractions[2]);
    
    // Update the UI
    updateItineraryUI();
  }
  
  /**
   * Update the itinerary UI
   */
  function updateItineraryUI() {
    // Update morning activities
    if (currentItinerary.morning.length === 0) {
      morningActivities.innerHTML = `<div class="empty-slot">No morning activities planned</div>`;
    } else {
      morningActivities.innerHTML = currentItinerary.morning.map(activity => createActivityCardHtml(activity)).join('');
    }
    
    // Update afternoon activities
    if (currentItinerary.afternoon.length === 0) {
      afternoonActivities.innerHTML = `<div class="empty-slot">No afternoon activities planned</div>`;
    } else {
      afternoonActivities.innerHTML = currentItinerary.afternoon.map(activity => createActivityCardHtml(activity)).join('');
    }
    
    // Update evening activities
    if (currentItinerary.evening.length === 0) {
      eveningActivities.innerHTML = `<div class="empty-slot">No evening activities planned</div>`;
    } else {
      eveningActivities.innerHTML = currentItinerary.evening.map(activity => createActivityCardHtml(activity)).join('');
    }
    
    // Enable the add to calendar button
    if (addToCalendarBtn) {
      addToCalendarBtn.disabled = false;
    }
  }
  
  /**
   * Create HTML for an activity card
   */
  function createActivityCardHtml(activity) {
    if (!activity) return '';
    
    return `
      <div class="activity-card" data-id="${activity.id}">
        <div class="activity-thumbnail">
          <img src="${activity.image}" alt="${activity.title}">
        </div>
        <div class="activity-content">
          <h4 class="activity-title">${activity.title}</h4>
          <div class="activity-time">${activity.timeEstimate}</div>
          <p class="activity-description">${truncateText(activity.description, 100)}</p>
          <div class="activity-badges">
            <span class="activity-badge">${activity.type === 'attraction' ? 'Attraction' : 'Restaurant'}</span>
            <span class="activity-badge">${activity.price}</span>
            ${activity.features.slice(0, 2).map(feature => `<span class="activity-badge">${feature}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Preview an activity in modal
   */
  function previewActivity(activityId) {
    // Find the activity
    const activity = [...allAttractions, ...allRestaurants].find(item => item.id === activityId);
    if (!activity) return;
    
    // Set modal content
    document.getElementById('activity-preview-image').src = activity.image;
    document.getElementById('activity-preview-title').textContent = activity.title;
    document.getElementById('activity-preview-type').textContent = activity.type === 'attraction' ? 'Attraction' : 'Restaurant';
    
    // Only show price if it exists
    const priceElement = document.getElementById('activity-preview-price');
    if (activity.price) {
      priceElement.textContent = activity.price;
      priceElement.style.display = 'inline-block';
    } else {
      priceElement.style.display = 'none';
    }
    
    document.getElementById('activity-preview-description').textContent = activity.description;
    document.getElementById('activity-preview-location').textContent = activity.location;
    
    // Set features if available
    const featuresContainer = document.getElementById('activity-preview-features');
    if (activity.features.length > 0) {
      featuresContainer.innerHTML = `
        <div class="mb-2">Features:</div>
        <div class="activity-badges">
          ${activity.features.map(feature => `
            <span class="activity-badge">${feature}</span>
          `).join('')}
        </div>
      `;
    } else {
      featuresContainer.innerHTML = '';
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('activityPreviewModal'));
    modal.show();
  }
  
  /**
   * Add activity to the current itinerary
   */
  function addActivityToItinerary(activityId, timeSlot) {
    // Find the activity
    const activity = [...allAttractions, ...allRestaurants].find(item => item.id === activityId);
    if (!activity) return;
    
    // Add to appropriate time slot
    if (!currentItinerary[timeSlot]) {
      currentItinerary[timeSlot] = [];
    }
    
    // Check if already added
    const alreadyAdded = currentItinerary[timeSlot].some(item => item.id === activityId);
    if (alreadyAdded) {
      showToast(`${activity.title} is already in your itinerary.`, 'warning');
      return;
    }
    
    // Add to itinerary
    currentItinerary[timeSlot].push(activity);
    
    // Hide the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('activityPreviewModal'));
    if (modal) {
      modal.hide();
    }
    
    showToast(`Added ${activity.title} to your ${timeSlot} activities!`, 'success');
    
    // Update the UI
    updateItineraryUI();
  }
  
  /**
   * Remove activity from the current itinerary
   */
  function removeActivityFromItinerary(activityId, timeSlot) {
    // Filter out the activity
    currentItinerary[timeSlot] = currentItinerary[timeSlot].filter(item => item.id !== activityId);
    
    // Update UI
    updateItineraryUI();
    
    showToast('Activity removed from your itinerary.', 'info');
  }
  
  /**
   * Add itinerary to calendar
   */
  function addItineraryToCalendar() {
    const date = currentItinerary.date;
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Generate unique IDs for each event
    const createEventId = () => 'event-' + Math.random().toString(36).substring(2, 11);
    
    // Convert activities to calendar events
    const createCalendarEvent = (activity, timeString, duration) => ({
      id: createEventId(),
      title: activity.title,
      start: date,
      extendedProps: {
        time: timeString,
        location: activity.location || 'Brighton',
        description: activity.description,
        activityType: activity.type
      }
    });
    
    // Create events for each activity in the itinerary
    const newEvents = [];
    
    // Morning activities (9:00 AM - 12:00 PM)
    currentItinerary.morning.forEach((activity, index) => {
      const startHour = 9 + index * 2;
      const timeString = `${startHour}:00 - ${startHour + 2}:00`;
      newEvents.push(createCalendarEvent(activity, timeString));
    });
    
    // Afternoon activities (12:00 PM - 5:00 PM)
    currentItinerary.afternoon.forEach((activity, index) => {
      const startHour = 12 + index * 2;
      const timeString = `${startHour}:00 - ${startHour + 2}:00`;
      newEvents.push(createCalendarEvent(activity, timeString));
    });
    
    // Evening activities (5:00 PM - 10:00 PM)
    currentItinerary.evening.forEach((activity, index) => {
      const startHour = 17 + index * 2;
      const timeString = `${startHour}:00 - ${startHour + 2}:00`;
      newEvents.push(createCalendarEvent(activity, timeString));
    });
    
    // Add events to calendar
    calendarEvents.push(...newEvents);
    
    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    
    // Show success modal
    const addedToCalendarModal = new bootstrap.Modal(document.getElementById('addedToCalendarModal'));
    addedToCalendarModal.show();
  }
  
  /**
   * Utility to shuffle an array
   */
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  /**
   * Truncate text with ellipsis
   */
  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Show toast notification
   */
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      // Create toast container if it doesn't exist
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
      toast.remove();
    });
  }
}); 