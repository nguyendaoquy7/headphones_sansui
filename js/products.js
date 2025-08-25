// Products page specific functionality

// Initialize products page
function initializeProductsPage() {
    renderAllProducts();
    initializeProductFilters();
    initializeProductSearch();
    handleProductsRouting();
}

// Render all products with pagination
function renderAllProducts(page = 1, itemsPerPage = 9) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = products.slice(startIndex, endIndex);
    
    grid.innerHTML = productsToShow.map(product => 
        generateProductCard(product, true)
    ).join('');
    
    // Add pagination if needed
    if (products.length > itemsPerPage) {
        renderPagination(page, Math.ceil(products.length / itemsPerPage));
    }
}

// Enhanced product card for products page
function generateProductCard(product, showFullDetails = false) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    
    return `
        <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image" onclick="showProductDetail(${product.id})">
                ${product.image}
                ${showFullDetails ? `
                    <div class="product-overlay">
                        <button class="quick-view-btn" onclick="showProductDetail(${product.id})">
                            <i class="fas fa-eye"></i> Xem nhanh
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title" onclick="showProductDetail(${product.id})">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">${product.rating} (${product.reviews} đánh giá)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice > product.price ? `
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                        <span class="discount">-${discount}%</span>
                    ` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                ${showFullDetails && product.features ? `
                    <div class="product-features-preview">
                        <ul>
                            ${product.features.slice(0, 2).map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Thêm vào giỏ
                    </button>
                    ${showFullDetails ? `
                        <button class="add-to-wishlist" onclick="addToWishlist(${product.id})" title="Thêm vào yêu thích">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="compare-product" onclick="addToCompare(${product.id})" title="So sánh">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        'HI-FI': 'Hi-Fi',
        'GAMING': 'Gaming',
        'WIRELESS': 'Không dây',
        'STUDIO': 'Studio',
        'SPORT': 'Thể thao',
        'VINTAGE': 'Vintage'
    };
    return categoryNames[category] || category;
}

// Enhanced product filtering
function initializeProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceRangeSlider = document.getElementById('priceRangeSlider');
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    // Price inputs
    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(applyFilters, 500));
    }
    
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(applyFilters, 500));
    }
    
    // Initialize price range
    initializePriceRange();
}

// Initialize price range slider
function initializePriceRange() {
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.placeholder = formatPrice(minPrice).replace('₫', '');
        maxPriceInput.placeholder = formatPrice(maxPrice).replace('₫', '');
    }
}

// Apply all filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const searchInput = document.getElementById('productSearch');
    
    let filteredProducts = [...products];
    
    // Search filter
    const searchTerm = searchInput?.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    const selectedCategory = categoryFilter?.value;
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    // Price range filter
    const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || Infinity : Infinity;
    
    if (minPrice > 0 || maxPrice < Infinity) {
        filteredProducts = filteredProducts.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }
    
    // Sort products
    const sortOption = sortFilter?.value || 'default';
    filteredProducts = sortProducts(filteredProducts, sortOption);
    
    // Update display
    renderFilteredProducts(filteredProducts);
    updateFilterSummary(filteredProducts.length, products.length);
}

// Sort products by option
function sortProducts(products, sortOption) {
    const sorted = [...products];
    
    switch (sortOption) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'reviews':
            return sorted.sort((a, b) => b.reviews - a.reviews);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'discount':
            return sorted.sort((a, b) => {
                const discountA = (1 - a.price / a.originalPrice) * 100;
                const discountB = (1 - b.price / b.originalPrice) * 100;
                return discountB - discountA;
            });
        default:
            return sorted;
    }
}

// Render filtered products
function renderFilteredProducts(filteredProducts) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button class="cta-button" onclick="clearFilters()">Xóa bộ lọc</button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => 
        generateProductCard(product, true)
    ).join('');
    
    // Add loading animation
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Update filter summary
function updateFilterSummary(filteredCount, totalCount) {
    let summaryElement = document.getElementById('filterSummary');
    if (!summaryElement) {
        summaryElement = document.createElement('div');
        summaryElement.id = 'filterSummary';
        summaryElement.className = 'filter-summary';
        
        const container = document.querySelector('.products-section .container');
        if (container) {
            const filtersSection = container.querySelector('.product-filters');
            if (filtersSection) {
                filtersSection.after(summaryElement);
            }
        }
    }
    
    summaryElement.textContent = `Hiển thị ${filteredCount} trong tổng số ${totalCount} sản phẩm`;
}

// Clear all filters
function clearFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const searchInput = document.getElementById('productSearch');
    
    if (categoryFilter) categoryFilter.value = '';
    if (sortFilter) sortFilter.value = 'default';
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

// Product search functionality
function initializeProductSearch() {
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        
        // Add search suggestions
        initializeSearchSuggestions(searchInput);
    }
}

// Initialize search suggestions
function initializeSearchSuggestions(searchInput) {
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionsContainer);
    }
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const suggestions = products
            .filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(product => ({
                name: product.name,
                category: product.category,
                id: product.id
            }));
        
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="selectSuggestion('${suggestion.name}', ${suggestion.id})">
                    <span class="suggestion-name">${suggestion.name}</span>
                    <span class="suggestion-category">${getCategoryName(suggestion.category)}</span>
                </div>
            `).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Select search suggestion
function selectSuggestion(productName, productId) {
    const searchInput = document.getElementById('productSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (searchInput) {
        searchInput.value = productName;
        applyFilters();
    }
    
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Pagination functionality
function renderPagination(currentPage, totalPages) {
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.className = 'pagination';
        
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.after(paginationContainer);
        }
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Trước
            </button>
        `;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn" onclick="goToPage(${currentPage + 1})">
                Sau <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    renderAllProducts(page);
    scrollToElement('productsGrid', 100);
}

// Wishlist functionality
let wishlist = [];

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (product && !wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        updateWishlistUI();
        showSuccess('Đã thêm vào danh sách yêu thích!');
        
        // Update heart icon
        const heartIcon = document.querySelector(`[onclick="addToWishlist(${productId})"] i`);
        if (heartIcon) {
            heartIcon.className = 'fas fa-heart';
            heartIcon.parentElement.onclick = () => removeFromWishlist(productId);
        }
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlistUI();
    showSuccess('Đã xóa khỏi danh sách yêu thích!');
    
    // Update heart icon
    const heartIcon = document.querySelector(`[onclick="removeFromWishlist(${productId})"] i`);
    if (heartIcon) {
        heartIcon.className = 'far fa-heart';
        heartIcon.parentElement.onclick = () => addToWishlist(productId);
    }
}

function updateWishlistUI() {
    // Update wishlist count if there's a wishlist counter
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.classList.toggle('show', wishlist.length > 0);
    }
}

// Compare functionality
let compareList = [];

function addToCompare(productId) {
    if (compareList.length >= 3) {
        showError('Chỉ có thể so sánh tối đa 3 sản phẩm!');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && !compareList.find(item => item.id === productId)) {
        compareList.push(product);
        updateCompareUI();
        showSuccess('Đã thêm vào danh sách so sánh!');
    }
}

function removeFromCompare(productId) {
    compareList = compareList.filter(item => item.id !== productId);
    updateCompareUI();
}

function updateCompareUI() {
    const compareCount = document.getElementById('compareCount');
    if (compareCount) {
        compareCount.textContent = compareList.length;
        compareCount.classList.toggle('show', compareList.length > 0);
    }
}

function showCompareModal() {
    if (compareList.length < 2) {
        showError('Cần ít nhất 2 sản phẩm để so sánh!');
        return;
    }
    
    // Create and show compare modal
    let compareModal = document.getElementById('compareModal');
    if (!compareModal) {
        compareModal = document.createElement('div');
        compareModal.id = 'compareModal';
        compareModal.className = 'modal';
        document.body.appendChild(compareModal);
    }
    
    compareModal.innerHTML = `
        <div class="modal-content compare-modal-content">
            <span class="close" onclick="closeModal('compareModal')">&times;</span>
            <h2>So sánh sản phẩm</h2>
            <div class="compare-table">
                ${renderCompareTable()}
            </div>
        </div>
    `;
    
    showModal('compareModal');
}

function renderCompareTable() {
    // Implementation for compare table
    return '<p>Bảng so sánh sản phẩm sẽ được hiển thị ở đây</p>';
}

// Handle routing for products page
function handleProductsRouting() {
    const params = getQueryParams();
    
    // Handle category filter from URL
    if (params.category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = params.category;
            applyFilters();
        }
    }
    
    // Handle search from URL
    if (params.search) {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = decodeURIComponent(params.search);
            applyFilters();
        }
    }
}

// Quick price filter buttons
function createQuickPriceFilters() {
    const priceRanges = [
        { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
        { label: '1 - 2 triệu', min: 1000000, max: 2000000 },
        { label: '2 - 5 triệu', min: 2000000, max: 5000000 },
        { label: 'Trên 5 triệu', min: 5000000, max: Infinity }
    ];
    
    let quickFiltersContainer = document.getElementById('quickPriceFilters');
    if (!quickFiltersContainer) {
        quickFiltersContainer = document.createElement('div');
        quickFiltersContainer.id = 'quickPriceFilters';
        quickFiltersContainer.className = 'quick-price-filters';
        
        const filtersSection = document.querySelector('.product-filters');
        if (filtersSection) {
            filtersSection.appendChild(quickFiltersContainer);
        }
    }
    
    quickFiltersContainer.innerHTML = priceRanges.map((range, index) => `
        <button class="quick-filter-btn" onclick="applyQuickPriceFilter(${range.min}, ${range.max === Infinity ? 'null' : range.max})">
            ${range.label}
        </button>
    `).join('');
}

function applyQuickPriceFilter(min, max) {
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (minPriceInput) minPriceInput.value = min;
    if (maxPriceInput) maxPriceInput.value = max || '';
    
    applyFilters();
}

// Initialize products page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductsPage);
} else {
    initializeProductsPage();
}