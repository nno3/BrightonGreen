/**
 * Accessibility functionality for the GreenBrighton website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize text-to-speech if the toggle button exists
    const ttsToggle = document.getElementById('tts-toggle');
    if (ttsToggle) {
        initTextToSpeech();
    }
});

// Function to initialize text-to-speech functionality
function initTextToSpeech() {
    const ttsToggle = document.getElementById('tts-toggle');
    const contentSections = document.querySelectorAll('.readable-content p, .readable-content li, .readable-content h1, .readable-content h2, .readable-content h3, .readable-content h4, .readable-content h5, .readable-content h6');
    
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
        ttsToggle.style.display = 'none';
        if (window.GreenBrighton && window.GreenBrighton.utils) {
            window.GreenBrighton.utils.showToast('Text-to-speech is not supported in your browser', 'warning');
        }
        return;
    }
    
    let currentlyReading = false;
    let currentElement = null;
    let speechUtterance = null;
    
    // Function to start reading content
    function startSpeaking() {
        // If already reading, do nothing
        if (currentlyReading) return;
        
        // Mark as reading
        currentlyReading = true;
        ttsToggle.classList.add('active');
        ttsToggle.setAttribute('aria-pressed', 'true');
        
        // Announce to screen readers that reading has started
        if (window.GreenBrighton && window.GreenBrighton.utils) {
            window.GreenBrighton.utils.announceToScreenReader('Text to speech started');
        }
        
        // Find the first element to read if none is set
        if (!currentElement) {
            currentElement = contentSections[0];
        }
        
        // Start reading from current element
        readCurrentElement();
    }
    
    // Function to stop reading content
    function stopSpeaking() {
        // If not currently reading, do nothing
        if (!currentlyReading) return;
        
        // Stop speech synthesis
        window.speechSynthesis.cancel();
        
        // Mark as not reading
        currentlyReading = false;
        ttsToggle.classList.remove('active');
        ttsToggle.setAttribute('aria-pressed', 'false');
        
        // Clear current element highlight
        if (currentElement) {
            currentElement.classList.remove('reading-highlight');
        }
        
        // Announce to screen readers that reading has stopped
        if (window.GreenBrighton && window.GreenBrighton.utils) {
            window.GreenBrighton.utils.announceToScreenReader('Text to speech stopped');
        }
    }
    
    // Function to read the current element
    function readCurrentElement() {
        if (!currentElement || !currentlyReading) return;
        
        // Remove highlight from all elements
        contentSections.forEach(section => {
            section.classList.remove('reading-highlight');
        });
        
        // Add highlight to current element
        currentElement.classList.add('reading-highlight');
        
        // Scroll element into view if not visible
        const elementRect = currentElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (elementRect.top < 0 || elementRect.bottom > windowHeight) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: window.pageYOffset + elementRect.top - navbarHeight - 20,
                behavior: 'smooth'
            });
        }
        
        // Create speech utterance
        speechUtterance = new SpeechSynthesisUtterance(currentElement.textContent);
        speechUtterance.lang = 'en-US';
        speechUtterance.rate = 1;
        speechUtterance.pitch = 1;
        
        // Set up event for when speech ends
        speechUtterance.onend = function() {
            // Move to the next element if we're still reading
            if (currentlyReading) {
                // Find index of current element
                const currentIndex = Array.from(contentSections).indexOf(currentElement);
                
                // If we have more elements, move to next one
                if (currentIndex < contentSections.length - 1) {
                    currentElement = contentSections[currentIndex + 1];
                    readCurrentElement();
                } else {
                    // We've reached the end, stop speaking
                    stopSpeaking();
                    if (window.GreenBrighton && window.GreenBrighton.utils) {
                        window.GreenBrighton.utils.showToast('Finished reading the content', 'success');
                    }
                }
            }
        };
        
        // Start speaking
        window.speechSynthesis.speak(speechUtterance);
    }
    
    // Toggle button click event
    ttsToggle.addEventListener('click', function() {
        if (currentlyReading) {
            stopSpeaking();
        } else {
            startSpeaking();
        }
    });
    
    // Keyboard support for toggle button
    ttsToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (currentlyReading) {
                stopSpeaking();
            } else {
                startSpeaking();
            }
        }
    });
    
    // Make section elements clickable for reading
    contentSections.forEach(section => {
        section.addEventListener('click', function() {
            if (currentlyReading) {
                // Stop current reading
                window.speechSynthesis.cancel();
                
                // Set this as the current element and read it
                currentElement = this;
                readCurrentElement();
            }
        });
        
        // Add keyboard support for section focusing
        section.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (currentlyReading) {
                    e.preventDefault();
                    
                    // Stop current reading
                    window.speechSynthesis.cancel();
                    
                    // Set this as the current element and read it
                    currentElement = this;
                    readCurrentElement();
                }
            }
        });
    });
} 