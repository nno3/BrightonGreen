document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const itineraryForm = document.getElementById('itinerary-form');
  const itineraryPreview = document.getElementById('itinerary-preview');
  const itineraryResults = document.getElementById('itinerary-results');
  const saveItineraryBtn = document.getElementById('save-itinerary-btn');
  const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
  const morningActivities = document.getElementById('morning-activities');
  const afternoonActivities = document.getElementById('afternoon-activities');
  const eveningActivities = document.getElementById('evening-activities');
  
  // Get landing and preferences section elements
  const landingSection = document.getElementById('landing-section');
  const preferencesSection = document.getElementById('preferences-section');
  const startPlannerBtn = document.getElementById('start-planner-btn');
  
  // Set minimum date for the date input to today
  const visitDateInput = document.getElementById('visit-date');
  if (visitDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    
    visitDateInput.min = formattedToday;
    visitDateInput.value = formattedToday; // Also set default value to today
  }
  
  // Handle the Start Now button click
  if (startPlannerBtn) {
    startPlannerBtn.addEventListener('click', function() {
      if (landingSection && preferencesSection) {
        // Hide landing section with a smooth transition
        landingSection.style.opacity = '0';
        landingSection.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          landingSection.style.display = 'none';
          // Show preferences section with a smooth transition
          preferencesSection.style.display = 'block';
          preferencesSection.style.opacity = '0';
          
          requestAnimationFrame(() => {
            preferencesSection.style.opacity = '1';
            preferencesSection.style.transition = 'opacity 0.3s ease';
          });
          
          // Announce to screen readers
          announceToScreenReader('Now showing the itinerary preferences form');
          // Scroll to the top of the preferences section
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 300);
      }
    });
  }
  
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
  
  // Check if we're on the results page
  if (window.location.pathname.includes('itinerary-results.html')) {
    // Load saved preferences
    const preferences = JSON.parse(localStorage.getItem('itineraryPreferences'));
    if (preferences) {
      // Fetch attractions and generate itinerary
      fetchAttractions().then(() => {
        generatePersonalizedItinerary(preferences);
      }).catch(error => {
        console.error('Error loading attractions:', error);
        showToast('Error loading attractions. Please try again later.', 'error');
      });
    }
  }
  
  // Handle budget slider if it exists
  const budgetSlider = document.getElementById('budget-slider');
  const budgetValue = document.getElementById('budget-value');
  
  if (budgetSlider && budgetValue) {
    // Set initial value
    budgetValue.textContent = '£' + budgetSlider.value;
    
    // Update value when slider changes
    budgetSlider.addEventListener('input', function() {
      budgetValue.textContent = '£' + this.value;
      // Update ARIA attributes for screen readers
      this.setAttribute('aria-valuenow', this.value);
    });
    
    // Handle keyboard navigation for better accessibility
    budgetSlider.addEventListener('keydown', function(e) {
      // Announce the value change to screen readers
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // Small delay to ensure the value is updated first
        setTimeout(() => {
          const announcement = `Budget set to €${this.value}`;
          announceToScreenReader(announcement);
        }, 100);
      }
    });
  }
  
  // Improve accessibility for custom checkboxes
  setupCustomCheckboxes('activity-check-input');
  setupCustomCheckboxes('dietary-check-input');
  setupCustomCheckboxes('meal-check-input');
  
  // Handle form submission
  itineraryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Get form values
    const budget = document.getElementById('budget-slider').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const visitDate = document.getElementById('visit-date').value;
    
    // Activities
    const activityAdventure = document.getElementById('activity-adventure').checked;
    const activityCultural = document.getElementById('activity-cultural').checked;
    const activityFood = document.getElementById('activity-food').checked;
    const activityRelaxation = document.getElementById('activity-relaxation').checked;
    const activityShopping = document.getElementById('activity-shopping').checked;
    
    // Dining preferences
    const dietaryVegetarian = document.getElementById('dietary-vegetarian').checked;
    const dietaryVegan = document.getElementById('dietary-vegan').checked;
    const dietaryHalal = document.getElementById('dietary-halal').checked;
    const dietaryFastFood = document.getElementById('dietary-fast-food').checked;
    const dietaryFineDining = document.getElementById('dietary-fine-dining').checked;
    
    // Meals to plan
    const mealBreakfast = document.getElementById('meal-breakfast').checked;
    const mealBrunch = document.getElementById('meal-brunch').checked;
    const mealLunch = document.getElementById('meal-lunch').checked;
    const mealDinner = document.getElementById('meal-dinner').checked;
    const mealTea = document.getElementById('meal-tea').checked;
    
    // Store preferences in localStorage
    const preferences = {
      budget,
      startTime,
      endTime,
      visitDate,
      activityAdventure,
      activityCultural,
      activityFood,
      activityRelaxation,
      activityShopping,
      dietaryVegetarian,
      dietaryVegan,
      dietaryHalal,
      dietaryFastFood,
      dietaryFineDining,
      mealBreakfast,
      mealBrunch,
      mealLunch,
      mealDinner,
      mealTea
    };
    
    localStorage.setItem('itineraryPreferences', JSON.stringify(preferences));
    
    // Show success message and redirect to the results page
    showToast('Preferences saved! Generating your itinerary...', 'success');
    announceToScreenReader('Preferences saved. Redirecting to your personalized itinerary.');
    
    // Redirect to results page after short delay
    setTimeout(function() {
      window.location.href = 'itinerary-results.html';
    }, 1500);
  });
  
  // Handle save itinerary
  saveItineraryBtn.addEventListener('click', function() {
    saveItinerary();
  });
  
  // Handle add to calendar
  addToCalendarBtn.addEventListener('click', function() {
    addItineraryToCalendar();
  });
  
  // Preview activity details when clicked
  document.addEventListener('click', function(e) {
    // Check if clicked element or parent has the preview-attraction-card class
    const attractionCard = e.target.closest('.preview-attraction-card');
    if (attractionCard) {
      const attractionId = attractionCard.dataset.id;
      previewAttraction(attractionId);
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
  
  /**
   * Fetch attractions from attractions.html
   */
  function fetchAttractions() {
    return new Promise((resolve, reject) => {
      // Sample attractions data (in a real app, this would come from an API/database)
      allAttractions = [
        {
          id: 1,
          name: "Royal Pavilion Gardens",
          description: "A beautiful regency era garden in the heart of Brighton.",
          type: ["cultural", "relaxation"],
          duration: 120,

          image: "images/BrightonPavilion.jpg"
        },
        {
          id: 2,
          name: "Brighton Museum and Art Gallery",
          description: "Discover fascinating art and history collections in this iconic museum.",
          type: ["cultural"],
          duration: 90,

          image: "images/Brighton-Museum-Art-Gallery.jpg"
        },
        {
          id: 3,
          name: "Seven Sisters Country Park",
          description: "Stunning chalk cliffs and meandering river valley.",
          type: ["adventure", "relaxation"],
          duration: 180,

          image: "images/SevenSisters.jpeg"
        },
        {
          id: 4,
          name: "Brighton Palace Pier",
          description: "Traditional seaside entertainment and stunning sea views.",
          type: ["adventure", "food"],
          duration: 120,

          image: "images/Brighton-Pier.jpg"
        },
        {
          id: 5,
          name: "Preston Manor & Gardens",
          description: "Historic house with beautiful gardens and period architecture.",
          type: ["cultural", "relaxation"],
          duration: 90,

          image: "images/Preston-Manor.jpg"
        },
        {
          id: 6,
          name: "British Airways i360",
          description: "Observation tower offering panoramic views of Brighton.",
          type: ["adventure"],
          duration: 60,

          image: "images/british-airways.jpeg"
        }
      ];

      // Sample restaurants data
      allRestaurants = [

        {
          id: 102,
          name: "Food for Friends",
          description: "Award-winning vegetarian restaurant.",
          type: ["lunch", "dinner", "vegetarian", "vegan", "fine-dining"],

          image: "images/food-for-friends.jpeg"
        },

        {
          id: 104,
          name: "The Chilli Pickle",
          description: "Modern Indian cuisine with halal options.",
          type: ["lunch", "dinner", "halal"],

          image: "images/the-chilli-pickel.jpeg"
        }
      ];

      resolve();
    });
  }
  
  /**
   * Show attraction previews
   */
  function showAttractionPreviews() {
    const previewHtml = `
      <div class="mb-4">
        <h3 class="h5 mb-3">Explore Attractions & Dining Options</h3>
        <p class="text-muted">Click on any card to see more details and add to your itinerary</p>
        
        <div class="preview-attractions">
          ${[...allAttractions, ...allRestaurants].slice(0, 6).map(item => `
            <div class="preview-attraction-card" data-id="${item.id}">
              <div class="preview-attraction-img">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="preview-attraction-content">
                <h4 class="preview-attraction-title">${item.name}</h4>
                <div class="preview-attraction-type">${item.type.join(', ')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    itineraryPreview.innerHTML = previewHtml;
  }
  
  /**
   * Preview an attraction in modal
   */
  function previewAttraction(attractionId) {
    // Find the attraction
    const attraction = [...allAttractions, ...allRestaurants].find(item => item.id === attractionId);
    if (!attraction) return;
    
    // Set modal content
    document.getElementById('activity-preview-image').src = attraction.image;
    document.getElementById('activity-preview-title').textContent = attraction.name;
    document.getElementById('activity-preview-type').textContent = attraction.type.join(', ');
    document.getElementById('activity-preview-price').textContent = '£' + attraction.cost;
    document.getElementById('activity-preview-description').textContent = attraction.description;
    document.getElementById('activity-preview-location').textContent = 'Brighton';
    
    // Set features if available
    const featuresContainer = document.getElementById('activity-preview-features');
    if (attraction.type.length > 0) {
      featuresContainer.innerHTML = `
        <div class="mb-2">Features:</div>
        <div class="activity-badges">
          ${attraction.type.map(feature => `
            <span class="activity-badge">${feature}</span>
          `).join('')}
        </div>
      `;
    } else {
      featuresContainer.innerHTML = '';
    }
    
    // Set button data attributes
    const addToItineraryBtn = document.getElementById('add-to-itinerary-btn');
    addToItineraryBtn.dataset.activityId = attractionId;
    
    // Suggest time slot based on type
    let suggestedTimeSlot = 'morning';
    if (attraction.type.includes('restaurant')) {
      suggestedTimeSlot = Math.random() > 0.5 ? 'evening' : 'afternoon';
    }
    addToItineraryBtn.dataset.timeSlot = suggestedTimeSlot;
    
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
    
    // Enable buttons
    saveItineraryBtn.disabled = false;
    addToCalendarBtn.disabled = false;
    
    // Show the itinerary results
    itineraryPreview.style.display = 'none';
    itineraryResults.style.display = 'block';
    
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
    
    // Check if itinerary is now empty
    const isEmpty = Object.values(currentItinerary).every(slot => Array.isArray(slot) && slot.length === 0);
    if (isEmpty) {
      // Disable buttons
      saveItineraryBtn.disabled = true;
      addToCalendarBtn.disabled = true;
      
      // Show preview instead
      itineraryPreview.style.display = 'block';
      itineraryResults.style.display = 'none';
    }
    
    showToast('Activity removed from your itinerary.', 'info');
  }
  
  /**
   * Update the itinerary UI
   */
  function updateItineraryUI() {
    // Update morning activities
    if (currentItinerary.morning.length === 0) {
      morningActivities.innerHTML = `<div class="empty-slot">No morning activities yet</div>`;
    } else {
      morningActivities.innerHTML = currentItinerary.morning.map(activity => createActivityCardHtml(activity)).join('');
    }
    
    // Update afternoon activities
    if (currentItinerary.afternoon.length === 0) {
      afternoonActivities.innerHTML = `<div class="empty-slot">No afternoon activities yet</div>`;
    } else {
      afternoonActivities.innerHTML = currentItinerary.afternoon.map(activity => createActivityCardHtml(activity)).join('');
    }
    
    // Update evening activities
    if (currentItinerary.evening.length === 0) {
      eveningActivities.innerHTML = `<div class="empty-slot">No evening activities yet</div>`;
    } else {
      eveningActivities.innerHTML = currentItinerary.evening.map(activity => createActivityCardHtml(activity)).join('');
    }
  }
  
  /**
   * Generate an activity card HTML
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
        <div class="activity-actions">
          <button class="activity-action-btn remove-activity" title="Remove from itinerary">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Save itinerary to localStorage
   */
  function saveItinerary() {
    const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
    
    // Check if itinerary for this date already exists
    const existingIndex = savedItineraries.findIndex(item => item.date === currentItinerary.date);
    
    if (existingIndex !== -1) {
      // Replace existing itinerary
      savedItineraries[existingIndex] = currentItinerary;
    } else {
      // Add new itinerary
      savedItineraries.push(currentItinerary);
    }
    
    // Save to localStorage
    localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
    
    showToast('Itinerary saved successfully!', 'success');
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
      title: activity.name,
      start: date,
      extendedProps: {
        time: timeString,
        location: 'Brighton',
        description: activity.description,
        activityType: activity.type.join(', ')
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
   * Utility to shuffle an array (Fisher-Yates algorithm)
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
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Setup accessibility features for custom checkboxes
   */
  function setupCustomCheckboxes(className) {
    const inputs = document.querySelectorAll(`.${className}`);
    
    inputs.forEach(input => {
      // Add keyboard handling for custom checkboxes
      input.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.checked = !this.checked;
          
          // Trigger change event
          const event = new Event('change');
          this.dispatchEvent(event);
        }
      });
      
      // Announce changes to screen readers
      input.addEventListener('change', function() {
        const label = this.nextElementSibling.textContent.trim();
        const state = this.checked ? 'selected' : 'unselected';
        announceToScreenReader(`${label} ${state}`);
      });
    });
  }
  
  /**
   * Validate the form before submission
   */
  function validateForm() {
    const visitDate = document.getElementById('visit-date').value;
    
    if (!visitDate) {
      showToast('Please select a date for your visit.', 'error');
      document.getElementById('visit-date').focus();
      announceToScreenReader('Error: Please select a date for your visit.');
      return false;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for proper comparison
    
    if (selectedDate < today) {
      showToast('Please select today or a future date.', 'error');
      document.getElementById('visit-date').focus();
      announceToScreenReader('Error: Please select today or a future date.');
      return false;
    }
    
    // Check if at least one activity is selected
    const activitySelected = 
      document.getElementById('activity-adventure').checked ||
      document.getElementById('activity-cultural').checked ||
      document.getElementById('activity-food').checked ||
      document.getElementById('activity-relaxation').checked ||
      document.getElementById('activity-shopping').checked;
      
    if (!activitySelected) {
      showToast('Please select at least one activity type.', 'error');
      document.getElementById('activity-adventure').focus();
      announceToScreenReader('Error: Please select at least one activity type.');
      return false;
    }
    
    // Check if at least one meal is selected
    const mealSelected = 
      document.getElementById('meal-breakfast').checked ||
      document.getElementById('meal-brunch').checked ||
      document.getElementById('meal-lunch').checked ||
      document.getElementById('meal-dinner').checked ||
      document.getElementById('meal-tea').checked;
      
    if (!mealSelected) {
      showToast('Please select at least one meal to plan.', 'error');
      document.getElementById('meal-breakfast').focus();
      announceToScreenReader('Error: Please select at least one meal to plan.');
      return false;
    }
    
    return true;
  }
  
  /**
   * Announce a message to screen readers
   */
  function announceToScreenReader(message) {
    // Check if we already have an announcer element
    let announcer = document.getElementById('screen-reader-announcer');
    
    if (!announcer) {
      // Create announcer element if it doesn't exist
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('role', 'status');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    // Set the message
    announcer.textContent = '';
    // Small delay to ensure screen readers register the change
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
  
  /**
   * Show toast notification
   */
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
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
  
  /**
   * Generate personalized itinerary based on user preferences
   */
  function generatePersonalizedItinerary(preferences) {
    // Clear existing content
    morningActivities.innerHTML = '';
    afternoonActivities.innerHTML = '';
    eveningActivities.innerHTML = '';

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

    // Generate morning activities
    const morningAttraction = filteredAttractions[0];
    if (morningAttraction) {
      morningActivities.innerHTML = createActivityCardHtml(morningAttraction);
    }

    // Generate afternoon activities
    const afternoonAttraction = filteredAttractions[1];
    if (afternoonAttraction) {
      afternoonActivities.innerHTML = createActivityCardHtml(afternoonAttraction);
    }

    // Generate evening activities
    const eveningAttraction = filteredAttractions[2];
    if (eveningAttraction) {
      eveningActivities.innerHTML = createActivityCardHtml(eveningAttraction);
    }

    // Add restaurants if meals are selected
    if (preferences.mealBreakfast || preferences.mealBrunch) {
      const breakfastPlace = filteredRestaurants.find(r => r.type.includes('breakfast') || r.type.includes('brunch'));
      if (breakfastPlace) {
        morningActivities.innerHTML += createActivityCardHtml(breakfastPlace);
      }
    }

    if (preferences.mealLunch) {
      const lunchPlace = filteredRestaurants.find(r => r.type.includes('lunch'));
      if (lunchPlace) {
        afternoonActivities.innerHTML += createActivityCardHtml(lunchPlace);
      }
    }

    if (preferences.mealDinner) {
      const dinnerPlace = filteredRestaurants.find(r => r.type.includes('dinner'));
      if (dinnerPlace) {
        eveningActivities.innerHTML += createActivityCardHtml(dinnerPlace);
      }
    }
  }
  
  // Initialize form validation
  setupFormValidation();
}); 