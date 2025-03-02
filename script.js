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
    
    // Clear out any existing content (just in case)
    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Loop through each testimonial and build slides + dots
    testimonials.forEach((testimonial, index) => {
        // Create the slide
        const slide = document.createElement('div');
        slide.className = `testimonial-slide${index === 0 ? ' active' : ''}`; // First slide is active
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

        // Create the corresponding dot
        const dot = document.createElement('span');
        dot.className = `dot${index === 0 ? ' active' : ''}`; // First dot is active
        dot.onclick = () => currentSlide(index); // Click to jump to this slide
        dotsContainer.appendChild(dot);
    });

    // Kick off the carousel
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

    // Handle wrapping around
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    // Hide all slides and deactivate all dots
    Array.from(slides).forEach(slide => slide.classList.remove('active'));
    Array.from(dots).forEach(dot => dot.classList.remove('active'));

    // Show the current slide and activate its dot (if there are slides)
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
    resetAutoScroll(); // Reset auto-scroll when manually navigating
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
}

// Initialize everything when the page loads
(async () => {
    const testimonials = await fetchTestimonials();
    if (testimonials.length > 0) {
        createTestimonialSlides(testimonials);
    } else {
        console.log('No testimonials loaded - check testimonials.json path or content.');
    }
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