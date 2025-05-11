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
  
  // Create toast container on page load
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }

  // Initialize Bootstrap components
  let calendarModal = null;
  const modalElement = document.getElementById('addedToCalendarModal');
  if (modalElement) {
    calendarModal = new bootstrap.Modal(modalElement);
  }
  
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
    return new Promise((resolve, reject) => {
      // Sample attractions data
      allAttractions = [
        {
          id: 1,
          name: "Royal Pavilion Gardens",
          description: "A beautiful regency era garden in the heart of Brighton.",
          type: ["cultural", "relaxation"],
          duration: 120,
          cost: 15,
          image: "images/BrightonPavilion.jpg"
        },
        {
          id: 2,
          name: "Brighton Museum and Art Gallery",
          description: "Discover fascinating art and history collections in this iconic museum.",
          type: ["cultural"],
          duration: 90,
          cost: 10,
          image: "images/Brighton-Museum-Art-Gallery.jpg"
        },
        {
          id: 3,
          name: "Seven Sisters Country Park",
          description: "Stunning chalk cliffs and meandering river valley.",
          type: ["adventure", "relaxation"],
          duration: 180,
          cost: 0,
          image: "images/SevenSisters.jpeg"
        },
        {
          id: 4,
          name: "Brighton Palace Pier",
          description: "Traditional seaside entertainment and stunning sea views.",
          type: ["adventure", "food"],
          duration: 120,
          cost: 20,
          image: "images/Brighton-Pier.jpg"
        },
        {
          id: 5,
          name: "Preston Manor & Gardens",
          description: "Historic house with beautiful gardens and period architecture.",
          type: ["cultural", "relaxation"],
          duration: 90,
          cost: 12,
          image: "images/Preston-Manor.jpg"
        },
        {
          id: 6,
          name: "British Airways i360",
          description: "Observation tower offering panoramic views of Brighton.",
          type: ["adventure"],
          duration: 60,
          cost: 25,
          image: "images/british-airways.jpeg"
        }
      ];

      // Sample restaurants data
      allRestaurants = [
        {
          id: 101,
          name: "Food for Friends",
          description: "Award-winning vegetarian restaurant serving creative, sustainable dishes. They offer creative vegetarian and vegan cuisine made from locally-sourced, organic ingredients.",
          type: ["lunch", "dinner", "vegetarian", "vegan", "fine-dining"],
          cost: 30,
          duration: 90,
          image: "images/food-for-friends.jpeg"
        },
        {
          id: 102,
          name: "The Salt Room",
          description: "Modern seafood restaurant with focus on sustainable fishing practices. Located on Brighton's seafront, it offers stunning ocean views and focuses on sustainably caught fish and seafood.",
          type: ["lunch", "dinner", "seafood", "fine-dining"],
          cost: 45,
          duration: 90,
          image: "images/the-salt-room.jpeg"
        },
        {
          id: 103,
          name: "Lucky Beach Café",
          description: "Sustainable beachfront café serving organic meals and locally-roasted coffee. They serve organic, locally-sourced food including award-winning burgers, fresh seafood, and plant-based options.",
          type: ["breakfast", "lunch", "cafe", "organic", "seafood"],
          cost: 20,
          duration: 60,
          image: "images/lucky-beach-cafe.jpeg"
        },
        {
          id: 104,
          name: "The Chilli Pickle",
          description: "Authentic Indian cuisine with focus on regional specialties and sustainable practices. This award-winning restaurant sources spices directly from India while using locally-sourced ingredients.",
          type: ["lunch", "dinner", "indian", "vegetarian", "halal"],
          cost: 25,
          duration: 90,
          image: "images/the-chilli-pickel.jpeg"
        },
        {
          id: 105,
          name: "Metro Deco",
          description: "Elegant Art Deco tea room serving artisanal teas and homemade pastries. They offer over 30 varieties of loose-leaf tea alongside homemade cakes and a popular afternoon tea service.",
          type: ["breakfast", "brunch", "tea", "cafe", "vegan-options"],
          cost: 15,
          duration: 60,
          image: "images/metrodeco.jpeg"
        }
      ];

      resolve();
    });
  }
  
  /**
   * Generate personalized itinerary based on user preferences
   */
  function generatePersonalizedItinerary(preferences) {
    // Filter attractions based on preferences
    const filteredAttractions = allAttractions.filter(attraction => {
      // Check if any selected activity type matches
      const hasMatchingType = (
        (preferences.activityAdventure && attraction.type.includes('adventure')) ||
        (preferences.activityCultural && attraction.type.includes('cultural')) ||
        (preferences.activityRelaxation && attraction.type.includes('relaxation'))
      );
      
      // Check if within budget
      const withinBudget = attraction.cost <= preferences.budget;
      
      return hasMatchingType && withinBudget;
    });

    // Filter restaurants based on preferences
    const filteredRestaurants = allRestaurants.filter(restaurant => {
      // Check dietary preferences
      const matchesDietary = (
        (!preferences.dietaryVegetarian || restaurant.type.includes('vegetarian')) &&
        (!preferences.dietaryVegan || restaurant.type.includes('vegan')) &&
        (!preferences.dietaryHalal || restaurant.type.includes('halal'))
      );
      
      // Check dining style
      const matchesDining = (
        (!preferences.dietaryFastFood || restaurant.type.includes('fast-food')) &&
        (!preferences.dietaryFineDining || restaurant.type.includes('fine-dining'))
      );
      
      // Check if within budget
      const withinBudget = restaurant.cost <= preferences.budget;
      
      return matchesDietary && matchesDining && withinBudget;
    });

    // Shuffle arrays for randomization
    shuffleArray(filteredAttractions);
    shuffleArray(filteredRestaurants);

    // Clear existing content and current itinerary
    morningActivities.innerHTML = '';
    afternoonActivities.innerHTML = '';
    eveningActivities.innerHTML = '';
    currentItinerary.morning = [];
    currentItinerary.afternoon = [];
    currentItinerary.evening = [];

    // Generate morning activities
    const morningAttraction = filteredAttractions[0];
    if (morningAttraction) {
      morningActivities.innerHTML = createActivityCardHtml(morningAttraction);
      currentItinerary.morning.push(morningAttraction);
    } else {
      morningActivities.innerHTML = '<div class="empty-slot">No suitable morning activities found</div>';
    }

    // Generate afternoon activities
    const afternoonAttraction = filteredAttractions[1];
    if (afternoonAttraction) {
      afternoonActivities.innerHTML = createActivityCardHtml(afternoonAttraction);
      currentItinerary.afternoon.push(afternoonAttraction);
    } else {
      afternoonActivities.innerHTML = '<div class="empty-slot">No suitable afternoon activities found</div>';
    }

    // Generate evening activities
    const eveningAttraction = filteredAttractions[2];
    if (eveningAttraction) {
      eveningActivities.innerHTML = createActivityCardHtml(eveningAttraction);
      currentItinerary.evening.push(eveningAttraction);
    } else {
      eveningActivities.innerHTML = '<div class="empty-slot">No suitable evening activities found</div>';
    }

    // Add restaurants if meals are selected
    if (preferences.mealBreakfast || preferences.mealBrunch) {
      const breakfastPlace = filteredRestaurants.find(r => r.type.includes('breakfast') || r.type.includes('brunch'));
      if (breakfastPlace) {
        morningActivities.innerHTML += createActivityCardHtml(breakfastPlace);
        currentItinerary.morning.push(breakfastPlace);
      }
    }

    if (preferences.mealLunch) {
      const lunchPlace = filteredRestaurants.find(r => r.type.includes('lunch'));
      if (lunchPlace) {
        afternoonActivities.innerHTML += createActivityCardHtml(lunchPlace);
        currentItinerary.afternoon.push(lunchPlace);
      }
    }

    if (preferences.mealDinner) {
      const dinnerPlace = filteredRestaurants.find(r => r.type.includes('dinner'));
      if (dinnerPlace) {
        eveningActivities.innerHTML += createActivityCardHtml(dinnerPlace);
        currentItinerary.evening.push(dinnerPlace);
      }
    }

    // Enable the calendar button
    if (addToCalendarBtn) {
      addToCalendarBtn.disabled = false;
    }
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
    return `
      <div class="activity-card" data-id="${activity.id}">
        <div class="activity-thumbnail">
          <img src="${activity.image}" alt="${activity.name}">
        </div>
        <div class="activity-content">
          <h4 class="activity-title">${activity.name}</h4>
          <div class="activity-time">${activity.duration} minutes</div>
          <p class="activity-description">${truncateText(activity.description, 100)}</p>
          <div class="activity-badges">
            <span class="activity-badge">${activity.type.join(', ')}</span>
            <span class="activity-badge">£${activity.cost}</span>
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
    document.getElementById('activity-preview-title').textContent = activity.name;
    document.getElementById('activity-preview-type').textContent = activity.type.join(', ');
    
    // Only show price if it exists
    const priceElement = document.getElementById('activity-preview-price');
    if (activity.cost) {
      priceElement.textContent = `£${activity.cost}`;
      priceElement.style.display = 'inline-block';
    } else {
      priceElement.style.display = 'none';
    }
    
    document.getElementById('activity-preview-description').textContent = activity.description;
    document.getElementById('activity-preview-location').textContent = 'Brighton';
    
    // Set features if available
    const featuresContainer = document.getElementById('activity-preview-features');
    if (activity.type.length > 0) {
      featuresContainer.innerHTML = `
        <div class="mb-2">Features:</div>
        <div class="activity-badges">
          ${activity.type.map(type => `
            <span class="activity-badge">${type}</span>
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
      showToast(`${activity.name} is already in your itinerary.`, 'warning');
      return;
    }
    
    // Add to itinerary
    currentItinerary[timeSlot].push(activity);
    
    // Hide the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('activityPreviewModal'));
    if (modal) {
      modal.hide();
    }
    
    showToast(`Added ${activity.name} to your ${timeSlot} activities!`, 'success');
    
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
    // Get the date from preferences
    const preferences = JSON.parse(localStorage.getItem('itineraryPreferences'));
    if (!preferences || !preferences.visitDate) {
      showToast('No date selected for the itinerary.', 'error');
      return;
    }

    // Parse the date properly
    const date = new Date(preferences.visitDate);
    if (isNaN(date.getTime())) {
      showToast('Invalid date format. Please select a valid date.', 'error');
      return;
    }

    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Generate unique IDs for each event
    const createEventId = () => 'event-' + Math.random().toString(36).substring(2, 11);
    
    // Create events for each activity in the itinerary
    const newEvents = [];
    
    // Morning activities (9:00 AM - 12:00 PM)
    let currentTime = 9;
    currentItinerary.morning.forEach((activity) => {
      const duration = activity.duration || 120; // Default to 2 hours if no duration specified
      const endTime = currentTime + Math.ceil(duration / 60);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(currentTime, 0, 0);
      
      const endDateTime = new Date(date);
      endDateTime.setHours(endTime, 0, 0);
      
      newEvents.push({
        id: createEventId(),
        title: activity.name,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        allDay: false,
        extendedProps: {
          location: activity.type.includes('restaurant') ? activity.name : 'Brighton',
          description: activity.description,
          activityType: activity.type.join(', '),
          duration: duration,
          cost: activity.cost
        }
      });
      
      currentTime = endTime;
    });
    
    // Afternoon activities (12:00 PM - 5:00 PM)
    currentTime = Math.max(12, currentTime);
    currentItinerary.afternoon.forEach((activity) => {
      const duration = activity.duration || 120;
      const endTime = currentTime + Math.ceil(duration / 60);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(currentTime, 0, 0);
      
      const endDateTime = new Date(date);
      endDateTime.setHours(endTime, 0, 0);
      
      newEvents.push({
        id: createEventId(),
        title: activity.name,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        allDay: false,
        extendedProps: {
          location: activity.type.includes('restaurant') ? activity.name : 'Brighton',
          description: activity.description,
          activityType: activity.type.join(', '),
          duration: duration,
          cost: activity.cost
        }
      });
      
      currentTime = endTime;
    });
    
    // Evening activities (5:00 PM - 10:00 PM)
    currentTime = Math.max(17, currentTime);
    currentItinerary.evening.forEach((activity) => {
      const duration = activity.duration || 120;
      const endTime = currentTime + Math.ceil(duration / 60);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(currentTime, 0, 0);
      
      const endDateTime = new Date(date);
      endDateTime.setHours(endTime, 0, 0);
      
      newEvents.push({
        id: createEventId(),
        title: activity.name,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        allDay: false,
        extendedProps: {
          location: activity.type.includes('restaurant') ? activity.name : 'Brighton',
          description: activity.description,
          activityType: activity.type.join(', '),
          duration: duration,
          cost: activity.cost
        }
      });
      
      currentTime = endTime;
    });
    
    // Add events to calendar storage
    calendarEvents.push(...newEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    
    // Show success message with number of activities
    showToast(`Added ${newEvents.length} activities to your calendar!`, 'success');
    
    // Trigger calendar refresh event
    window.dispatchEvent(new Event('storage'));
    
    // Show modal with link to calendar
    if (calendarModal) {
      setTimeout(() => {
        calendarModal.show();
      }, 100);
    }
  }
  
  /**
   * Utility to shuffle an array
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    if (!toastContainer) return; // Don't proceed if container doesn't exist
    
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
    
    // Initialize and show toast with a slight delay
    setTimeout(() => {
      const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
      bsToast.show();
    }, 50);
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
      toast.remove();
    });
  }
}); 