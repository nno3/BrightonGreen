/**
 * Text-to-speech functionality for the GreenBrighton website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize text-to-speech if the toggle button exists
    const ttsToggle = document.getElementById('tts-toggle');
    if (ttsToggle) {
        initTextToSpeech();
    }
});

function initTextToSpeech() {
    // Check if the SpeechSynthesis API is available
    if (!('speechSynthesis' in window)) {
        console.log('Text-to-speech not supported in this browser.');
        return;
    }

    const ttsToggle = document.getElementById('tts-toggle');
    const mainContent = document.getElementById('main-content');
    
    // Debug log for initialization
    console.log('Initializing text-to-speech with mainContent:', mainContent ? 'found' : 'not found');
    
    let isReading = false;
    let isPaused = false;
    let currentUtterance = null;
    let currentElement = null;
    let elementsToRead = [];
    let currentIndex = 0;
    let currentText = '';
    let currentPosition = 0;

    // Function to get all readable elements
    function getReadableElements() {
        if (!mainContent) {
            console.warn('Main content element not found!');
            return [];
        }
        
        // Check current page type to optimize element selection
        const currentPath = window.location.pathname;
        const isAttractionsPage = currentPath.includes('attractions');
        const isItineraryPlanner = currentPath.includes('itinerary-planner');
        
        console.log('Current page type:', { 
            path: currentPath,
            isAttractionsPage, 
            isItineraryPlanner 
        });
        
        // Expanded selectors for better coverage across all pages
        let commonSelectors = 'p, h1, h2, h3, h4, h5, h6, li, .card-text, .card-title, .blog-content, .lead';
        
        // Add specific selectors for attractions page
        if (isAttractionsPage) {
            commonSelectors += ', .attraction-content h3, .attraction-content p, .lead.text-muted, .restaurant-badge, .attraction-badge';
        }
        
        // Add specific selectors for itinerary planner
        if (isItineraryPlanner) {
            commonSelectors += ', .intro-text p, .preference-section h3, .form-text, .activity-description, .planner-card-header p, .main-title, .step-label';
        }
        
        const allElements = mainContent.querySelectorAll(commonSelectors);
        return Array.from(allElements).filter(el => {
            if (el.textContent.trim() === '') return false;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            
            let parent = el.parentElement;
            while (parent && parent !== mainContent) {
                const parentStyle = window.getComputedStyle(parent);
                if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') return false;
                parent = parent.parentElement;
            }
            return true;
        });
    }

    // Function to start reading
    function startReading() {
        if (!mainContent || (isReading && !isPaused)) return;

        if (isPaused) {
            resumeReading();
            return;
        }

        // Get all readable elements
        elementsToRead = getReadableElements();
        if (elementsToRead.length === 0) {
            console.log('No readable elements found on the page');
            return;
        }

        // Start from the beginning
        currentIndex = 0;
        isReading = true;
        isPaused = false;
        ttsToggle.classList.add('active');
        ttsToggle.setAttribute('aria-pressed', 'true');
        ttsToggle.querySelector('span').textContent = 'Pause';

        // Start reading the first element
        readCurrentElement();
    }

    // Function to pause reading
    function pauseReading() {
        if (!isReading || isPaused) return;
        
        speechSynthesis.pause();
        isPaused = true;
        isReading = true;
        ttsToggle.classList.add('active');
        ttsToggle.setAttribute('aria-pressed', 'true');
        ttsToggle.querySelector('span').textContent = 'Resume';

        // Keep the highlight on the current element
        if (currentElement) {
            currentElement.classList.add('reading-highlight');
        }
    }

    // Function to resume reading
    function resumeReading() {
        if (!isReading || !isPaused) return;
        
        speechSynthesis.resume();
        isPaused = false;
        ttsToggle.classList.add('active');
        ttsToggle.setAttribute('aria-pressed', 'true');
        ttsToggle.querySelector('span').textContent = 'Pause';
    }

    // Function to stop reading
    function stopReading() {
        if (!isReading && !isPaused) return;
        
        speechSynthesis.cancel();
        isReading = false;
        isPaused = false;
        ttsToggle.classList.remove('active');
        ttsToggle.setAttribute('aria-pressed', 'false');
        ttsToggle.querySelector('span').textContent = 'Read Aloud';

        // Remove highlight from current element
        if (currentElement) {
            currentElement.classList.remove('reading-highlight');
        }
        currentElement = null;
        currentUtterance = null;
    }

    // Function to read current element
    function readCurrentElement() {
        if (!isReading || currentIndex >= elementsToRead.length) {
            stopReading();
            return;
        }

        // Remove previous highlight
        if (currentElement) {
            currentElement.classList.remove('reading-highlight');
        }

        // Get current element and highlight it
        currentElement = elementsToRead[currentIndex];
        currentElement.classList.add('reading-highlight');

        // Scroll element into view if needed
        const rect = currentElement.getBoundingClientRect();
        const navHeight = document.querySelector('.navbar').offsetHeight;
        if (rect.top < navHeight || rect.bottom > window.innerHeight) {
            window.scrollTo({
                top: window.pageYOffset + rect.top - navHeight - 20,
                behavior: 'smooth'
            });
        }

        // Create utterance
        const text = currentElement.textContent.trim();
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set a clear female voice
        setFemaleVoice(currentUtterance);

        // Configure utterance
        currentUtterance.rate = 1;
        currentUtterance.pitch = 1.05;
        currentUtterance.volume = 1;

        // Handle end of utterance
        currentUtterance.onend = () => {
            if (isReading && !isPaused) {
                currentElement.classList.remove('reading-highlight');
                currentIndex++;
                if (currentIndex < elementsToRead.length) {
                    readCurrentElement();
                } else {
                    stopReading();
                }
            }
        };

        // Handle errors
        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            if (isReading && !isPaused) {
                currentIndex++;
                if (currentIndex < elementsToRead.length) {
                    readCurrentElement();
                } else {
                    stopReading();
                }
            }
        };

        // Start speaking
        speechSynthesis.speak(currentUtterance);
    }

    // Toggle button click handler
    ttsToggle.addEventListener('click', function() {
        if (!isReading) {
            startReading();
        } else if (isPaused) {
            resumeReading();
        } else {
            pauseReading();
        }
    });

    // Clean up when leaving the page
    window.addEventListener('beforeunload', function() {
        if (isReading || isPaused) {
            stopReading();
        }
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isReading && !isPaused) {
            pauseReading();
        }
    });

    // Load and select voices when available
    speechSynthesis.onvoiceschanged = function() {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices loaded:', voices.length);
    };

    // Handle page transitions in the itinerary planner
    if (window.location.pathname.includes('itinerary-planner')) {
        // Listen for dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style' && 
                    mutation.target.id === 'preferences-section') {
                    // If we were reading, stop and restart to pick up new content
                    if (isReading) {
                        stopReading();
                        setTimeout(() => {
                            startReading();
                        }, 500);
                    }
                }
            });
        });

        // Observe the preferences section for style changes
        const preferencesSection = document.getElementById('preferences-section');
        if (preferencesSection) {
            observer.observe(preferencesSection, {
                attributes: true,
                attributeFilter: ['style']
            });
        }

        // Handle start planner button click
        const startPlannerBtn = document.getElementById('start-planner-btn');
        if (startPlannerBtn) {
            startPlannerBtn.addEventListener('click', function() {
                if (isReading) {
                    stopReading();
                    setTimeout(() => {
                        startReading();
                    }, 500);
                }
            });
        }

        // Handle form submission
        const itineraryForm = document.getElementById('itinerary-form');
        if (itineraryForm) {
            itineraryForm.addEventListener('submit', function() {
                if (isReading || isPaused) {
                    stopReading();
                }
            });
        }
    }
}

// Helper function to set a clear female voice
function setFemaleVoice(utterance) {
    let voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
        console.log('No voices available, forcing voice loading...');
        if ('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.cancel();
            const silentUtterance = new SpeechSynthesisUtterance('');
            speechSynthesis.speak(silentUtterance);
            speechSynthesis.cancel();
        }
        voices = speechSynthesis.getVoices();
    }
    
    if (voices.length === 0) {
        console.warn('No voices available even after forcing load');
        return;
    }

    const preferredVoices = [
        voices.find(v => v.name === 'Google UK English Female'),
        voices.find(v => v.name === 'Microsoft Hazel Desktop - English (Great Britain)'),
        voices.find(v => v.name.includes('UK English Female')),
        voices.find(v => v.name === 'Microsoft Zira Desktop - English (United States)'),
        voices.find(v => v.name === 'Google US English Female'),
        voices.find(v => v.name.includes('US English Female')),
        voices.find(v => v.name.includes('Samantha')),
        voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')),
        voices.find(v => v.name.toLowerCase().includes('female')),
        voices.find(v => v.lang === 'en-GB'),
        voices.find(v => v.lang.startsWith('en')),
        voices[0]
    ];
    
    const selectedVoice = preferredVoices.find(v => v);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
    } else {
        console.warn('No suitable voice found');
    }
}

// Function to announce messages to screen readers
function announceToScreenReader(message) {
    let announcer = document.getElementById('screen-reader-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'assertive');
        announcer.setAttribute('role', 'status');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
    
    announcer.textContent = '';
    setTimeout(() => {
        announcer.textContent = message;
    }, 50);
} 