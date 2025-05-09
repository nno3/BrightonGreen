// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all Learn More buttons
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    
    // Display favorites on page load
    displayFavorites();
    
    // Add click event listener to each button
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get attraction details from data attributes
            const title = this.getAttribute('data-attraction-title');
            const imgSrc = this.getAttribute('data-attraction-img');
            const description = this.getAttribute('data-attraction-description');
            
            // Set modal content
            document.getElementById('modalAttractionTitle').textContent = title;
            document.getElementById('modalAttractionImg').src = imgSrc;
            document.getElementById('modalAttractionImg').alt = title;
            document.getElementById('modalAttractionDescription').textContent = description;
            
            // Set location (could be expanded to use real location data)
            document.getElementById('modalAttractionLocation').textContent = "Brighton & Hove Area";
            
            // Update map link with attraction name
            const viewOnMapBtn = document.getElementById('viewOnMapBtn');
            viewOnMapBtn.href = `map.html?attraction=${encodeURIComponent(title)}`;
            
            // Initialize Add to Favorites functionality
            initializeFavoriteButton(title);
            
            // Open the modal
            const attractionModal = new bootstrap.Modal(document.getElementById('attractionModal'));
            attractionModal.show();
        });
    });
    
    // Function to initialize the Add to Favorites button
    function initializeFavoriteButton(attractionTitle) {
        const favoriteBtn = document.getElementById('addToFavoritesBtn');
        const favorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '[]');
        const isAlreadyFavorite = favorites.includes(attractionTitle);
        
        // Update button text and icon based on favorite status
        if (isAlreadyFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Remove from Favorites';
            favoriteBtn.classList.remove('btn-outline-success');
            favoriteBtn.classList.add('btn-outline-danger');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart me-2"></i>Add to Favorites';
            favoriteBtn.classList.remove('btn-outline-danger');
            favoriteBtn.classList.add('btn-outline-success');
        }
        
        // Add click event listener to the favorite button
        favoriteBtn.onclick = function(e) {
            e.preventDefault();
            
            // Get current favorites from localStorage
            const favorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '[]');
            
            // Check if this attraction is already a favorite
            const index = favorites.indexOf(attractionTitle);
            
            // If already favorite, remove it; otherwise add it
            if (index !== -1) {
                // Remove from favorites
                favorites.splice(index, 1);
                favoriteBtn.innerHTML = '<i class="far fa-heart me-2"></i>Add to Favorites';
                favoriteBtn.classList.remove('btn-outline-danger');
                favoriteBtn.classList.add('btn-outline-success');
                
                // Show toast notification
                showToast(`${attractionTitle} removed from favorites`, 'warning');
            } else {
                // Add to favorites
                favorites.push(attractionTitle);
                favoriteBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Remove from Favorites';
                favoriteBtn.classList.remove('btn-outline-success');
                favoriteBtn.classList.add('btn-outline-danger');
                
                // Show toast notification
                showToast(`${attractionTitle} added to favorites`, 'success');
            }
            
            // Save updated favorites to localStorage
            localStorage.setItem('favoriteAttractions', JSON.stringify(favorites));
            
            // Update favorites display
            displayFavorites();
            
            // Check if user is signed in; if not, suggest signing in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                showToast('Sign in to sync your favorites across devices', 'info', 5000);
            }
        };
    }
    
    // Function to display favorites from localStorage
    function displayFavorites() {
        const favoritesContainer = document.getElementById('favorites-container');
        const noFavoritesMessage = document.getElementById('no-favorites-message');
        
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '[]');
        
        // Show/hide appropriate elements based on whether there are favorites
        if (favorites.length === 0) {
            noFavoritesMessage.style.display = 'block';
            favoritesContainer.style.display = 'none';
            return;
        } else {
            noFavoritesMessage.style.display = 'none';
            favoritesContainer.style.display = 'flex';
        }
        
        // Clear existing content
        favoritesContainer.innerHTML = '';
        
        // Get all attraction cards to find matching favorites
        const allAttractionButtons = document.querySelectorAll('.learn-more-btn');
        const attractionData = {};
        
        // Create a map of attraction data
        allAttractionButtons.forEach(button => {
            const title = button.getAttribute('data-attraction-title');
            const imgSrc = button.getAttribute('data-attraction-img');
            const description = button.getAttribute('data-attraction-description');
            
            attractionData[title] = {
                title: title,
                imgSrc: imgSrc,
                description: description
            };
        });
        
        // Create a card for each favorite
        favorites.forEach(favorite => {
            const data = attractionData[favorite];
            
            // Skip if we don't have data for this attraction
            if (!data) return;
            
            const shortDescription = data.description.length > 100 
                ? data.description.substring(0, 100) + '...' 
                : data.description;
            
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'col-md-4 mb-4';
            favoriteCard.innerHTML = `
                <div class="card h-100 favorite-card">
                    <img src="${data.imgSrc}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${shortDescription}</p>
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-between">
                        <button class="btn btn-sm btn-primary view-favorite" data-title="${data.title}">
                            <i class="fas fa-info-circle me-1"></i> Details
                        </button>
                        <button class="btn btn-sm btn-outline-danger remove-favorite" data-title="${data.title}">
                            <i class="fas fa-heart me-1"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            
            favoritesContainer.appendChild(favoriteCard);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.view-favorite').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                
                // Find the original learn more button for this attraction
                const originalButton = Array.from(allAttractionButtons).find(btn => 
                    btn.getAttribute('data-attraction-title') === title
                );
                
                if (originalButton) {
                    // Trigger a click on the original button to show details
                    originalButton.click();
                }
            });
        });
        
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                const favorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '[]');
                const index = favorites.indexOf(title);
                
                if (index !== -1) {
                    favorites.splice(index, 1);
                    localStorage.setItem('favoriteAttractions', JSON.stringify(favorites));
                    
                    // Update the display
                    displayFavorites();
                    
                    // Show toast notification
                    showToast(`${title} removed from favorites`, 'warning');
                }
            });
        });
    }
    
    // Function to show toast notifications
    function showToast(message, type = 'success', duration = 3000) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1070';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
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
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Initialize and show the toast
        const bsToast = new bootstrap.Toast(toast, {
            animation: true,
            autohide: true,
            delay: duration
        });
        bsToast.show();
        
        // Remove toast from DOM after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
}); 