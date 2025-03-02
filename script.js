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
        return []; // Return empty array if fetch fails so the site doesn’t break
    }
}

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

// Carousel logic
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
    autoScrollInterval = setInterval(nextSlide, 5000);
}

// Language selector functionality
const languageSelect = document.getElementById('language-select');

languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
});

function setLanguage(lang) {
    document.querySelectorAll('.content-en, .content-es').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelectorAll(`.content-${lang}`).forEach(element => {
        element.style.display = 'block';
    });
}

// Newsletter form validation and submission
function handleNewsletterSubmission(formId, emailInputId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(emailInputId);
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent traditional form submission
        
        const email = emailInput.value.trim();
        if (validateEmail(email)) {
            alert('Subscribed successfully!'); // Simulate submission success
            emailInput.value = ''; // Clear the input field
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// Simple email validation function using regex
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Initialize newsletter forms for both languages
handleNewsletterSubmission('newsletter-form-en', 'email-input-en');
handleNewsletterSubmission('newsletter-form-es', 'email-input-es');

// Initialize everything when the page loads
(async () => {
    const testimonials = await fetchTestimonials();
    if (testimonials.length > 0) {
        createTestimonialSlides(testimonials);
    } else {
        console.log('No testimonials loaded - check testimonials.json path or content.');
    }
    
    setLanguage('en');
})();

// Add event listeners for arrow buttons
document.querySelector('.prev').addEventListener('click', () => {
    prevSlide();
    resetAutoScroll();
});

document.querySelector('.next').addEventListener('click', () => {
    nextSlide();
    resetAutoScroll();
});
