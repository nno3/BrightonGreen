// Example of a simple jQuery script
$(document).ready(function() {
  $("#alertButton").click(function() {
    alert("Hello, this is a custom jQuery alert!");
  });
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in effect to body when page loads
    document.body.classList.add('fade-in');
    
    // Update authentication UI
    updateAuthUI();
    
    // Initialize toast
    const authToast = document.getElementById('authToast');
    if (authToast) {
        new bootstrap.Toast(authToast);
    }
    
    // Initialize home page calendar preview if it exists
    initHomeCalendarPreview();
    
    // Initialize text-to-speech functionality
    initTextToSpeech();
    
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
                announceToScreenReader('You have been signed out successfully');
                
                // Redirect to home page if on a restricted page
                if (window.location.pathname.includes('blogs.html')) {
                    window.location.href = 'index.html';
                }
            }
        }
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
    
    // Load attractions content if attractions-container exists
    const attractionsContainer = document.getElementById('attractions-container');
    if (attractionsContainer) {
        // Initialize attractions on the index page
        initializeAttractions();
    } else {
        // If we're directly on attractions.html or another page with the attractions already in DOM
        initializeAttractions();
    }
    
    // Function to initialize attractions scrolling functionality
    function initializeAttractions() {
        const attractionsContainer = document.querySelector('.attractions-container');
        if (!attractionsContainer) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Mouse events for drag scrolling
        attractionsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            attractionsContainer.style.cursor = 'grabbing';
            startX = e.pageX - attractionsContainer.offsetLeft;
            scrollLeft = attractionsContainer.scrollLeft;
        });
        
        attractionsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            attractionsContainer.style.cursor = 'grab';
        });
        
        attractionsContainer.addEventListener('mouseup', () => {
            isDown = false;
            attractionsContainer.style.cursor = 'grab';
        });
        
        attractionsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - attractionsContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            attractionsContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial cursor style
        attractionsContainer.style.cursor = 'grab';
        
        // Scroll indicators functionality
        const leftIndicator = document.querySelector('.left-indicator');
        const rightIndicator = document.querySelector('.right-indicator');
        
        if (leftIndicator && rightIndicator) {
            // Add keyboard support for scroll indicators
            leftIndicator.tabIndex = 0;
            rightIndicator.tabIndex = 0;
            
            // Add keyboard event listeners
            leftIndicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollAttractions('left');
                }
            });
            
            rightIndicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollAttractions('right');
                }
            });
            
            // Scroll left when clicking left indicator
            leftIndicator.addEventListener('click', () => {
                scrollAttractions('left');
            });
            
            // Scroll right when clicking right indicator
            rightIndicator.addEventListener('click', () => {
                scrollAttractions('right');
            });
            
            // Function to scroll attractions in specified direction
            function scrollAttractions(direction) {
                const scrollAmount = direction === 'left' ? -300 : 300;
                attractionsContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
                
                // Announce scrolling to screen readers
                const message = direction === 'left' ? 'Scrolled to previous attractions' : 'Scrolled to next attractions';
                announceToScreenReader(message);
            }
            
            // Update indicator visibility based on scroll position
            function updateIndicatorVisibility() {
                // Show/hide left indicator based on scroll position
                if (attractionsContainer.scrollLeft <= 10) {
                    leftIndicator.style.opacity = '0.3';
                    leftIndicator.setAttribute('aria-disabled', 'true');
                } else {
                    leftIndicator.style.opacity = '0.8';
                    leftIndicator.setAttribute('aria-disabled', 'false');
                }
                
                // Show/hide right indicator based on scroll position
                const maxScrollLeft = attractionsContainer.scrollWidth - attractionsContainer.clientWidth - 10;
                if (attractionsContainer.scrollLeft >= maxScrollLeft) {
                    rightIndicator.style.opacity = '0.3';
                    rightIndicator.setAttribute('aria-disabled', 'true');
                } else {
                    rightIndicator.style.opacity = '0.8';
                    rightIndicator.setAttribute('aria-disabled', 'false');
                }
            }
            
            // Initial check
            updateIndicatorVisibility();
            
            // Check on scroll
            attractionsContainer.addEventListener('scroll', updateIndicatorVisibility);
        }
    }
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else if (linkHref !== '#' && currentPage.includes(linkHref)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Helper function to announce messages to screen readers
    function announceToScreenReader(message) {
        // Check if an existing announcer exists, if not create one
        let announcer = document.getElementById('screen-reader-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'screen-reader-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.setAttribute('class', 'visually-hidden');
            document.body.appendChild(announcer);
        }
        
        // Set the message to be announced
        announcer.textContent = message;
        
        // Clear the announcer after a delay to prepare for next announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 5000);
    }
    
    // Text-to-speech functionality
    function initTextToSpeech() {
        // Check if the SpeechSynthesis API is available
        if (!('speechSynthesis' in window)) {
            console.log('Text-to-speech not supported in this browser.');
            return;
        }
        
        // Create a button for the navbar
        const ttsButton = document.createElement('li');
        ttsButton.className = 'nav-item';
        ttsButton.innerHTML = `
            <a class="nav-link" href="#" id="tts-toggle" aria-label="Toggle text-to-speech">
                <i class="fas fa-volume-up me-1" aria-hidden="true"></i><span>Read Aloud</span>
            </a>
        `;
        
        // Add the button to the navbar
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            navbar.insertBefore(ttsButton, document.getElementById('auth-menu-item'));
        }
        
        // Initialize text-to-speech state
        let isSpeaking = false;
        let currentUtterance = null;
        let elementsToRead = [];
        let currentElementIndex = 0;
        
        // For blog detail pages, we might need to wait for content to load
        if (window.location.href.includes('blog-detail.html')) {
            // Check if content is loaded already
            const checkContentLoaded = setInterval(() => {
                const blogContent = document.querySelector('.blog-content');
                // If blog content is found and not just loading spinner
                if (blogContent && !document.querySelector('.blog-content .spinner-border')) {
                    clearInterval(checkContentLoaded);
                    console.log('Blog content loaded, TTS ready');
                }
            }, 500);
        }
        
        // Toggle text-to-speech on button click
        document.addEventListener('click', function(e) {
            if (e.target && e.target.closest('#tts-toggle')) {
                e.preventDefault();
                
                if (isSpeaking) {
                    stopSpeaking();
                } else {
                    startSpeaking();
                }
            }
        });
        
        // Function to start speaking page content
        function startSpeaking() {
            if (isSpeaking) return;
            
            // Find main content to read
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                announceToScreenReader('No content found to read.');
                return;
            }
            
            // Determine page type to better target elements
            const isBlogDetail = window.location.href.includes('blog-detail.html');
            
            // Get all readable elements with more specific selectors for blog detail pages
            let selectors = 'p, h1, h2, h3, h4, h5, li, .blog-title, .blog-text, .card-text, .card-subtitle';
            
            if (isBlogDetail) {
                // Add specific blog detail page selectors, but avoid the blog-meta container
                // to prevent reading author and date twice
                selectors += ', .blog-author, .blog-date';
            }
            
            // First gather all potential elements
            let potentialElements = Array.from(mainContent.querySelectorAll(selectors))
                .filter(element => {
                    // Skip hidden elements or empty elements
                    return window.getComputedStyle(element).display !== 'none' && 
                           element.textContent.trim() !== '';
                });
            
            // For blog detail page, remove elements that would cause duplicate reading
            if (isBlogDetail) {
                // Skip the blog-meta div since we're reading its individual child elements
                potentialElements = potentialElements.filter(element => 
                    !element.classList.contains('blog-meta')
                );
                
                // Make sure we're not getting duplicate content
                let seenText = new Set();
                potentialElements = potentialElements.filter(element => {
                    // Skip elements with duplicate text content
                    const text = element.textContent.trim();
                    if (seenText.has(text)) {
                        return false;
                    }
                    seenText.add(text);
                    return true;
                });
            }
            
            elementsToRead = potentialElements;
            
            if (elementsToRead.length === 0) {
                // If no elements found initially, try again after a short delay
                // This helps with dynamically loaded content
                setTimeout(() => {
                    // Rerun the same logic to get elements after content has loaded
                    let potentialElements = Array.from(mainContent.querySelectorAll(selectors))
                        .filter(element => {
                            return window.getComputedStyle(element).display !== 'none' && 
                                   element.textContent.trim() !== '';
                        });
                    
                    // Apply the same filtering for blog detail pages
                    if (isBlogDetail) {
                        potentialElements = potentialElements.filter(element => 
                            !element.classList.contains('blog-meta')
                        );
                        
                        let seenText = new Set();
                        potentialElements = potentialElements.filter(element => {
                            const text = element.textContent.trim();
                            if (seenText.has(text)) {
                                return false;
                            }
                            seenText.add(text);
                            return true;
                        });
                    }
                    
                    elementsToRead = potentialElements;
                    
                    if (elementsToRead.length === 0) {
                        announceToScreenReader('No readable content found.');
                        return;
                    } else {
                        // We found content after the delay, continue with reading
                        currentElementIndex = 0;
                        readCurrentElement();
                        isSpeaking = true;
                        updateTtsButton();
                        announceToScreenReader('Reading page content aloud. Click the Read Aloud button again to stop.');
                    }
                }, 800); // Slightly longer delay to ensure content is loaded
                return;
            }
            
            // Start from the first element
            currentElementIndex = 0;
            readCurrentElement();
            
            // Mark as speaking
            isSpeaking = true;
            
            // Update button appearance
            updateTtsButton();
            
            // Announce to users
            announceToScreenReader('Reading page content aloud. Click the Read Aloud button again to stop.');
        }
        
        // Function to read the current element
        function readCurrentElement() {
            if (currentElementIndex >= elementsToRead.length) {
                stopSpeaking();
                return;
            }
            
            // Get the current element to read
            const element = elementsToRead[currentElementIndex];
            
            // Skip empty elements or those with no readable text
            if (!element || !element.textContent || element.textContent.trim() === '') {
                currentElementIndex++;
                readCurrentElement();
                return;
            }
            
            // Special case for blog content - if this is a blog-detail page and we're reading a .blog-text element
            const isBlogText = element.classList.contains('blog-text');
            let textToRead = element.textContent;
            
            // For blog text that might contain HTML, extract just the text 
            if (isBlogText && element.innerHTML.includes('<br>')) {
                // Replace <br> tags with spaces for better reading
                textToRead = element.innerHTML.replace(/<br\s*\/?>/gi, '. ');
                // Remove any other HTML tags
                textToRead = textToRead.replace(/<[^>]*>/g, '');
            }
            
            // Remove highlight from all elements
            elementsToRead.forEach(el => el.classList.remove('reading-highlight'));
            
            // Add highlight to current element
            element.classList.add('reading-highlight');
            
            // Scroll element into view if not visible
            const elementRect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (elementRect.top < 0 || elementRect.bottom > windowHeight) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Create a new utterance for this element
            currentUtterance = new SpeechSynthesisUtterance(textToRead);
            
            // Set language to English
            currentUtterance.lang = 'en-GB';
            
            // Set a medium speech rate
            currentUtterance.rate = 0.9;
            
            // Event for when speech ends
            currentUtterance.onend = function() {
                // Move to the next element
                currentElementIndex++;
                
                // If we have more elements to read, continue
                if (currentElementIndex < elementsToRead.length && isSpeaking) {
                    readCurrentElement();
                } else {
                    // Otherwise, we're done
                    stopSpeaking();
                }
            };
            
            // Start speaking
            window.speechSynthesis.speak(currentUtterance);
        }
        
        // Function to stop speaking
        function stopSpeaking() {
            if (!isSpeaking) return;
            
            window.speechSynthesis.cancel();
            isSpeaking = false;
            currentUtterance = null;
            
            // Remove highlight from all elements
            if (elementsToRead.length > 0) {
                elementsToRead.forEach(el => el.classList.remove('reading-highlight'));
            }
            
            // Reset
            elementsToRead = [];
            currentElementIndex = 0;
            
            // Update button appearance
            updateTtsButton();
            
            // Announce to users
            announceToScreenReader('Stopped reading aloud.');
        }
        
        // Add keyboard shortcut for text-to-speech (Alt+R)
        document.addEventListener('keydown', function(e) {
            // Alt + R
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                
                if (isSpeaking) {
                    stopSpeaking();
                } else {
                    startSpeaking();
                }
            }
        });
        
        // Function to update the TTS button appearance
        function updateTtsButton() {
            const ttsToggle = document.getElementById('tts-toggle');
            const ttsIcon = document.querySelector('#tts-toggle i');
            const ttsText = document.querySelector('#tts-toggle span');
            
            if (isSpeaking) {
                ttsToggle.classList.add('active');
                ttsIcon.className = 'fas fa-volume-mute me-1';
                ttsText.textContent = 'Stop Reading';
                ttsToggle.setAttribute('aria-label', 'Stop text-to-speech (Alt+R)');
            } else {
                ttsToggle.classList.remove('active');
                ttsIcon.className = 'fas fa-volume-up me-1';
                ttsText.textContent = 'Read Aloud';
                ttsToggle.setAttribute('aria-label', 'Start text-to-speech (Alt+R)');
            }
        }
    }
    
    // Make updateAuthUI available globally
    window.updateAuthUI = updateAuthUI;
    window.announceToScreenReader = announceToScreenReader;
});

