// Trip Planner functionality for GreenBrighton website

document.addEventListener('DOMContentLoaded', function() {
    initializeTripPlanner();
});

function initializeTripPlanner() {
    // Initialize time pickers
    initializeTimePickers();
    
    // Initialize budget slider
    initializeBudgetSlider();
    
    // Initialize date picker
    initializeDatePicker();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize activity selection
    initializeActivitySelection();
}

function initializeTimePickers() {
    // Initialize start time and end time pickers
    const timeInputs = document.querySelectorAll('.time-picker');
    timeInputs.forEach(input => {
        input.addEventListener('change', validateTimeRange);
    });
}

function initializeBudgetSlider() {
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValue = document.getElementById('budget-value');
    
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            budgetValue.textContent = `£${this.value}`;
        });
    }
}

function initializeDatePicker() {
    const datePicker = document.getElementById('trip-date');
    if (datePicker) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        datePicker.min = today;
        
        // Initialize flatpickr
        flatpickr(datePicker, {
            minDate: "today",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates) {
                validateDate(selectedDates[0]);
            }
        });
    }
}

function validateTimeRange() {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        if (end <= start) {
            showError('End time must be after start time');
            return false;
        }
    }
    return true;
}

function validateDate(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showError('Please select a future date');
        return false;
    }
    return true;
}

function initializeActivitySelection() {
    const activityCheckboxes = document.querySelectorAll('.activity-checkbox');
    activityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateRecommendations();
        });
    });
}

function updateRecommendations() {
    const selectedActivities = getSelectedActivities();
    const budget = document.getElementById('budget-slider').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    
    // Generate itinerary based on selections
    generateItinerary(selectedActivities, budget, startTime, endTime);
}

function getSelectedActivities() {
    const checkboxes = document.querySelectorAll('.activity-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function generateItinerary(activities, budget, startTime, endTime) {
    // Sample activities database (in real implementation, this would come from a backend)
    const activitiesDB = {
        'cultural': [
            {
                name: 'Brighton Palace Pier',
                duration: 120,
                cost: 0,
                timeSlots: ['9:00', '10:00', '11:00']
            },
            {
                name: 'Royal Pavilion',
                duration: 90,
                cost: 15,
                timeSlots: ['10:00', '11:00', '12:00']
            }
        ],
        'food': [
            {
                name: 'The Salt Room',
                duration: 90,
                cost: 40,
                timeSlots: ['12:00', '13:00', '14:00']
            },
            {
                name: 'The Coal Shed',
                duration: 90,
                cost: 35,
                timeSlots: ['17:00', '18:00', '19:00']
            }
        ],
        'relaxation': [
            {
                name: 'Brighton Beach',
                duration: 120,
                cost: 0,
                timeSlots: ['9:00', '10:00', '11:00']
            }
        ]
    };
    
    // Generate schedule based on preferences
    const schedule = createSchedule(activities, budget, startTime, endTime, activitiesDB);
    displaySchedule(schedule);
}

function createSchedule(activities, budget, startTime, endTime, activitiesDB) {
    let schedule = [];
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const endDateTime = new Date(`2000-01-01T${endTime}`);
    let totalCost = 0;
    
    activities.forEach(activityType => {
        const availableActivities = activitiesDB[activityType] || [];
        
        availableActivities.forEach(activity => {
            if (currentTime < endDateTime && totalCost + activity.cost <= budget) {
                const activityEnd = new Date(currentTime.getTime() + activity.duration * 60000);
                
                if (activityEnd <= endDateTime) {
                    schedule.push({
                        time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        activity: activity.name,
                        duration: activity.duration,
                        cost: activity.cost
                    });
                    
                    currentTime = activityEnd;
                    totalCost += activity.cost;
                }
            }
        });
    });
    
    return schedule;
}

function displaySchedule(schedule) {
    const scheduleContainer = document.getElementById('schedule-container');
    if (!scheduleContainer) return;
    
    let html = '<div class="schedule-timeline">';
    
    schedule.forEach(item => {
        html += `
            <div class="schedule-item">
                <div class="schedule-time">${item.time}</div>
                <div class="schedule-activity">
                    <h4>${item.activity}</h4>
                    <p>Duration: ${item.duration} minutes</p>
                    <p>Cost: £${item.cost}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    scheduleContainer.innerHTML = html;
}

function initializeFormSubmission() {
    const plannerForm = document.getElementById('trip-planner-form');
    if (plannerForm) {
        plannerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            // Process form and generate itinerary
            updateRecommendations();
            
            // Show success message
            showSuccess('Your itinerary has been generated!');
        });
    }
}

function validateForm() {
    const requiredFields = ['trip-date', 'start-time', 'end-time'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value) {
            showError(`Please fill in all required fields`);
            isValid = false;
        }
    });
    
    if (!getSelectedActivities().length) {
        showError('Please select at least one activity');
        isValid = false;
    }
    
    return isValid && validateTimeRange();
}

function showError(message) {
    const toast = new bootstrap.Toast(document.getElementById('error-toast'));
    document.getElementById('error-message').textContent = message;
    toast.show();
}

function showSuccess(message) {
    const toast = new bootstrap.Toast(document.getElementById('success-toast'));
    document.getElementById('success-message').textContent = message;
    toast.show();
}

// Export functions for global use
window.initializeTripPlanner = initializeTripPlanner; 