// Fetch testimonials from testimonials.json
async function fetchTestimonials() {
    try {
        const response = await fetch('testimonials.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        return []; // Return empty array if fetch fails to prevent breaking the site
    }
}

// Edited as a part of Assignment 6: Adjusted to dynamically load testimonials from JSON
// Create testimonial slides and dots dynamically
function createTestimonialSlides(testimonials) {
    const container = document.querySelector('.testimonial-container');
    const dotsContainer = document.querySelector('.auto-scroll-controls');
    
    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = `testimonial-slide${index === 0 ? ' active' : ''}`;
        slide.innerHTML = `
            <div class="testimonial-card">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image">
                <div class="stars">${'★'.repeat(testimonial.rating)}</div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
            </div>
        `;
        container.appendChild(slide);

        const dot = document.createElement('span');
        dot.className = `dot${index === 0 ? ' active' : ''}`;
        dot.onclick = () => currentSlide(index);
        dotsContainer.appendChild(dot);
    });

    slideIndex = 0;
    showSlides(slideIndex);
    resetAutoScroll();
}

// Carousel logic for testimonials
let slideIndex = 0;
let autoScrollInterval;

function showSlides(n) {
    const slides = document.getElementsByClassName('testimonial-slide');
    const dots = document.getElementsByClassName('dot');

    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    Array.from(slides).forEach(slide => slide.classList.remove('active'));
    Array.from(dots).forEach(dot => dot.classList.remove('active'));

    if (slides.length > 0) {
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }
}

function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

function prevSlide() {
    slideIndex--;
    showSlides(slideIndex);
}

function currentSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
    resetAutoScroll();
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
}

// Edited as a part of Assignment 6: Added language selector functionality
// Language selector functionality
const languageSelect = document.getElementById('language-select');

// Navigation link elements
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');
const createLink = document.getElementById('create-link');

languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
});

function setLanguage(lang) {
    document.querySelectorAll('.content-en, .content-es').forEach(element => {
        element.style.display = 'none'; // Hide all language content
    });
    document.querySelectorAll(`.content-${lang}`).forEach(element => {
        element.style.display = 'block'; // Show selected language content
    });

    // Update navigation links based on selected language
    if (lang === 'es') {
        homeLink.textContent = 'Inicio';
        aboutLink.textContent = 'Acerca de';
        createLink.textContent = 'Crear';
    } else {
        homeLink.textContent = 'Home';
        aboutLink.textContent = 'About';
        createLink.textContent = 'Create';
    }
}

// Edited as a part of Assignment 6: Added newsletter form validation and submission
// Newsletter form validation and submission
function handleNewsletterSubmission(formId, emailInputId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(emailInputId);
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent traditional form submission
        const email = emailInput.value.trim();
        if (validateEmail(email)) {
            alert('Subscribed successfully!'); // Simulate successful subscription
            emailInput.value = ''; // Clear input field
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// Simple email validation using regex
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Initialize newsletter forms for both languages
handleNewsletterSubmission('newsletter-form-en', 'email-input-en');
handleNewsletterSubmission('newsletter-form-es', 'email-input-es');

// Edited as a part of Assignment 6: Added sign-up modal functionality
// Sign Up Modal functionality
const modal = document.getElementById('signup-modal');
const closeBtn = document.querySelector('.close');

// Open modal when sign-up buttons are clicked
document.getElementById('signup-button-en').addEventListener('click', () => {
    modal.style.display = 'flex'; // Show modal in English
});
document.getElementById('signup-button-es').addEventListener('click', () => {
    modal.style.display = 'flex'; // Show modal in Spanish
});

// Close modal when close button is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle sign-up form submission
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const name = document.getElementById('name-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    
    if (name && validateEmail(email)) {
        alert('Signed up successfully!'); // Simulate successful sign-up
        modal.style.display = 'none'; // Close modal
        // Clear form fields
        document.getElementById('name-input').value = '';
        document.getElementById('email-input').value = '';
    } else {
        alert('Please fill in all fields with valid information.');
    }
});

// Initialize everything when the page loads
(async () => {
    const testimonials = await fetchTestimonials();
    if (testimonials.length > 0) {
        createTestimonialSlides(testimonials);
    } else {
        console.log('No testimonials loaded - check testimonials.json path or content.');
    }
    
    setLanguage('en'); // Default to English
})();

// Add event listeners for carousel arrows
document.querySelector('.prev').addEventListener('click', () => {
    prevSlide();
    resetAutoScroll();
});

document.querySelector('.next').addEventListener('click', () => {
    nextSlide();
    resetAutoScroll();
});
