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
    // Load preferences from localStorage
    const preferencesStr = localStorage.getItem('itineraryPreferences');
    
    if (!preferencesStr) {
      showNoPreferencesMessage();
      return;
    }
    
    try {
      const preferences = JSON.parse(preferencesStr);
      
      // Fetch attractions data first, then generate itinerary
      fetchAttractions().then(() => {
        generatePersonalizedItinerary(preferences);
      }).catch(error => {
        console.error('Error fetching attractions:', error);
        showToast('Error loading attractions. Please try again later.', 'error');
      });
      
    } catch (error) {
      console.error('Error parsing preferences:', error);
      showNoPreferencesMessage();
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
   * Show message when no preferences are found
   */
  function showNoPreferencesMessage() {
    const container = document.querySelector('.planner-card-body');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading"><i class="fas fa-exclamation-circle me-2"></i>No Preferences Found</h4>
          <p>We couldn't find your preferences for generating an itinerary.</p>
          <hr>
          <p class="mb-0">Please <a href="itinerary-planner.html" class="alert-link">return to the planner</a> to set your preferences.</p>
        </div>
      `;
    }
  }
  
  /**
   * Fetch attractions from attractions.html
   */
  async function fetchAttractions() {
    try {
      const response = await fetch('attractions.html');
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract regular attractions
      const attractionCards = doc.querySelectorAll('.attraction-card:not(.restaurant-card)');
      attractionCards.forEach((card, index) => {
        const learnMoreBtn = card.querySelector('.learn-more-btn');
        if (learnMoreBtn) {
          const price = learnMoreBtn.getAttribute('data-attraction-price') || '££';
          
          // Remove £ signs from price
          const cleanPrice = price.replace(/£/g, '');
          
          allAttractions.push({
            id: `attraction-${index}`,
            title: learnMoreBtn.getAttribute('data-attraction-title'),
            image: learnMoreBtn.getAttribute('data-attraction-img'),
            description: learnMoreBtn.getAttribute('data-attraction-description'),
            type: 'attraction',
            price: cleanPrice, // Store price without £ signs
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
          
          // Get price indicator and remove £ signs
          let price = '2';
          const priceIndicator = card.querySelector('.price-indicator');
          if (priceIndicator) {
            price = priceIndicator.textContent.trim().split(' ')[0].replace(/£/g, '');
          }
          
          allRestaurants.push({
            id: `restaurant-${index}`,
            title: learnMoreBtn.getAttribute('data-attraction-title'),
            image: learnMoreBtn.getAttribute('data-attraction-img'),
            description: learnMoreBtn.getAttribute('data-attraction-description'),
            type: 'restaurant',
            price: price, // Store price without £ signs
            location: 'Brighton',
            features: features,
            timeEstimate: '1.5 hours'
          });
        }
      });
      
      console.log('Loaded attractions:', allAttractions.length);
      console.log('Loaded restaurants:', allRestaurants.length);
      
    } catch (error) {
      console.error('Error fetching attractions:', error);
      throw error;
    }
  }
  
  /**
   * Generate personalized itinerary based on user preferences
   */
  function generatePersonalizedItinerary(preferences) {
    // Reset current itinerary
    currentItinerary = {
      date: preferences.visitDate,
      morning: [],
      afternoon: [],
      evening: []
    };
    
    // Filter attractions based on preferences
    let filteredAttractions = [...allAttractions];
    let filteredRestaurants = [...allRestaurants];
    
    // Filter by budget
    const budgetNum = parseInt(preferences.budget);
    const lowBudget = budgetNum <= 500;
    const midBudget = budgetNum > 500 && budgetNum <= 1200;
    const highBudget = budgetNum > 1200;
    
    // Budget-based filtering
    if (lowBudget) {
      // Filter for low-cost attractions and restaurants
      filteredAttractions = filteredAttractions.filter(a => a.price === '1' || a.price === '2');
      filteredRestaurants = filteredRestaurants.filter(r => r.price === '1' || r.price === '2');
    } else if (midBudget) {
      // Include mid-range attractions and restaurants
      filteredAttractions = filteredAttractions.filter(a => a.price === '2' || a.price === '3');
      filteredRestaurants = filteredRestaurants.filter(r => r.price === '2' || r.price === '3');
    } else if (highBudget) {
      // Include high-end options
      filteredAttractions = filteredAttractions.filter(a => a.price === '3' || a.price === '4');
      filteredRestaurants = filteredRestaurants.filter(r => r.price === '3' || r.price === '4');
    }
    
    // Apply activity preferences
    if (preferences.activityAdventure || preferences.activityCultural || 
        preferences.activityFood || preferences.activityRelaxation || 
        preferences.activityShopping) {
      
      // Create a new filtered list based on preferences
      const tempFilteredAttractions = [];
      
      for (const attraction of filteredAttractions) {
        const title = attraction.title.toLowerCase();
        const description = attraction.description.toLowerCase();
        
        // Match adventure activities
        if (preferences.activityAdventure && 
            (title.includes('hike') || title.includes('adventure') || 
             description.includes('hike') || description.includes('adventure') ||
             description.includes('outdoors') || description.includes('nature') ||
             description.includes('water sport') || description.includes('trail'))) {
          tempFilteredAttractions.push(attraction);
          continue;
        }
        
        // Match cultural activities
        if (preferences.activityCultural && 
            (title.includes('museum') || title.includes('gallery') || 
             title.includes('history') || title.includes('art') || 
             description.includes('museum') || description.includes('gallery') ||
             description.includes('history') || description.includes('art') ||
             description.includes('cultural') || description.includes('historic'))) {
          tempFilteredAttractions.push(attraction);
          continue;
        }
        
        // Match food & drink activities
        if (preferences.activityFood && 
            (title.includes('food') || title.includes('eating') || 
             title.includes('tasting') || title.includes('culinary') || 
             description.includes('food') || description.includes('eating') ||
             description.includes('tasting') || description.includes('culinary'))) {
          tempFilteredAttractions.push(attraction);
          continue;
        }
        
        // Match relaxation activities
        if (preferences.activityRelaxation && 
            (title.includes('beach') || title.includes('relax') || 
             title.includes('spa') || title.includes('wellness') || 
             description.includes('beach') || description.includes('relax') ||
             description.includes('spa') || description.includes('wellness'))) {
          tempFilteredAttractions.push(attraction);
          continue;
        }
        
        // Match shopping activities
        if (preferences.activityShopping && 
            (title.includes('shop') || title.includes('market') || 
             title.includes('store') || title.includes('mall') || 
             description.includes('shop') || description.includes('market') ||
             description.includes('store') || description.includes('mall'))) {
          tempFilteredAttractions.push(attraction);
          continue;
        }
      }
      
      // Replace the filtered attractions with our preference-filtered list
      if (tempFilteredAttractions.length > 0) {
        filteredAttractions = tempFilteredAttractions;
      }
    }
    
    // Apply dietary preferences to restaurants
    if (preferences.dietaryVegetarian || preferences.dietaryVegan || 
        preferences.dietaryHalal || preferences.dietaryFastFood || 
        preferences.dietaryFineDining) {
      
      const tempFilteredRestaurants = [];
      
      for (const restaurant of filteredRestaurants) {
        const title = restaurant.title.toLowerCase();
        const description = restaurant.description.toLowerCase();
        const features = restaurant.features.map(f => f.toLowerCase());
        
        // Match vegetarian options
        if (preferences.dietaryVegetarian && 
            (title.includes('vegetarian') || description.includes('vegetarian') ||
             features.some(f => f.includes('vegetarian')))) {
          tempFilteredRestaurants.push(restaurant);
          continue;
        }
        
        // Match vegan options
        if (preferences.dietaryVegan && 
            (title.includes('vegan') || description.includes('vegan') ||
             features.some(f => f.includes('vegan')))) {
          tempFilteredRestaurants.push(restaurant);
          continue;
        }
        
        // Match halal options
        if (preferences.dietaryHalal && 
            (title.includes('halal') || description.includes('halal') ||
             features.some(f => f.includes('halal')))) {
          tempFilteredRestaurants.push(restaurant);
          continue;
        }
        
        // Match fast food options
        if (preferences.dietaryFastFood && 
            (title.includes('fast') || description.includes('fast food') ||
             features.some(f => f.includes('fast')) || title.includes('quick') ||
             description.includes('quick'))) {
          tempFilteredRestaurants.push(restaurant);
          continue;
        }
        
        // Match fine dining options
        if (preferences.dietaryFineDining && 
            (title.includes('fine') || description.includes('fine dining') ||
             features.some(f => f.includes('fine dining')) || 
             description.includes('gourmet') || features.some(f => f.includes('award')))) {
          tempFilteredRestaurants.push(restaurant);
          continue;
        }
      }
      
      // Replace the filtered restaurants with our preference-filtered list
      if (tempFilteredRestaurants.length > 0) {
        filteredRestaurants = tempFilteredRestaurants;
      }
    }
    
    // Shuffle the filtered lists for variety
    filteredAttractions = shuffleArray(filteredAttractions);
    filteredRestaurants = shuffleArray(filteredRestaurants);
    
    // If we don't have enough activities after filtering, add back some original ones
    if (filteredAttractions.length < 3) {
      const additionalAttractions = allAttractions.filter(a => 
        !filteredAttractions.some(fa => fa.id === a.id));
      filteredAttractions = filteredAttractions.concat(shuffleArray(additionalAttractions).slice(0, 5));
    }
    
    if (filteredRestaurants.length < 3) {
      const additionalRestaurants = allRestaurants.filter(r => 
        !filteredRestaurants.some(fr => fr.id === r.id));
      filteredRestaurants = filteredRestaurants.concat(shuffleArray(additionalRestaurants).slice(0, 5));
    }
    
    // Add attractions to morning/afternoon slots
    const morningAttractions = filteredAttractions.slice(0, 2);
    const afternoonAttractions = filteredAttractions.slice(2, 4);
    
    // Add restaurants based on meal preferences
    if (preferences.mealBreakfast) {
      // Add breakfast option to morning
      const breakfastPlace = filteredRestaurants.find(r => 
        r.title.toLowerCase().includes('breakfast') || 
        r.description.toLowerCase().includes('breakfast'));
      
      if (breakfastPlace) {
        currentItinerary.morning.unshift(breakfastPlace);
      } else if (filteredRestaurants.length > 0) {
        currentItinerary.morning.unshift(filteredRestaurants[0]);
      }
    }
    
    if (preferences.mealBrunch) {
      // Add brunch option to late morning
      const brunchPlace = filteredRestaurants.find(r => 
        r.title.toLowerCase().includes('brunch') || 
        r.description.toLowerCase().includes('brunch'));
      
      if (brunchPlace) {
        currentItinerary.morning.push(brunchPlace);
      } else if (filteredRestaurants.length > 1) {
        currentItinerary.morning.push(filteredRestaurants[1]);
      }
    }
    
    if (preferences.mealLunch) {
      // Add lunch option to afternoon
      const lunchPlace = filteredRestaurants.find(r => 
        r.title.toLowerCase().includes('lunch') || 
        r.description.toLowerCase().includes('lunch'));
      
      if (lunchPlace) {
        currentItinerary.afternoon.unshift(lunchPlace);
      } else if (filteredRestaurants.length > 2) {
        currentItinerary.afternoon.unshift(filteredRestaurants[2]);
      }
    }
    
    if (preferences.mealTea) {
      // Add tea/coffee option to afternoon
      const teaPlace = filteredRestaurants.find(r => 
        r.title.toLowerCase().includes('tea') || r.title.toLowerCase().includes('coffee') ||
        r.description.toLowerCase().includes('tea') || r.description.toLowerCase().includes('coffee'));
      
      if (teaPlace) {
        currentItinerary.afternoon.push(teaPlace);
      } else if (filteredRestaurants.length > 3) {
        currentItinerary.afternoon.push(filteredRestaurants[3]);
      }
    }
    
    if (preferences.mealDinner) {
      // Add dinner option to evening
      const dinnerPlace = filteredRestaurants.find(r => 
        r.title.toLowerCase().includes('dinner') || 
        r.description.toLowerCase().includes('dinner'));
      
      if (dinnerPlace) {
        currentItinerary.evening.unshift(dinnerPlace);
      } else if (filteredRestaurants.length > 4) {
        currentItinerary.evening.unshift(filteredRestaurants[4]);
      }
    }
    
    // Add remaining attractions
    currentItinerary.morning = currentItinerary.morning.concat(morningAttractions);
    currentItinerary.afternoon = currentItinerary.afternoon.concat(afternoonAttractions);
    
    // Add evening entertainment
    if (filteredAttractions.length > 4) {
      const eveningActivity = filteredAttractions.find(a => 
        a.title.toLowerCase().includes('show') || a.title.toLowerCase().includes('theater') ||
        a.title.toLowerCase().includes('cinema') || a.title.toLowerCase().includes('concert') ||
        a.description.toLowerCase().includes('show') || a.description.toLowerCase().includes('theater') ||
        a.description.toLowerCase().includes('cinema') || a.description.toLowerCase().includes('concert'));
      
      if (eveningActivity) {
        currentItinerary.evening.push(eveningActivity);
      } else {
        currentItinerary.evening.push(filteredAttractions[4]);
      }
    }
    
    // Update the UI
    updateItineraryUI();
    
    // Update itinerary summary
    updateItinerarySummary(preferences);
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
  }
  
  /**
   * Update the itinerary summary
   */
  function updateItinerarySummary(preferences) {
    if (!itinerarySummary) return;
    
    // Format date
    const dateObj = new Date(preferences.visitDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // Count activities
    const totalActivities = currentItinerary.morning.length + 
                            currentItinerary.afternoon.length + 
                            currentItinerary.evening.length;
                            
    // Count restaurants
    const restaurants = [
      ...currentItinerary.morning,
      ...currentItinerary.afternoon,
      ...currentItinerary.evening
    ].filter(item => item.type === 'restaurant').length;
    
    // Create the summary HTML
    const summaryHtml = `
      <div class="alert alert-success mb-4">
        <h4 class="alert-heading"><i class="fas fa-calendar-day me-2"></i>${formattedDate}</h4>
        <p>Your personalized itinerary includes ${totalActivities} activities and ${restaurants} dining options.</p>
        <p class="mb-0"><small>Start time: ${preferences.startTime} | End time: ${preferences.endTime}</small></p>
      </div>
    `;
    
    itinerarySummary.innerHTML = summaryHtml;
  }
  
  /**
   * Generate an activity card HTML
   */
  function createActivityCardHtml(activity) {
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
            ${activity.price ? `<span class="activity-badge">${activity.price}</span>` : ''}
            ${activity.features.slice(0, 2).map(feature => `<span class="activity-badge">${feature}</span>`).join('')}
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
    
    // Update summary
    updateItinerarySummary();
  }
  
  /**
   * Remove activity from the current itinerary
   */
  function removeActivityFromItinerary(activityId, timeSlot) {
    // Filter out the activity
    currentItinerary[timeSlot] = currentItinerary[timeSlot].filter(item => item.id !== activityId);
    
    // Update UI
    updateItineraryUI();
    
    // Update summary
    updateItinerarySummary();
    
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
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
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
}); 