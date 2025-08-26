// Products management functionality

let filteredProducts = [...products];
let currentFilters = {
    category: '',
    priceMin: '',
    priceMax: '',
    sort: 'default'
};

// Display products in grid
function displayProducts(productsToShow = products, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p>Không tìm thấy sản phẩm nào</p>
            </div>
        `;
        return;
    }
    
    const productsHTML = productsToShow.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
}

// Create product card HTML
function createProductCard(product) {
    const discount = product.originalPrice ? 
        Math.round((product.originalPrice - product.price) / product.originalPrice * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            
            <div class="product-image" onclick="viewProduct(${product.id})">
                ${product.image}
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} đánh giá)</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice ? 
                        `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                </div>
                
                <p class="product-description">${product.description}</p>
                
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `;
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Filter products by category
function filterByCategory(category = '') {
    currentFilters.category = category;
    applyFilters();
}

// Sort products
function sortProducts(sortType = 'default') {
    currentFilters.sort = sortType;
    applyFilters();
}

// Apply price filter
function applyPriceFilter() {
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;
    
    currentFilters.priceMin = minPrice ? parseInt(minPrice) : '';
    currentFilters.priceMax = maxPrice ? parseInt(maxPrice) : '';
    
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let filtered = [...products];
    
    // Category filter
    if (currentFilters.category) {
        filtered = filtered.filter(product => 
            product.category === currentFilters.category
        );
    }
    
    // Price filter
    if (currentFilters.priceMin !== '') {
        filtered = filtered.filter(product => 
            product.price >= currentFilters.priceMin
        );
    }
    
    if (currentFilters.priceMax !== '') {
        filtered = filtered.filter(product => 
            product.price <= currentFilters.priceMax
        );
    }
    
    // Sorting
    switch (currentFilters.sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order
            break;
    }
    
    filteredProducts = filtered;
    displayProducts(filteredProducts);
}

// Search products
function searchProducts(query) {
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(searchResults);
}

// Get featured products (for homepage)
function getFeaturedProducts(limit = 4) {
    return products
        .filter(product => product.badge === 'Bán chạy' || product.badge === 'Mới nhất')
        .slice(0, limit);
}

// Initialize products page
function initProductsPage() {
    // Set up filter event listeners
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterByCategory(e.target.value);
        });
    }
    
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
    
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(applyPriceFilter, 500));
    }
    
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(applyPriceFilter, 500));
    }
    
    // Display all products initially
    displayProducts(products);
}

// Initialize homepage products
function initHomePage() {
    const featuredProducts = getFeaturedProducts();
    displayProducts(featuredProducts, 'featuredProductsGrid');
}

// Initialize product detail page
function initProductDetail() {
    const productId = getUrlParameter('id');
    if (productId) {
        displayProductDetail(parseInt(productId));
    }
}

// Get related products
function getRelatedProducts(currentProductId, category, limit = 4) {
    return products
        .filter(product => 
            product.id !== currentProductId && 
            product.category === category
        )
        .slice(0, limit);
}

// Initialize based on current page
function initProducts() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('products.html')) {
        initProductsPage();
    } else if (currentPage.includes('index.html') || currentPage === '/') {
        initHomePage();
    } else if (currentPage.includes('product-detail.html')) {
        initProductDetail();
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initProducts();
});

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            } else {
                displayProducts(products);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    searchProducts(query);
                } else {
                    displayProducts(products);
                }
            }
        });
        
        // Real-time search
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                searchProducts(query);
            } else if (query.length === 0) {
                displayProducts(products);
            }
        }, 300));
    }
}

// Initialize search when DOM loads
document.addEventListener('DOMContentLoaded', initSearch);