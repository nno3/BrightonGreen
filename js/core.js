/**
 * Core functionality for the GreenBrighton website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in effect to body when page loads
    document.body.classList.add('fade-in');
    
    // Initialize toast
    const authToast = document.getElementById('authToast');
    if (authToast) {
        new bootstrap.Toast(authToast);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // Skip if it's just "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate navbar height for accurate scrolling
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navbarHeight,
                    behavior: 'smooth'
                });
                
                // Set focus to the target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
    
    // Utility function to announce messages to screen readers
    function announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (!announcer) {
            const newAnnouncer = document.createElement('div');
            newAnnouncer.id = 'screen-reader-announcer';
            newAnnouncer.setAttribute('aria-live', 'polite');
            newAnnouncer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(newAnnouncer);
            
            // Set the message after a small delay to ensure it's read
            setTimeout(() => {
                newAnnouncer.textContent = message;
            }, 100);
        } else {
            // Clear the announcer and set the new message
            announcer.textContent = '';
            
            // Set the message after a small delay to ensure it's read
            setTimeout(() => {
                announcer.textContent = message;
            }, 100);
        }
    }
    
    // Create and show toast notifications
    function showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1080';
            document.body.appendChild(toastContainer);
        }
        
        // Create new toast element
        const toast = document.createElement('div');
        let bgColor = 'bg-success';
        
        if (type === 'error' || type === 'danger') {
            bgColor = 'bg-danger';
        } else if (type === 'warning') {
            bgColor = 'bg-warning';
        } else if (type === 'info') {
            bgColor = 'bg-info';
        }
        
        toast.className = `toast align-items-center text-white ${bgColor} border-0`;
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
        
        // Add to container and show
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Announce message to screen readers
        announceToScreenReader(message);
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
    
    // Export utility functions to global scope
    window.GreenBrighton = window.GreenBrighton || {};
    window.GreenBrighton.utils = {
        announceToScreenReader: announceToScreenReader,
        showToast: showToast
    };
}); 