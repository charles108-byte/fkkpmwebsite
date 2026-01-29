/**
 * Product Detail Page - Display product information
 */

async function loadProductDetail() {
    console.log('loadProductDetail called');
    console.log('window.location:', {
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
    });
    
    // Get URL parameter - try multiple methods
    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');
    
    // Fallback: try to get from hash if search params don't work
    if (!productId && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        productId = hashParams.get('id');
    }
    
    // Fallback: try to parse from full URL
    if (!productId) {
        const urlMatch = window.location.href.match(/[?&]id=([^&]+)/);
        if (urlMatch) {
            productId = decodeURIComponent(urlMatch[1]);
        }
    }
    
    console.log('Product ID from URL:', productId);
    console.log('Full URL:', window.location.href);
    
    if (!productId) {
        console.error('No product ID found in URL!');
        console.error('Search params:', window.location.search);
        console.error('All URL params:', Array.from(params.entries()));
        console.error('Full URL breakdown:', {
            href: window.location.href,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash
        });
        
        // Don't redirect immediately, show error instead
        const container = document.getElementById('product-detail-content');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Missing Product ID</h3>
                    <p>No product ID was found in the URL.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">
                        Please make sure the URL includes the product ID parameter.<br>
                        Example: <code>product-detail.html?id=K3V112DT-hydraulic-pump</code>
                    </p>
                    <p style="font-size: 12px; color: #999; margin-top: 10px;">
                        Current URL: ${window.location.href}<br>
                        Search params: ${window.location.search || '(empty)'}
                    </p>
                    <a href="products.html" class="btn-primary" style="margin-top: 15px;">Back to Products</a>
                </div>
            `;
        }
        return;
    }
    
    // Load products data
    try {
        console.log('Fetching products.json...');
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Products data loaded, total products:', data.products.length);
        
        const product = data.products.find(p => p.id === productId);
        console.log('Product found:', product ? product.name : 'NOT FOUND');
        
        if (!product) {
            console.error('Product not found with ID:', productId);
            document.getElementById('product-detail-content').innerHTML = `
                <div class="empty-state">
                    <h2>Product not found</h2>
                    <p>The product with ID "${productId}" doesn't exist.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">
                        Available product IDs: ${data.products.slice(0, 5).map(p => p.id).join(', ')}...
                    </p>
                    <a href="products.html" class="btn-primary" style="margin-top: 15px;">Back to Products</a>
                </div>
            `;
            return;
        }
        
        renderProductDetail(product, data.products);
    } catch (error) {
        console.error('Error loading product:', error);
        const container = document.getElementById('product-detail-content');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load product</h3>
                    <p>Error: ${error.message}</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">
                        Please make sure you are accessing this page through a local server (not file://).<br>
                        Use: python -m http.server 8000 or npx serve .
                    </p>
                    <a href="products.html" class="btn-primary" style="margin-top: 15px;">Back to Products</a>
                </div>
            `;
        }
    }
}

// getURLParam is now defined inline in loadProductDetail to avoid conflicts
// This function is kept for backward compatibility but may not be used
function getURLParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function renderProductDetail(product, allProducts) {
    const container = document.getElementById('product-detail-content');
    if (!container) return;
    
    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Get images
    const images = product.images || [];
    const mainImage = images[0] || {
        url: 'https://via.placeholder.com/600x400/1a365d/ffffff?text=Product+Image',
        alt: `${product.brand || 'Unknown'} ${product.name} - main product image`
    };
    
    // Model display
    const modelDisplay = Array.isArray(product.model) 
        ? product.model.join(', ') 
        : (product.model || 'N/A');
    
    // Stock status
    const stockStatus = product.stockStatus || 'in-stock';
    const stockClass = stockStatus === 'in-stock' ? 'in-stock' : 
                      stockStatus === 'low-stock' ? 'low-stock' : 'out-of-stock';
    const stockText = stockStatus === 'in-stock' ? `In Stock: ${product.stock || 0} units` :
                     stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock';
    
    // Price display - 价格显示逻辑
    let priceDisplay = 'Contact for pricing';
    if (product.price) {
        priceDisplay = product.price;
    } else if (product.specifications && product.specifications['Price Range']) {
        priceDisplay = product.specifications['Price Range'];
    }
    console.log('Price debug:', {
        productId: product.id,
        productName: product.name,
        hasPriceField: !!product.price,
        priceValue: product.price,
        hasSpecPriceRange: !!(product.specifications && product.specifications['Price Range']),
        specPriceRange: product.specifications && product.specifications['Price Range'],
        finalPriceDisplay: priceDisplay
    });
    
    // Render HTML
    container.innerHTML = `
        <div class="product-detail-grid">
            <!-- Left: Images -->
            <div class="product-images">
                <div class="main-image">
                    <img src="${mainImage.url}" alt="${mainImage.alt || mainImage}" id="main-product-image">
                </div>
                ${images.length > 1 ? `
                <div class="thumbnail-images">
                    ${images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="switchMainImage('${img.url}', '${img.alt || img}', ${index})">
                            <img src="${img.url || img}" alt="${img.alt || img}">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <!-- Right: Info -->
            <div class="product-info-detail">
                <div class="product-header">
                    <h1>${product.name}</h1>
                </div>
                
                <div class="product-meta-detail">
                    <div><strong>SKU:</strong> ${product.partNumber || 'N/A'} | <strong>OEM:</strong> ${product.oemNumber || 'N/A'}</div>
                    <div class="stock-info ${stockClass}">
                        <i class="fas fa-${stockStatus === 'in-stock' ? 'check-circle' : stockStatus === 'low-stock' ? 'exclamation-circle' : 'times-circle'}"></i>
                        <span>${stockText}</span>
                    </div>
                    <div><strong>Lead Time:</strong> ${product.leadTime || 'N/A'}</div>
                    <div><strong>Compatible Models:</strong> ${modelDisplay}</div>
                </div>
                
                <!-- Price Detail - 价格标注位置 -->
                <div class="detail-price">
                    <span class="price-label">Price:</span>
                    <span class="price-placeholder">${priceDisplay}</span>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchTab('description', event)">Description</button>
                    <button class="tab-btn" onclick="switchTab('specs', event)">Specifications</button>
                    <button class="tab-btn" onclick="switchTab('compatibility', event)">Compatibility</button>
                </div>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <div id="tab-description" class="tab-pane active">
                        <p>${product.description || 'Product description will be placed here...'}</p>
                    </div>
                    <div id="tab-specs" class="tab-pane" style="display: none;">
                        ${product.specifications ? `
                            <table class="spec-table">
                                ${Object.entries(product.specifications).map(([key, value]) => `
                                    <tr>
                                        <td>${key}</td>
                                        <td>${value}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        ` : '<p>No specifications available.</p>'}
                    </div>
                    <div id="tab-compatibility" class="tab-pane" style="display: none;">
                        ${product.compatibility && product.compatibility.length > 0 ? `
                            <ul class="compatibility-list">
                                ${product.compatibility.map(model => `<li>${model}</li>`).join('')}
                            </ul>
                        ` : '<p>No compatibility information available.</p>'}
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons">
                    <a href="products.html" class="btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Load related products
    loadRelatedProducts(product, allProducts);
}

function switchMainImage(url, alt, index) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
        mainImg.src = url;
        mainImg.alt = alt;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function switchTab(tabName, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by tab name
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
                btn.classList.add('active');
            }
        });
    }
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.style.display = 'none';
    });
    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) {
        activePane.style.display = 'block';
    }
}

// Create product card HTML (similar to products.js but standalone)
function createProductCardForDetail(product) {
    const firstImage = product.images && product.images.length > 0 ? product.images[0] : {
        url: 'https://via.placeholder.com/180x150/1a365d/ffffff?text=Product',
        alt: `${product.brand || 'Unknown'} ${product.name}`
    };
    
    const modelDisplay = Array.isArray(product.model) 
        ? product.model.join(', ') 
        : (product.model || '');
    
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
                <div class="price-container">
                    <span class="price-label">Price:</span>
                    <span class="price-value"></span>
                </div>
                <div class="product-actions" style="margin-top: auto;">
                    <a href="product-detail.html?id=${product.id}" class="btn-primary" style="width: 100%; text-align: center; justify-content: center;">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

function loadRelatedProducts(currentProduct, allProducts) {
    const relatedSection = document.getElementById('related-products-section');
    const relatedGrid = document.getElementById('related-products-grid');
    
    if (!relatedSection || !relatedGrid) return;
    
    // Find related products (same category or brand, exclude current)
    const related = allProducts
        .filter(p => p.id !== currentProduct.id && 
                (p.category === currentProduct.category || p.brand === currentProduct.brand))
        .slice(0, 6);
    
    if (related.length === 0) {
        relatedSection.style.display = 'none';
        return;
    }
    
    relatedSection.style.display = 'block';
    relatedGrid.innerHTML = related.map(product => createProductCardForDetail(product)).join('');
}

// Initialize on page load
// Check if we're on the product detail page
function isProductDetailPage() {
    const hasContent = document.getElementById('product-detail-content') !== null;
    const pathname = window.location.pathname;
    const href = window.location.href;
    
    // Check for various possible paths
    const pathnameIncludes = pathname.includes('product-detail.html') || 
                            pathname.includes('/product-detail') ||
                            pathname === '/product-detail' ||
                            pathname.endsWith('product-detail');
    const hrefIncludes = href.includes('product-detail.html') || 
                        href.includes('/product-detail');
    
    console.log('Checking if product detail page:', {
        hasContent,
        pathname: pathname,
        pathnameIncludes,
        href: href,
        hrefIncludes
    });
    
    return hasContent || pathnameIncludes || hrefIncludes;
}

function initializeProductDetailPage() {
    console.log('initializeProductDetailPage called, readyState:', document.readyState);
    
    if (isProductDetailPage()) {
        console.log('Initializing product detail page...');
        loadProductDetail();
    } else {
        console.log('Not on product detail page, skipping initialization');
    }
}

// Initialize immediately if DOM is ready, otherwise wait
// Always try to initialize, regardless of readyState
console.log('product-detail.js loaded, readyState:', document.readyState);
console.log('Current URL:', window.location.href);

if (document.readyState === 'loading') {
    console.log('DOM is loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded fired');
        initializeProductDetailPage();
    });
} else {
    console.log('DOM already loaded, initializing immediately');
    // DOM already loaded
    initializeProductDetailPage();
}

// Also try to initialize after a short delay as a fallback
setTimeout(function() {
    console.log('Fallback initialization check...');
    const container = document.getElementById('product-detail-content');
    if (container && container.innerHTML.includes('Loading product details')) {
        console.log('Still showing loading state, trying to initialize again...');
        initializeProductDetailPage();
    }
}, 100);


