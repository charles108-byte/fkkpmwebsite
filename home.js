/**
 * Home page - featured products preview
 * Shows a small subset of products and an ALL PRODUCTS button
 */

async function initHomePage() {
    const grid = document.getElementById('home-products-grid');
    const loading = document.getElementById('home-loading-state');

    if (!grid) return;

    if (loading) {
        loading.style.display = 'block';
    }

    try {
        // Ensure products are loaded using the shared loader from products.js
        if (!Array.isArray(allProducts) || allProducts.length === 0) {
            await loadProducts();
        }

        // Take the first 8 products as a simple featured selection
        const featuredProducts = allProducts.slice(0, 8);

        if (featuredProducts.length === 0) {
            grid.innerHTML = '';
            return;
        }

        // Reuse the same card layout as the products list page
        grid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error('Error loading home products:', error);
        grid.innerHTML = '<p style="color:#e53e3e;">Failed to load featured products.</p>';
    } finally {
        if (loading) {
            loading.style.display = 'none';
        }
    }
}

/**
 * Simple hero carousel for the right side of hero section
 */
function initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    const prevBtn = carousel.querySelector('.hero-carousel-control.prev');
    const nextBtn = carousel.querySelector('.hero-carousel-control.next');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoTimer = null;
    const interval = 3000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function restartTimer() {
        if (autoTimer) {
            clearInterval(autoTimer);
        }
        autoTimer = setInterval(nextSlide, interval);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartTimer();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            restartTimer();
        });
    });

    // Start auto rotation
    showSlide(0);
    restartTimer();
}

function initHome() {
    initHomePage();
    initHeroCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}

