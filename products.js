/**
 * Products Management - List page functionality
 * Handles pagination, search, and product rendering
 */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let totalPages = 1; // Will be calculated based on actual products
let searchQuery = '';

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allProducts = data.products || [];
        filteredProducts = [...allProducts];
        console.log('Products loaded:', allProducts.length);
        return allProducts;
    } catch (error) {
        console.error('Error loading products:', error);
        // Show error message to user
        const loading = document.getElementById('loading-state');
        if (loading) {
            loading.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load products</h3>
                    <p>Error: ${error.message}</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">
                        Please make sure you are accessing this page through a local server (not file://).<br>
                        Use: python -m http.server 8000 or npx serve .
                    </p>
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 15px;">Retry</button>
                </div>
            `;
        }
        return [];
    }
}

// Get URL parameters
function getURLParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Update URL without reload
function updateURL(page, search) {
    const url = new URL(window.location);
    if (page && page > 1) {
        url.searchParams.set('page', page);
    } else {
        url.searchParams.delete('page');
    }
    if (search) {
        url.searchParams.set('search', search);
    } else {
        url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
}

// Search products
function searchProducts(query) {
    searchQuery = query.toLowerCase().trim();

    if (!searchQuery) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(function (product) {
            const name = (product.name || '').toLowerCase();
            const partNumber = (product.partNumber || '').toLowerCase();
            const oemNumber = (product.oemNumber || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();
            const model = Array.isArray(product.model)
                ? product.model.join(' ').toLowerCase()
                : (product.model || '').toLowerCase();

            return name.indexOf(searchQuery) !== -1 ||
                partNumber.indexOf(searchQuery) !== -1 ||
                oemNumber.indexOf(searchQuery) !== -1 ||
                brand.indexOf(searchQuery) !== -1 ||
                model.indexOf(searchQuery) !== -1;
        });
    }

    // Reset to page 1 after search
    currentPage = 1;

    // Recalculate total pages based on filtered products
    totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (totalPages === 0) totalPages = 1; // Ensure at least one page

    // Update search results info
    updateSearchInfo();

    // Render products and pagination
    renderProducts();
    renderPagination('pagination-top');
    renderPagination('pagination-bottom');
}

// Update search info display
function updateSearchInfo() {
    const searchInfo = document.getElementById('search-results-info');
    const searchCount = document.getElementById('search-count');
    const searchClear = document.getElementById('search-clear');

    if (searchQuery) {
        if (searchInfo) searchInfo.style.display = 'block';
        if (searchCount) searchCount.textContent = filteredProducts.length;
        if (searchClear) searchClear.style.display = 'block';
    } else {
        if (searchInfo) searchInfo.style.display = 'none';
        if (searchClear) searchClear.style.display = 'none';
    }
}

// Render products grid
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const loading = document.getElementById('loading-state');
    const empty = document.getElementById('empty-state');

    if (!grid) return;

    // Hide loading
    if (loading) loading.style.display = 'none';

    // Calculate products to show
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    if (productsToShow.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';

    // Render product cards
    grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Create product card HTML
function createProductCard(product) {
    // Get first image with alt text
    const firstImage = product.images && product.images.length > 0 ? product.images[0] : {
        url: 'https://via.placeholder.com/280x180/1a365d/ffffff?text=Product+Image',
        alt: `${product.brand || 'Unknown'} ${product.name} - product image`
    };

    // Format model display
    const modelDisplay = Array.isArray(product.model)
        ? product.model.join(', ')
        : (product.model || '');

    // Price display - 价格显示逻辑
    let priceDisplay = '';
    if (product.price) {
        priceDisplay = product.price;
    } else if (product.specifications && product.specifications['Price Range']) {
        priceDisplay = product.specifications['Price Range'];
    } else if (product.hasPrice) {
        priceDisplay = 'Contact for pricing';
    }

    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${firstImage.url || firstImage}" alt="${firstImage.alt || firstImage}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-meta">
                    <div class="product-brand">Part#: ${product.partNumber || 'N/A'}</div>
                    ${modelDisplay ? `<div class="product-brand">For: ${modelDisplay}</div>` : ''}
                </div>
                ${priceDisplay ? `
                <div class="price-container">
                    <span class="price-label">Price:</span>
                    <span class="price-value">${priceDisplay}</span>
                </div>
                ` : ''}
                <div class="product-actions" style="margin-top: auto;">
                    <a href="product-detail.html?id=${product.id}" class="btn-primary" style="width: 100%; text-align: center; justify-content: center;" onclick="console.log('Navigating to product detail:', '${product.id}'); return true;">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Render pagination (always 30 pages)
function renderPagination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    // First page button
    html += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                     onclick="goToPage(1)" 
                     ${currentPage === 1 ? 'disabled' : ''}>
        First
    </button>`;

    // Previous button
    html += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                     onclick="goToPage(${currentPage - 1})" 
                     ${currentPage === 1 ? 'disabled' : ''}
                     aria-label="Previous page" title="Previous page">
        <i class="fas fa-chevron-left" aria-hidden="true"></i>
    </button>`;

    // Page numbers - show current page ± 2 pages
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust if near start
    if (currentPage <= 3) {
        startPage = 1;
        endPage = Math.min(5, totalPages);
    }

    // Adjust if near end
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }

    // Show first page if not in range
    if (startPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-dots">...</span>`;
        }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                         onclick="goToPage(${i})">
            ${i}
        </button>`;
    }

    // Show last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-dots">...</span>`;
        }
        html += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    html += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                     onclick="goToPage(${currentPage + 1})" 
                     ${currentPage === totalPages ? 'disabled' : ''}
                     aria-label="Next page" title="Next page">
        <i class="fas fa-chevron-right" aria-hidden="true"></i>
    </button>`;

    // Last page button
    html += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                     onclick="goToPage(${totalPages})" 
                     ${currentPage === totalPages ? 'disabled' : ''}>
        Last
    </button>`;

    // Page info
    const start = (currentPage - 1) * productsPerPage + 1;
    const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
    html += `<div class="pagination-info">
        Page ${currentPage} of ${totalPages} | Showing ${start}-${end} of ${filteredProducts.length} products
    </div>`;

    container.innerHTML = html;
}

// Go to specific page
function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;

    currentPage = page;
    updateURL(currentPage, searchQuery);
    renderProducts();
    renderPagination('pagination-top');
    renderPagination('pagination-bottom');
}

// Initialize products page
async function initProductsPage() {
    console.log('initProductsPage called');

    // Show loading
    const loading = document.getElementById('loading-state');
    const grid = document.getElementById('products-grid');

    if (loading) {
        loading.style.display = 'block';
    }
    if (grid) {
        grid.innerHTML = ''; // Clear any existing content
    }

    try {
        // Load products
        const products = await loadProducts();
        console.log('Products loaded:', products.length);

        // Check if products were loaded
        if (products.length === 0) {
            console.warn('No products loaded - error message should be displayed');
            return; // Error message already shown by loadProducts()
        }

        // Calculate total pages based on actual products
        totalPages = Math.ceil(allProducts.length / productsPerPage);
        if (totalPages === 0) totalPages = 1; // Ensure at least one page
        console.log('Total pages calculated:', totalPages);

        // Get URL parameters
        const pageParam = getURLParam('page');
        const searchParam = getURLParam('search');

        // Set current page
        if (pageParam) {
            currentPage = parseInt(pageParam) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;
        }

        // Set search query
        if (searchParam) {
            searchQuery = searchParam;
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.value = searchParam;
            }
            searchProducts(searchParam);
        } else {
            filteredProducts = [...allProducts];
            renderProducts();
            renderPagination('pagination-top');
            renderPagination('pagination-bottom');
        }

        // Search input handler
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function () {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = this.value.trim();
                    searchProducts(query);
                    updateURL(currentPage, query);
                }, 300);
            });

            // Enter key
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    searchProducts(query);
                    updateURL(currentPage, query);
                }
            });
        }

        // Clear search button
        const searchClear = document.getElementById('search-clear');
        if (searchClear) {
            searchClear.addEventListener('click', function () {
                const searchInput = document.getElementById('product-search');
                if (searchInput) {
                    searchInput.value = '';
                }
                searchProducts('');
                updateURL(currentPage, '');
            });
        }

        // Browser back/forward
        window.addEventListener('popstate', function () {
            const pageParam = getURLParam('page');
            const searchParam = getURLParam('search');

            if (pageParam) {
                currentPage = parseInt(pageParam) || 1;
            } else {
                currentPage = 1;
            }

            if (searchParam) {
                const searchInput = document.getElementById('product-search');
                if (searchInput) {
                    searchInput.value = searchParam;
                }
                searchProducts(searchParam);
            } else {
                const searchInput = document.getElementById('product-search');
                if (searchInput) {
                    searchInput.value = '';
                }
                filteredProducts = [...allProducts];
                renderProducts();
                renderPagination('pagination-top');
                renderPagination('pagination-bottom');
            }
        });
    } catch (error) {
        console.error('Error in initProductsPage:', error);
        if (loading) {
            loading.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to initialize products page</h3>
                    <p>Error: ${error.message}</p>
                    <button onclick="location.reload()" class="btn-primary" style="margin-top: 15px;">Retry</button>
                </div>
            `;
        }
    }
}

// Export for use in product detail page
function getProductById(id) {
    return allProducts.find(p => p.id === id);
}

// Initialize on page load
// Check if we're on the products page by looking for the products-grid element
function isProductsPage() {
    // Check for products page specific elements
    const hasProductsGrid = document.getElementById('products-grid') !== null;
    const pathnameIncludes = window.location.pathname.includes('products.html');
    const hrefIncludes = window.location.href.includes('products.html');

    return hasProductsGrid || pathnameIncludes || hrefIncludes;
}

// Initialize when DOM is ready
function initializePage() {
    if (isProductsPage()) {
        console.log('Initializing products page...');
        initProductsPage();
    } else {
        console.log('Not on products page, skipping initialization');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // DOM already loaded
    initializePage();
}


