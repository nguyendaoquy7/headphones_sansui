// Main application logic

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section with animation
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 100);
    }
    
    // Update nav links
    updateNavLinks(sectionId);
    
    // Update URL without refresh
    setQueryParam('page', sectionId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load section specific content
    loadSectionContent(sectionId);
}

function updateNavLinks(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    const activeLinkSelectors = [
        `[onclick="showSection('${activeSection}')"]`,
        `[data-section="${activeSection}"]`,
        `.nav-link[href*="${activeSection}"]`
    ];
    
    for (const selector of activeLinkSelectors) {
        const activeLink = document.querySelector(selector);
        if (activeLink) {
            activeLink.classList.add('active');
            break;
        }
    }
}

function loadSectionContent(sectionId) {
    switch (sectionId) {
        case 'home':
            loadHomeContent();
            break;
        case 'products':
            loadProductsContent();
            break;
        case 'about':
            loadAboutContent();
            break;
        case 'contact':
            loadContactContent();
            break;
    }
}

// Home section content
function loadHomeContent() {
    renderFeaturedProducts();
    animateHeroStats();
}

function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProductsGrid');
    if (!featuredGrid) return;
    
    // Get featured products (first 3)
    const featuredProducts = products.slice(0, 3);
    
    featuredGrid.innerHTML = featuredProducts.map(product => 
        generateProductCard(product)
    ).join('');
}

function animateHeroStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        if (isInViewport(stat)) {
            const targetText = stat.textContent;
            const targetNumber = parseInt(targetText.replace(/\D/g, ''));
            if (targetNumber) {
                animateCounter(stat, targetNumber);
            }
        }
    });
}

// Products section content
function loadProductsContent() {
    renderProducts();
    initializeProductFilters();
}

function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = productsToRender.map(product => 
        generateProductCard(product)
    ).join('');
}

function generateProductCard(product) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image" onclick="showProductDetail(${product.id})">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title" onclick="showProductDetail(${product.id})">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews} đánh giá)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    <span class="discount">-${discount}%</span>
                </div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `;
}

function initializeProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(filterProducts, 500));
    }
    
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(filterProducts, 500));
    }
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    let filteredProducts = [...products];
    
    // Filter by category
    const selectedCategory = categoryFilter?.value;
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    // Filter by price range
    const minPrice = minPriceInput ? parseFloat(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) : Infinity;
    
    if (minPrice > 0 || maxPrice < Infinity) {
        filteredProducts = filteredProducts.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }
    
    // Sort products
    const sortOption = sortFilter?.value;
    switch (sortOption) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    
    renderProducts(filteredProducts);
}

function applyPriceFilter() {
    filterProducts();
}

// About section content
function loadAboutContent() {
    // Add any about section specific functionality here
    console.log('About section loaded');
}

// Contact section content
function loadContactContent() {
    initializeContactForm();
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!contactData.name || !contactData.email || !contactData.message) {
        showError('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (!isValidEmail(contactData.email)) {
        showError('Email không hợp lệ!');
        return;
    }
    
    if (contactData.phone && !isValidPhone(contactData.phone)) {
        showError('Số điện thoại không hợp lệ!');
        return;
    }
    
    // Simulate form submission
    showLoading(e.target);
    
    setTimeout(() => {
        hideLoading(e.target);
        showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        e.target.reset();
    }, 1000);
}

// Product detail functions
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // If we're on a single-page app, we might want to show a modal
    // Or navigate to a detail page
    showProductModal(product);
}

function showProductModal(product) {
    // Create product detail modal
    let productModal = document.getElementById('productModal');
    if (!productModal) {
        productModal = document.createElement('div');
        productModal.id = 'productModal';
        productModal.className = 'modal';
        document.body.appendChild(productModal);
    }
    
    productModal.innerHTML = `
        <div class="modal-content product-detail-modal">
            <span class="close" onclick="closeModal('productModal')">&times;</span>
            <div class="product-detail-content">
                <div class="product-detail-image">
                    <div class="main-product-image">${product.image}</div>
                </div>
                <div class="product-detail-info">
                    <div class="product-detail-category">${product.category}</div>
                    <h1>${product.name}</h1>
                    <div class="product-detail-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span>${product.rating} (${product.reviews} đánh giá)</span>
                    </div>
                    <div class="product-detail-price">
                        <span class="detail-current-price">${formatPrice(product.price)}</span>
                        <span class="detail-original-price">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <div class="product-description">
                        ${product.description}
                    </div>
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn-detail" onclick="updateDetailQuantity(-1)">-</button>
                            <input type="number" class="quantity-input" id="detailQuantity" value="1" min="1">
                            <button class="quantity-btn-detail" onclick="updateDetailQuantity(1)">+</button>
                        </div>
                        <button class="add-to-cart-detail" onclick="addToCartFromDetail(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('productModal');
}

function updateDetailQuantity(change) {
    const quantityInput = document.getElementById('detailQuantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, currentValue + change);
        quantityInput.value = newValue;
    }
}

function addToCartFromDetail(productId) {
    const quantityInput = document.getElementById('detailQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    addToCart(productId, quantity);
    closeModal('productModal');
}

// Mobile menu handling
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('mobile-active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters if they exist
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const targetValue = parseInt(counter.textContent.replace(/\D/g, ''));
                    if (targetValue) {
                        animateCounter(counter, targetValue);
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    document.querySelectorAll('.page-section, .product-card, .about-content, .contact-grid').forEach(el => {
        observer.observe(el);
    });
}

// Handle URL routing
function handleRouting() {
    const params = getQueryParams();
    const page = params.page || 'home';
    
    if (['home', 'products', 'about', 'contact'].includes(page)) {
        showSection(page);
    } else {
        showSection('home');
    }
}

// Initialize everything when DOM is ready
function initializeApp() {
    // Handle initial routing
    handleRouting();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Handle browser back/forward
    window.addEventListener('popstate', handleRouting);
    
    console.log('Sansui Headphones app initialized');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}