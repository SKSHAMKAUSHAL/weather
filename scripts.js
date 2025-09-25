/**
 * Modern Weather App with GSAP Animations
 * Handles weather data fetching, display functionality, and smooth animations
 */

// ==========================================
// Configuration and Constants
// ==========================================

// WeatherAPI configuration
const WEATHER_API_CONFIG = {
    apiKey: "77cd39c3c35e4552b93173121250909",
    baseUrl: "https://api.weatherapi.com/v1/current.json",
    options: "aqi=no" // Disable air quality data for faster response
};

// DOM element selectors
const DOM_ELEMENTS = {
    locationInput: "location-input",
    searchButton: "search-button", 
    weatherResult: "weather-result",
    weatherIcon: ".weather-icon",
    floatingElements: ".floating-element",
    searchCard: ".search-card",
    appHeader: ".app-header",
    backgroundElements: ".background-elements"
};

// CSS classes for styling
const CSS_CLASSES = {
    show: "show",
    loading: "loading",
    weatherCondition: "weather-condition",
    weatherLocation: "weather-location",
    weatherTemperature: "weather-temperature",
    errorMessage: "error-message",
    warningMessage: "warning-message"
};

// Animation configuration
const ANIMATION_CONFIG = {
    duration: {
        fast: 0.3,
        medium: 0.6,
        slow: 1.2
    },
    ease: {
        smooth: "power2.out",
        bounce: "back.out(1.7)",
        elastic: "elastic.out(1, 0.3)"
    }
};

// ==========================================
// DOM Elements Cache
// ==========================================

let locationInputElement;
let searchButtonElement;
let weatherResultElement;

// ==========================================
// GSAP Animation Functions
// ==========================================

/**
 * Initializes page load animations
 */
function initializePageAnimations() {
    // Set initial states
    gsap.set(DOM_ELEMENTS.appHeader, { opacity: 0, y: -50 });
    gsap.set(DOM_ELEMENTS.searchCard, { opacity: 0, y: 30, scale: 0.9 });
    gsap.set(DOM_ELEMENTS.floatingElements, { opacity: 0, scale: 0 });
    
    // Create timeline for page load
    const tl = gsap.timeline();
    
    tl.to(DOM_ELEMENTS.appHeader, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.medium,
        ease: ANIMATION_CONFIG.ease.smooth
    })
    .to(DOM_ELEMENTS.searchCard, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.duration.medium,
        ease: ANIMATION_CONFIG.ease.bounce
    }, "-=0.3")
    .to(DOM_ELEMENTS.floatingElements, {
        opacity: 0.1,
        scale: 1,
        duration: ANIMATION_CONFIG.duration.slow,
        ease: ANIMATION_CONFIG.ease.smooth,
        stagger: 0.2
    }, "-=0.4");
    
    // Animate floating elements continuously
    animateFloatingElements();
}

/**
 * Creates continuous floating animation for background elements
 */
function animateFloatingElements() {
    gsap.to(".floating-element-1", {
        x: "+=30",
        y: "+=20",
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true
    });
    
    gsap.to(".floating-element-2", {
        x: "-=25",
        y: "+=35",
        rotation: -360,
        duration: 25,
        ease: "none",
        repeat: -1,
        yoyo: true
    });
    
    gsap.to(".floating-element-3", {
        x: "+=20",
        y: "-=30",
        rotation: 180,
        duration: 18,
        ease: "none",
        repeat: -1,
        yoyo: true
    });
}

/**
 * Animates the weather icon with a pulsing effect
 */
function animateWeatherIcon() {
    gsap.to(DOM_ELEMENTS.weatherIcon, {
        scale: 1.1,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });
}

/**
 * Animates button loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
function animateButtonLoading(isLoading) {
    if (isLoading) {
        searchButtonElement.classList.add(CSS_CLASSES.loading);
        
        // Animate loading dots
        gsap.to(".loader-dot", {
            y: -8,
            duration: 0.6,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.1
        });
        
        // Disable button interaction
        gsap.to(searchButtonElement, {
            scale: 0.95,
            duration: 0.2,
            ease: ANIMATION_CONFIG.ease.smooth
        });
    } else {
        searchButtonElement.classList.remove(CSS_CLASSES.loading);
        
        // Kill loading animations
        gsap.killTweensOf(".loader-dot");
        
        // Reset button scale with bounce
        gsap.to(searchButtonElement, {
            scale: 1,
            duration: 0.4,
            ease: ANIMATION_CONFIG.ease.bounce
        });
    }
}

/**
 * Animates the weather result card appearance
 */
function animateWeatherResult() {
    const resultCard = document.getElementById("weather-result");
    
    // Set initial state
    gsap.set(resultCard, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotationX: -15
    });
    
    // Animate appearance
    gsap.to(resultCard, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: ANIMATION_CONFIG.duration.medium,
        ease: ANIMATION_CONFIG.ease.bounce
    });
    
    // Add show class for CSS transitions
    resultCard.classList.add(CSS_CLASSES.show);
}

/**
 * Animates input focus effects
 */
function setupInputAnimations() {
    const inputElement = locationInputElement;
    const inputIcon = document.querySelector('.input-icon');
    
    inputElement.addEventListener('focus', () => {
        gsap.to(inputIcon, {
            scale: 1.2,
            color: "#667eea",
            duration: ANIMATION_CONFIG.duration.fast,
            ease: ANIMATION_CONFIG.ease.smooth
        });
    });
    
    inputElement.addEventListener('blur', () => {
        gsap.to(inputIcon, {
            scale: 1,
            color: "rgba(255, 255, 255, 0.6)",
            duration: ANIMATION_CONFIG.duration.fast,
            ease: ANIMATION_CONFIG.ease.smooth
        });
    });
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * Safely gets a DOM element by ID
 * @param {string} elementId - The ID of the element to retrieve
 * @returns {HTMLElement|null} The DOM element or null if not found
 */
function getElementByIdSafely(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
    }
    return element;
}

/**
 * Displays a message in the weather result container with animation
 * @param {string} message - The message to display
 * @param {string} messageType - The type of message (error, warning, success)
 */
function displayMessage(message, messageType = 'info') {
    if (!weatherResultElement) return;

    // Clear any existing classes
    weatherResultElement.className = 'weather-result-card';
    
    // Add appropriate styling class based on message type
    if (messageType === 'error') {
        weatherResultElement.classList.add(CSS_CLASSES.errorMessage);
    } else if (messageType === 'warning') {
        weatherResultElement.classList.add(CSS_CLASSES.warningMessage);
    }

    // Set the message content
    weatherResultElement.textContent = message;
    
    // Animate the message appearance
    animateWeatherResult();
}

/**
 * Shows the weather result with GSAP animation
 */
function showWeatherResult() {
    if (!weatherResultElement) return;
    
    // Use GSAP animation instead of CSS classes
    animateWeatherResult();
}

/**
 * Formats weather data into HTML for display with enhanced styling
 * @param {Object} weatherData - The weather data from the API
 * @returns {string} Formatted HTML string
 */
function formatWeatherDisplay(weatherData) {
    const temperature = Math.round(weatherData.current.temp_c);
    const condition = weatherData.current.condition.text;
    const locationName = `${weatherData.location.name}, ${weatherData.location.country}`;
    const weatherIcon = getWeatherEmoji(condition);

    return `
        <div class="${CSS_CLASSES.weatherLocation}">
            🌍 <strong>${locationName}</strong>
        </div>
        <div class="${CSS_CLASSES.weatherTemperature}">
            ${temperature}°C
        </div>
        <div class="${CSS_CLASSES.weatherCondition}">
            ${weatherIcon} ${condition}
        </div>
    `;
}

/**
 * Gets appropriate emoji for weather condition
 * @param {string} condition - Weather condition text
 * @returns {string} Weather emoji
 */
function getWeatherEmoji(condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
        return '☀️';
    } else if (conditionLower.includes('cloud')) {
        return '☁️';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return '🌧️';
    } else if (conditionLower.includes('snow')) {
        return '❄️';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return '⛈️';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        return '🌫️';
    } else if (conditionLower.includes('wind')) {
        return '💨';
    }
    
    return '🌤️'; // Default
}

// ==========================================
// Weather API Functions
// ==========================================

/**
 * Constructs the weather API URL
 * @param {string} location - The location to get weather for
 * @returns {string} The complete API URL
 */
function buildWeatherApiUrl(location) {
    const encodedLocation = encodeURIComponent(location.trim());
    return `${WEATHER_API_CONFIG.baseUrl}?key=${WEATHER_API_CONFIG.apiKey}&q=${encodedLocation}&${WEATHER_API_CONFIG.options}`;
}

/**
 * Fetches weather data from the WeatherAPI
 * @param {string} location - The location to get weather for
 * @returns {Promise<Object>} Promise that resolves to weather data
 * @throws {Error} If the API request fails
 */
async function fetchWeatherData(location) {
    const apiUrl = buildWeatherApiUrl(location);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error(`Weather data not available (${response.status})`);
    }
    
    return await response.json();
}

/**
 * Validates the user input for location
 * @param {string} location - The location string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateLocationInput(location) {
    return location && location.trim().length > 0;
}

// ==========================================
// Main Weather Function
// ==========================================

/**
 * Main function to get and display weather information with GSAP animations
 * Handles the complete flow from input validation to result display
 */
async function getWeatherInformation() {
    // Get the location input value
    const locationInput = locationInputElement.value.trim();
    
    // Validate input
    if (!validateLocationInput(locationInput)) {
        displayMessage("⚠️ Please enter a location.", 'warning');
        return;
    }

    try {
        // Show loading animation
        searchButtonElement.disabled = true;
        animateButtonLoading(true);
        
        // Add subtle shake animation to search card during loading
        gsap.to(DOM_ELEMENTS.searchCard, {
            x: 2,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut"
        });

        // Fetch weather data
        const weatherData = await fetchWeatherData(locationInput);
        
        // Format and display the weather information
        const formattedWeatherHtml = formatWeatherDisplay(weatherData);
        weatherResultElement.innerHTML = formattedWeatherHtml;
        
        // Show the result with smooth animation
        showWeatherResult();
        
        // Animate individual weather elements
        setTimeout(() => {
            animateWeatherElements();
        }, 300);

    } catch (error) {
        // Handle and display errors with animation
        console.error("Weather fetch error:", error);
        displayMessage(`❌ Error: ${error.message}`, 'error');
        
        // Add error shake animation
        gsap.to(DOM_ELEMENTS.searchCard, {
            x: -5,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: "power2.inOut"
        });
        
    } finally {
        // Reset button state with animation
        searchButtonElement.disabled = false;
        animateButtonLoading(false);
    }
}

/**
 * Animates individual weather display elements
 */
function animateWeatherElements() {
    const elements = [
        `.${CSS_CLASSES.weatherLocation}`,
        `.${CSS_CLASSES.weatherTemperature}`,
        `.${CSS_CLASSES.weatherCondition}`
    ];
    
    gsap.fromTo(elements, 
        {
            opacity: 0,
            y: 20,
            scale: 0.9
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: ANIMATION_CONFIG.duration.fast,
            ease: ANIMATION_CONFIG.ease.smooth,
            stagger: 0.1
        }
    );
    
    // Special animation for temperature
    gsap.to(`.${CSS_CLASSES.weatherTemperature}`, {
        scale: 1.05,
        duration: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.5
    });
}

// ==========================================
// Event Handlers
// ==========================================

/**
 * Handles Enter key press in the location input field
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleLocationInputKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        getWeatherInformation();
    }
}

/**
 * Handles search button click
 * @param {Event} event - The click event
 */
function handleSearchButtonClick(event) {
    event.preventDefault();
    getWeatherInformation();
}

// ==========================================
// Initialization
// ==========================================

/**
 * Initializes the modern weather app with GSAP animations
 * Sets up DOM element references, event listeners, and animations
 */
function initializeWeatherApp() {
    // Cache DOM elements
    locationInputElement = getElementByIdSafely(DOM_ELEMENTS.locationInput);
    searchButtonElement = getElementByIdSafely(DOM_ELEMENTS.searchButton);
    weatherResultElement = getElementByIdSafely(DOM_ELEMENTS.weatherResult);

    // Verify required elements exist
    if (!locationInputElement || !searchButtonElement || !weatherResultElement) {
        console.error("Required DOM elements not found. App initialization failed.");
        return;
    }

    // Initialize GSAP animations
    initializePageAnimations();
    animateWeatherIcon();
    setupInputAnimations();
    
    // Set up event listeners
    searchButtonElement.addEventListener('click', handleSearchButtonClick);
    locationInputElement.addEventListener('keypress', handleLocationInputKeyPress);
    
    // Add hover animations for interactive elements
    setupHoverAnimations();
    
    // Focus on input field with animation delay
    setTimeout(() => {
        locationInputElement.focus();
        gsap.to(locationInputElement, {
            scale: 1.02,
            duration: 0.2,
            ease: ANIMATION_CONFIG.ease.smooth,
            yoyo: true,
            repeat: 1
        });
    }, 1000);

    console.log("Modern weather app initialized successfully with GSAP animations");
}

/**
 * Sets up hover animations for interactive elements
 */
function setupHoverAnimations() {
    // Search button hover effects
    searchButtonElement.addEventListener('mouseenter', () => {
        if (!searchButtonElement.disabled) {
            gsap.to(searchButtonElement, {
                scale: 1.05,
                duration: ANIMATION_CONFIG.duration.fast,
                ease: ANIMATION_CONFIG.ease.smooth
            });
        }
    });
    
    searchButtonElement.addEventListener('mouseleave', () => {
        if (!searchButtonElement.disabled) {
            gsap.to(searchButtonElement, {
                scale: 1,
                duration: ANIMATION_CONFIG.duration.fast,
                ease: ANIMATION_CONFIG.ease.smooth
            });
        }
    });
    
    // Input field hover effects
    locationInputElement.addEventListener('mouseenter', () => {
        gsap.to(locationInputElement, {
            scale: 1.01,
            duration: ANIMATION_CONFIG.duration.fast,
            ease: ANIMATION_CONFIG.ease.smooth
        });
    });
    
    locationInputElement.addEventListener('mouseleave', () => {
        if (document.activeElement !== locationInputElement) {
            gsap.to(locationInputElement, {
                scale: 1,
                duration: ANIMATION_CONFIG.duration.fast,
                ease: ANIMATION_CONFIG.ease.smooth
            });
        }
    });
}

// ==========================================
// App Startup
// ==========================================

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeWeatherApp);

// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeatherApp);
} else {
    initializeWeatherApp();
}
