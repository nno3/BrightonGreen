/**
 * Calendar preview functionality for the GreenBrighton website homepage
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize home page calendar preview if it exists
    initHomeCalendarPreview();
});

// Function to initialize the home page calendar preview
function initHomeCalendarPreview() {
    const calendarPreview = document.getElementById('home-calendar-preview');
    if (!calendarPreview) return;
    
    // Get saved events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Sort events by date (nearest first)
    const sortedEvents = savedEvents
        .filter(event => new Date(event.start) >= new Date()) // Only future events
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3); // Take only the first 3 events
    
    if (sortedEvents.length === 0) {
        // No upcoming events
        calendarPreview.innerHTML = `
            <div class="text-center p-3">
                <p class="mb-0 text-success">No upcoming events</p>
            </div>
        `;
    } else {
        // Create preview elements
        let html = '<div class="upcoming-events">';
        
        sortedEvents.forEach(event => {
            const eventDate = new Date(event.start);
            const formattedDate = eventDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
            });
            
            html += `
                <div class="preview-event">
                    <div class="preview-event-date">${formattedDate}</div>
                    <div class="preview-event-title">${event.title}</div>
                </div>
            `;
        });
        
        html += '</div>';
        calendarPreview.innerHTML = html;
        calendarPreview.setAttribute('aria-label', `${sortedEvents.length} upcoming events displayed`);
    }
} 