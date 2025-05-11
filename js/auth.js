/**
 * Authentication functionality for the GreenBrighton website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update authentication UI
    updateAuthUI();
    
    // Handle auth button clicks
    document.addEventListener('click', function(e) {
        const authButton = e.target.closest('.auth-button');
        if (authButton && localStorage.getItem('isLoggedIn') === 'true') {
            e.preventDefault();
            const username = localStorage.getItem('currentUser');
            const toastBody = document.querySelector('.toast-body');
            if (toastBody) {
                toastBody.textContent = `You are already signed in as ${username}!`;
                const authToast = bootstrap.Toast.getInstance(document.getElementById('authToast')) || 
                                  new bootstrap.Toast(document.getElementById('authToast'));
                authToast.show();
            }
        }
    });
    
    // Handle user sign out
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'auth-link' || e.target.id === 'auth-text') && localStorage.getItem('isLoggedIn') === 'true') {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userEmail');
                updateAuthUI();
                
                // Announce to screen readers that the user has signed out
                if (window.GreenBrighton && window.GreenBrighton.utils) {
                    window.GreenBrighton.utils.announceToScreenReader('You have been signed out successfully');
                }
                
                // Redirect to home page if on a restricted page
                if (window.location.pathname.includes('blogs.html')) {
                    window.location.href = 'index.html';
                }
            }
        }
    });
});

// Function to update auth UI
function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    const authText = document.getElementById('auth-text');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (!authLink || !authText) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('currentUser');
    
    if (isLoggedIn && username) {
        authLink.setAttribute('href', '#');
        authLink.setAttribute('aria-label', `${username} - Click to sign out`);
        authText.textContent = `${username} (Sign Out)`;
        
        // Update hero section if it exists
        if (heroButtons) {
            heroButtons.innerHTML = `
                <p class="welcome-text text-white mb-0" role="status">Welcome back, ${username}!</p>
                <a href="#attractions" class="btn btn-primary mt-3" role="button">Explore Attractions</a>
            `;
        }
    } else {
        authLink.setAttribute('href', 'signUp.html');
        authLink.setAttribute('aria-label', 'Sign in or create account');
        authText.textContent = 'Sign In';
        
        // Reset hero buttons if they exist
        if (heroButtons) {
            heroButtons.innerHTML = `
                <a href="signUp.html?action=signin" class="btn btn-primary auth-button" role="button" data-auth-action="signin" aria-label="Sign in to your account">Sign In</a>
                <a href="signUp.html?action=register" class="btn btn-secondary auth-button" role="button" data-auth-action="register" aria-label="Create a new account">Register</a>
            `;
        }
    }
} 