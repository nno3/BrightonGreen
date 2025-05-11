/**
 * Attractions functionality for the GreenBrighton website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load attractions content if attractions-container exists
    const attractionsContainer = document.getElementById('attractions-container');
    if (attractionsContainer) {
        // Initialize attractions on the index page
        initializeAttractions();
    } else {
        // If we're directly on attractions.html or another page with the attractions already in DOM
        initializeAttractions();
    }
    
    // Initialize "Learn More" buttons functionality
    initializeLearnMoreButtons();
    
    // Initialize favorites functionality
    initializeFavorites();
});

// Function to initialize "Learn More" buttons
function initializeLearnMoreButtons() {
    // Get all "Learn More" buttons
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
    
    // Add click event listeners to each button
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get attraction data from button attributes
            const title = this.getAttribute('data-attraction-title');
            const image = this.getAttribute('data-attraction-img');
            const description = this.getAttribute('data-attraction-description');
            
            // Set modal content
            document.getElementById('modalAttractionTitle').textContent = title;
            document.getElementById('modalAttractionImg').src = image;
            document.getElementById('modalAttractionImg').alt = `Detailed view of ${title}`;
            document.getElementById('modalAttractionDescription').textContent = description;
            
            // Update the Add to Favorites button with the current item information
            const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
            
            // Store attraction data as custom attributes on the button
            addToFavoritesBtn.setAttribute('data-title', title);
            addToFavoritesBtn.setAttribute('data-image', image);
            addToFavoritesBtn.setAttribute('data-description', description);
            
            // Check if already a favorite and update button state
            updateFavoriteButtonState(title);
            
            // Set custom visitor information based on the attraction
            setAttractionVisitorInfo(title);
            
            // Determine if this is a restaurant or an attraction and set modal title accordingly
            const modalTitle = document.getElementById('attractionModalLabel');
            const isRestaurant = this.closest('.restaurant-card') !== null;
            modalTitle.textContent = isRestaurant ? 'Restaurant Details' : 'Attraction Details';
            
            // Show the modal
            const attractionModal = new bootstrap.Modal(document.getElementById('attractionModal'));
            attractionModal.show();
        });
    });
}

// Function to set custom visitor information for different attractions
function setAttractionVisitorInfo(attractionTitle) {
    // Default information
    let openingHours = "9:00 AM - 5:00 PM";
    let location = "Brighton";
    let transport = "Accessible by buses 5, 7, 12";
    
    // New restaurant-specific properties
    let dietaryOptions = "";
    let priceRange = "";
    let cuisineType = "";
    let specialFeatures = "";
    
    // Customize information based on attraction title
    switch(attractionTitle) {
        case "Seven Sisters Country Park":
            openingHours = "Always open (24/7 access)";
            location = "East Dean Road, Seaford BN25 4AB";
            transport = "Accessible by buses 12, 12A, 12X or South Downs Way";
            break;
        case "Brighton Palace Pier":
            openingHours = "10:00 AM - 10:00 PM (varies seasonally)";
            break;
        case "Royal Pavilion Gardens":
            openingHours = "8:00 AM - 6:00PM";
            break;
        // Add food establishments with detailed information
        case "Food for Friends":
            openingHours = "12:00 PM - 10:00 PM";
            location = "17-18 Prince Albert St, Brighton BN1 1HF";
            transport = "5 min walk from Brighton Station";
            dietaryOptions = "Vegetarian, Vegan, Gluten-Free options";
            priceRange = "££";
            cuisineType = "Modern Vegetarian";
            specialFeatures = "Locally-sourced produce, Seasonal menu, Dog-friendly";
            break;
        case "The Salt Room":
            openingHours = "12:00 PM - 10:30 PM";
            location = "106 Kings Road, Brighton BN1 2FU";
            transport = "10 min walk from Brighton Station";
            dietaryOptions = "Seafood, Gluten-Free options";
            priceRange = "£££";
            cuisineType = "British Seafood";
            specialFeatures = "Sustainable fishing, Ocean views, Award-winning";
            break;
        case "Lucky Beach Café":
            openingHours = "9:00 AM - 5:00 PM";
            location = "183 Kings Road Arches, Brighton BN1 1NB";
            transport = "15 min walk from Brighton Station";
            dietaryOptions = "Vegetarian, Vegan options, Organic";
            priceRange = "££";
            cuisineType = "Beach Café";
            specialFeatures = "Ocean-front dining, Sustainable practices, Child-friendly";
            break;
        case "The Chilli Pickle":
            openingHours = "12:00 PM - 10:00 PM";
            location = "17 Jubilee St, Brighton BN1 1GE";
            transport = "7 min walk from Brighton Station";
            dietaryOptions = "Vegetarian, Vegan, Halal options";
            priceRange = "££";
            cuisineType = "Regional Indian";
            specialFeatures = "Homemade spice blends, Award-winning, Authentic recipes";
            break;
        case "Metro Deco":
            openingHours = "11:00 AM - 5:00 PM";
            location = "38 Upper St James's St, Kemptown, Brighton BN2 1JN";
            transport = "20 min walk from Brighton Station";
            dietaryOptions = "Vegetarian, Vegan options, Gluten-Free available";
            priceRange = "£";
            cuisineType = "Vintage Tearoom";
            specialFeatures = "Art Deco styled, Afternoon tea specialists, Artisan teas";
            break;
        // Add other specific cases as needed
    }
    
    // Update the modal with the appropriate information
    document.getElementById('modalAttractionHours').textContent = openingHours;
    document.getElementById('modalAttractionLocation').textContent = location;
    document.getElementById('modalAttractionTransport').textContent = transport;
    
    // Check if it's a restaurant and update restaurant-specific info
    if (dietaryOptions) {
        // Create or update the dietary info section
        updateRestaurantSpecificInfo(dietaryOptions, priceRange, cuisineType, specialFeatures);
    } else {
        // Hide restaurant-specific sections if this is not a restaurant
        hideRestaurantSpecificInfo();
    }
}

// Function to update restaurant-specific information in the modal
function updateRestaurantSpecificInfo(dietaryOptions, priceRange, cuisineType, specialFeatures) {
    // Get the additional-info section
    const sustainabilitySection = document.querySelector('.sustainability-section');
    
    // Check if restaurant info section exists, if not create it
    let restaurantInfoSection = document.getElementById('restaurant-info-section');
    if (!restaurantInfoSection) {
        restaurantInfoSection = document.createElement('div');
        restaurantInfoSection.id = 'restaurant-info-section';
        restaurantInfoSection.className = 'restaurant-info mt-4';
        restaurantInfoSection.innerHTML = `
            <h4>Restaurant Highlights</h4>
            <div class="row g-3">
                <div class="col-md-12">
                    <div class="restaurant-badges mb-3">
                        <span id="cuisineBadge" class="badge bg-success me-2"><i class="fas fa-utensils me-1"></i> <span id="cuisineType"></span></span>
                        <span id="priceBadge" class="badge bg-secondary me-2"></span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-card">
                        <h5><i class="fas fa-leaf text-success me-2"></i>Dietary Options</h5>
                        <p id="dietaryOptions" class="mb-0"></p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-card">
                        <h5><i class="fas fa-star text-success me-2"></i>Features</h5>
                        <p id="specialFeatures" class="mb-0"></p>
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS for the new elements
        const style = document.createElement('style');
        style.textContent = `
            .info-card {
                background-color: rgba(192, 181, 150, 0.1);
                border-radius: 8px;
                padding: 12px;
                height: 100%;
            }
            .info-card h5 {
                font-size: 1rem;
                margin-bottom: 8px;
                color: var(--sage-green-dark);
            }
            .restaurant-badges .badge {
                font-size: 0.85rem;
                padding: 0.5rem 0.8rem;
            }
            #priceBadge.price-low { background-color: #28a745; }
            #priceBadge.price-medium { background-color: #fd7e14; }
            #priceBadge.price-high { background-color: #dc3545; }
        `;
        document.head.appendChild(style);
        
        // Insert it after the sustainability section
        sustainabilitySection.after(restaurantInfoSection);
    }
    
    // Show the restaurant info section
    restaurantInfoSection.style.display = 'block';
    
    // Update restaurant-specific information
    document.getElementById('cuisineType').textContent = cuisineType;
    
    // Update price badge with visual indicator
    const priceBadge = document.getElementById('priceBadge');
    let priceText = '';
    let priceClass = '';
    
    switch(priceRange) {
        case '£':
            priceText = '£ Budget-friendly';
            priceClass = 'price-low';
            break;
        case '££':
            priceText = '££ Mid-range';
            priceClass = 'price-medium';
            break;
        case '£££':
            priceText = '£££ High-end';
            priceClass = 'price-high';
            break;
        default:
            priceText = 'Price varies';
    }
    
    priceBadge.textContent = priceText;
    priceBadge.className = 'badge me-2 ' + priceClass;
    
    document.getElementById('dietaryOptions').textContent = dietaryOptions;
    document.getElementById('specialFeatures').textContent = specialFeatures;
    
    // Update sustainability features for restaurants
    const sustainabilityFeatures = document.getElementById('sustainabilityFeatures');
    if (sustainabilityFeatures) {
        sustainabilityFeatures.innerHTML = `
            <li><i class="fas fa-leaf text-success" aria-hidden="true"></i> Locally-sourced ingredients</li>
            <li><i class="fas fa-recycle text-success" aria-hidden="true"></i> Eco-friendly packaging</li>
            <li><i class="fas fa-seedling text-success" aria-hidden="true"></i> Seasonal menu options</li>
        `;
    }
}

// Function to hide restaurant-specific information
function hideRestaurantSpecificInfo() {
    const restaurantInfoSection = document.getElementById('restaurant-info-section');
    if (restaurantInfoSection) {
        restaurantInfoSection.style.display = 'none';
    }
    
    // Reset default sustainability features for non-restaurants
    const sustainabilityFeatures = document.getElementById('sustainabilityFeatures');
    if (sustainabilityFeatures) {
        sustainabilityFeatures.innerHTML = `
            <li><i class="fas fa-leaf text-success" aria-hidden="true"></i> Environmentally sustainable maintenance</li>
            <li><i class="fas fa-recycle text-success" aria-hidden="true"></i> Waste reduction initiatives</li>
            <li><i class="fas fa-seedling text-success" aria-hidden="true"></i> Support for local biodiversity</li>
        `;
    }
}

// Function to initialize attractions scrolling functionality
function initializeAttractions() {
    const attractionsContainer = document.querySelectorAll('.attractions-container');
    if (!attractionsContainer.length) return;
    
    attractionsContainer.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Mouse events for drag scrolling
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            container.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return; // Skip if more than one touch (pinch zoom)
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial cursor style
        container.style.cursor = 'grab';
        
        // Update indicator visibility on scroll
        container.addEventListener('scroll', function() {
            updateIndicatorVisibility(container);
        });
        
        // Initial visibility update
        updateIndicatorVisibility(container);
    });
    
    // Add event listeners for the indicators
    document.querySelectorAll('.left-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            // Find the nearest attractions container
            const container = this.closest('.scrollable-attractions').querySelector('.attractions-container');
            scrollAttractions(container, 'left');
        });
    });
    
    document.querySelectorAll('.right-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            // Find the nearest attractions container
            const container = this.closest('.scrollable-attractions').querySelector('.attractions-container');
            scrollAttractions(container, 'right');
        });
    });
}

// Function to scroll attractions
function scrollAttractions(container, direction) {
    const scrollAmount = 300; // Adjust as needed
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
        container.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Function to update indicator visibility
function updateIndicatorVisibility(container) {
    const scrollableSection = container.closest('.scrollable-attractions');
    if (!scrollableSection) return;
    
    const leftIndicator = scrollableSection.querySelector('.left-indicator');
    const rightIndicator = scrollableSection.querySelector('.right-indicator');
    if (!leftIndicator || !rightIndicator) return;
    
    // Show/hide left indicator based on scroll position
    if (container.scrollLeft <= 10) {
        leftIndicator.style.opacity = '0.4';
        leftIndicator.style.pointerEvents = 'none';
    } else {
        leftIndicator.style.opacity = '0.8';
        leftIndicator.style.pointerEvents = 'auto';
    }
    
    // Show/hide right indicator based on scroll position
    const maxScrollLeft = container.scrollWidth - container.clientWidth - 10;
    
    if (container.scrollLeft >= maxScrollLeft) {
        rightIndicator.style.opacity = '0.4';
        rightIndicator.style.pointerEvents = 'none';
    } else {
        rightIndicator.style.opacity = '0.8';
        rightIndicator.style.pointerEvents = 'auto';
    }
}

// Initialize favorites functionality
function initializeFavorites() {
    const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
    if (!addToFavoritesBtn) return;
    
    addToFavoritesBtn.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const image = this.getAttribute('data-image');
        const description = this.getAttribute('data-description');
        
        if (!title || !image) {
            console.error('Missing data for favorites');
            return;
        }
        
        // Toggle favorite status
        toggleFavorite(title, image, description);
        
        // Update button appearance
        updateFavoriteButtonState(title);
        
        // Update the favorites display
        displayFavorites();
    });
    
    // Display any existing favorites on page load
    displayFavorites();
}

// Function to toggle favorite status
function toggleFavorite(title, image, description) {
    // Get existing favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Check if this item is already a favorite
    const existingIndex = favorites.findIndex(item => item.title === title);
    
    if (existingIndex >= 0) {
        // Already a favorite, so remove it
        favorites.splice(existingIndex, 1);
        showToast(`${title} removed from favorites`);
    } else {
        // Not a favorite, so add it
        favorites.push({
            title: title,
            image: image,
            description: description.substring(0, 100) + (description.length > 100 ? '...' : '')
        });
        showToast(`${title} added to favorites`);
    }
    
    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to update favorite button state
function updateFavoriteButtonState(title) {
    const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
    if (!addToFavoritesBtn) return;
    
    // Get existing favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Check if this item is already a favorite
    const isFavorite = favorites.some(item => item.title === title);
    
    // Update button appearance
    if (isFavorite) {
        addToFavoritesBtn.innerHTML = '<i class="fas fa-heart me-2" aria-hidden="true"></i>Remove from Favorites';
        addToFavoritesBtn.classList.add('btn-danger');
        addToFavoritesBtn.classList.remove('btn-outline-success');
    } else {
        addToFavoritesBtn.innerHTML = '<i class="far fa-heart me-2" aria-hidden="true"></i>Add to Favorites';
        addToFavoritesBtn.classList.remove('btn-danger');
        addToFavoritesBtn.classList.add('btn-outline-success');
    }
}

// Function to display favorites
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('no-favorites-message');
    
    if (!favoritesContainer || !noFavoritesMessage) return;
    
    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Show/hide appropriate elements based on favorites count
    if (favorites.length === 0) {
        favoritesContainer.style.display = 'none';
        noFavoritesMessage.style.display = 'block';
        return;
    } else {
        favoritesContainer.style.display = 'flex';
        noFavoritesMessage.style.display = 'none';
    }
    
    // Clear existing favorites
    favoritesContainer.innerHTML = '';
    
    // Add each favorite
    favorites.forEach(favorite => {
        // Fix for image paths - ensure the path exists
        let imagePath = favorite.image;
        
        // Check if image exists in the DOM to ensure it's valid
        if (!imageExists(imagePath)) {
            // If image doesn't exist, try to find an alternative by correcting extension
            if (imagePath.endsWith('.jpg')) {
                const alternativePath = imagePath.replace('.jpg', '.jpeg');
                if (imageExists(alternativePath)) {
                    imagePath = alternativePath;
                }
            } else if (imagePath.endsWith('.jpeg')) {
                const alternativePath = imagePath.replace('.jpeg', '.jpg');
                if (imageExists(alternativePath)) {
                    imagePath = alternativePath;
                }
            }
        }
        
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'col-md-4 mb-4';
        
        favoriteCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imagePath}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${favorite.title}">
                <div class="card-body">
                    <h5 class="card-title">${favorite.title}</h5>
                    <p class="card-text">${favorite.description}</p>
                    <div class="btn-actions">
                        <button class="btn btn-sm btn-primary view-favorite" data-title="${favorite.title}">
                            <i class="fas fa-eye me-1"></i> View Details
                        </button>
                        <button class="btn btn-sm btn-outline-danger remove-favorite" data-title="${favorite.title}">
                            <i class="fas fa-trash-alt me-1"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        favoritesContainer.appendChild(favoriteCard);
    });
    
    // Add event listeners for view and remove buttons
    document.querySelectorAll('.view-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            // Find the original learn more button for this attraction
            const originalButton = document.querySelector(`.learn-more-btn[data-attraction-title="${title}"]`);
            if (originalButton) {
                originalButton.click();
            }
        });
    });
    
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            // Remove from favorites
            toggleFavorite(title, '', '');
            // Update display
            displayFavorites();
        });
    });
}

// Helper function to check if an image exists
function imageExists(url) {
    // Check if the URL exists in any img src in the DOM
    const images = document.querySelectorAll('img');
    for (let i = 0; i < images.length; i++) {
        if (images[i].src.includes(url)) {
            return true;
        }
    }
    
    // Check for learn-more buttons with this image path
    const buttons = document.querySelectorAll('.learn-more-btn');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-attraction-img') === url) {
            return true;
        }
    }
    
    return false;
}

// Function to show a toast notification
function showToast(message) {
    // Check if we already have a toast container
    let toastContainer = document.querySelector('.toast-container');
    
    // If not, create one
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create a new toast
    const toastId = 'toast-' + Date.now();
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.id = toastId;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">GreenBrighton</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastElement);
    
    // Initialize and show the toast
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000
    });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Handle attraction filtering on the dedicated attractions page
function filterAttractions(category) {
    const allCards = document.querySelectorAll('.attraction-card');
    
    // If no category or 'all', show all attractions
    if (!category || category === 'all') {
        allCards.forEach(card => {
            card.style.display = 'flex';
        });
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        
        return;
    }
    
    // Otherwise filter by category
    allCards.forEach(card => {
        if (card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
}

// Export to global namespace
window.filterAttractions = filterAttractions; 