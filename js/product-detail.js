// Product detail page functionality

let currentProduct = null;
let selectedQuantity = 1;

// Initialize product detail page
function initializeProductDetail() {
    loadProductFromURL();
    initializeQuantityControls();
    initializeTabs();
    initializeImageGallery();
}

// Load product from URL parameter
function loadProductFromURL() {
    const params = getQueryParams();
    const productId = parseInt(params.id);
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            renderProductDetail(product);
            loadRelatedProducts(product);
        } else {
            showProductNotFound();
        }
    } else {
        // Redirect to products page if no ID provided
        window.location.href = 'products.html';
    }
}

// Render product detail information
function renderProductDetail(product) {
    currentProduct = product;
    
    // Update page title
    updatePageTitle(product.name);
    updateBreadcrumb(product);
    
    // Render product info
    renderProductInfo(product);
    renderProductDescription(product);
    renderProductSpecifications(product);
    renderProductReviews(product);
    
    // Initialize product-specific functionality
    initializeProductActions();
}

// Update page title and meta information
function updatePageTitle(productName) {
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = `${productName} - Sansui Headphones`;
    }
    document.title = `${productName} - Sansui Headphones`;
}

// Update breadcrumb navigation
function updateBreadcrumb(product) {
    const breadcrumb = document.getElementById('breadcrumb');
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    
    if (productBreadcrumb) {
        productBreadcrumb.textContent = product.name;
    }
}

// Render main product information
function renderProductInfo(product) {
    const productInfo = document.getElementById('productInfo');
    if (!productInfo) return;
    
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    
    productInfo.innerHTML = `
        <div class="product-detail-category">${getCategoryName(product.category)}</div>
        <h1>${product.name}</h1>
        
        <div class="product-detail-rating">
            <div class="stars">${generateStars(product.rating)}</div>
            <span class="rating-value">${product.rating}</span>
            <span class="rating-count">(${product.reviews} đánh giá)</span>
            <a href="#reviews" class="write-review-link" onclick="showTab('reviews')">Viết đánh giá</a>
        </div>
        
        <div class="product-detail-price">
            <span class="detail-current-price">${formatPrice(product.price)}</span>
            ${product.originalPrice > product.price ? `
                <span class="detail-original-price">${formatPrice(product.originalPrice)}</span>
                <span class="detail-discount">Tiết kiệm ${discount}%</span>
            ` : ''}
        </div>
        
        <div class="product-availability ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
            <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <span>${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</span>
        </div>
        
        <div class="product-description-short">
            <p>${product.description}</p>
        </div>
        
        ${product.features ? `
            <div class="product-features">
                <h3>Tính năng nổi bật:</h3>
                <ul class="features-list">
                    ${product.features.map(feature => `
                        <li><i class="fas fa-check-circle"></i> ${feature}</li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div class="product-actions">
            <div class="quantity-selector">
                <label>Số lượng:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn-detail" onclick="updateQuantity(-1)" ${product.stock <= 0 ? 'disabled' : ''}>-</button>
                    <input type="number" class="quantity-input" id="productQuantity" value="1" min="1" max="${product.stock || 1}">
                    <button class="quantity-btn-detail" onclick="updateQuantity(1)" ${product.stock <= 0 ? 'disabled' : ''}>+</button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="add-to-cart-detail ${product.stock <= 0 ? 'disabled' : ''}" 
                        onclick="addToCartFromDetail()" ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
                
                <button class="buy-now-btn ${product.stock <= 0 ? 'disabled' : ''}" 
                        onclick="buyNow()" ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-bolt"></i>
                    Mua ngay
                </button>
            </div>
            
            <div class="secondary-actions">
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" 
                        title="Thêm vào yêu thích">
                    <i class="far fa-heart"></i>
                    <span>Yêu thích</span>
                </button>
                
                <button class="compare-btn" onclick="addToCompare(${product.id})" 
                        title="Thêm vào so sánh">
                    <i class="fas fa-balance-scale"></i>
                    <span>So sánh</span>
                </button>
                
                <button class="share-btn" onclick="shareProduct()" 
                        title="Chia sẻ sản phẩm">
                    <i class="fas fa-share-alt"></i>
                    <span>Chia sẻ</span>
                </button>
            </div>
        </div>
        
        <div class="product-guarantees">
            <div class="guarantee-item">
                <i class="fas fa-shield-alt"></i>
                <span>Bảo hành chính hãng ${product.specifications?.['Bảo hành'] || '2 năm'}</span>
            </div>
            <div class="guarantee-item">
                <i class="fas fa-shipping-fast"></i>
                <span>Miễn phí vận chuyển toàn quốc</span>
            </div>
            <div class="guarantee-item">
                <i class="fas fa-undo"></i>
                <span>Đổi trả trong 7 ngày</span>
            </div>
            <div class="guarantee-item">
                <i class="fas fa-phone"></i>
                <span>Hỗ trợ 24/7</span>
            </div>
        </div>
    `;
}

// Initialize quantity controls
function initializeQuantityControls() {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const max = parseInt(this.max);
            const min = parseInt(this.min);
            
            if (value > max) this.value = max;
            if (value < min) this.value = min;
            
            selectedQuantity = parseInt(this.value);
        });
    }
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput && currentProduct) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = currentValue + change;
        const maxStock = currentProduct.stock || 1;
        
        if (newValue >= 1 && newValue <= maxStock) {
            quantityInput.value = newValue;
            selectedQuantity = newValue;
        }
    }
}

// Add to cart from detail page
function addToCartFromDetail() {
    if (currentProduct && currentProduct.stock > 0) {
        const quantity = selectedQuantity;
        const success = addToCart(currentProduct.id, quantity);
        
        if (success) {
            // Show add to cart animation
            animateAddToCart();
        }
    }
}

// Buy now functionality
function buyNow() {
    if (currentProduct && currentProduct.stock > 0) {
        // Add to cart first
        addToCart(currentProduct.id, selectedQuantity);
        
        // Redirect to checkout
        setTimeout(() => {
            if (currentUser) {
                showCart();
                // Auto click checkout
                setTimeout(() => {
                    const checkoutBtn = document.getElementById('checkoutBtn');
                    if (checkoutBtn) {
                        checkoutBtn.click();
                    }
                }, 500);
            } else {
                showLoginModal();
                showSuccess('Vui lòng đăng nhập để mua hàng');
            }
        }, 500);
    }
}

// Animate add to cart
function animateAddToCart() {
    const cartIcon = document.querySelector('.nav-icon i.fa-shopping-cart');
    const addToCartBtn = document.querySelector('.add-to-cart-detail');
    
    if (cartIcon && addToCartBtn) {
        const flyingCart = document.createElement('i');
        flyingCart.className = 'fas fa-shopping-cart flying-cart';
        
        const btnRect = addToCartBtn.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        flyingCart.style.position = 'fixed';
        flyingCart.style.left = btnRect.left + 'px';
        flyingCart.style.top = btnRect.top + 'px';
        flyingCart.style.zIndex = '9999';
        flyingCart.style.color = 'var(--primary-color)';
        flyingCart.style.fontSize = '20px';
        flyingCart.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(flyingCart);
        
        setTimeout(() => {
            flyingCart.style.left = cartRect.left + 'px';
            flyingCart.style.top = cartRect.top + 'px';
            flyingCart.style.transform = 'scale(0.5)';
            flyingCart.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            document.body.removeChild(flyingCart);
        }, 900);
    }
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const isInWishlist = wishlist.find(item => item.id === productId);
    
    if (isInWishlist) {
        removeFromWishlist(productId);
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i><span>Yêu thích</span>';
            wishlistBtn.classList.remove('active');
        }
    } else {
        addToWishlist(productId);
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Đã thích</span>';
            wishlistBtn.classList.add('active');
        }
    }
}

// Share product
function shareProduct() {
    if (navigator.share && currentProduct) {
        navigator.share({
            title: currentProduct.name,
            text: currentProduct.description,
            url: window.location.href
        });
    } else {
        // Fallback to copy URL
        copyToClipboard(window.location.href);
        showSuccess('Đã sao chép link sản phẩm!');
    }
}

// Initialize tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });
}

// Show specific tab
function showTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    const activeBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Render product description
function renderProductDescription(product) {
    const descriptionTab = document.getElementById('description-tab');
    if (descriptionTab && product.detailDescription) {
        descriptionTab.innerHTML = `
            <div class="detailed-description">
                ${product.detailDescription}
            </div>
        `;
    }
}

// Render product specifications
function renderProductSpecifications(product) {
    const specificationsTable = document.getElementById('specificationsTable');
    if (specificationsTable && product.specifications) {
        specificationsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Thông số</th>
                    <th>Chi tiết</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.specifications).map(([key, value]) => `
                    <tr>
                        <td><strong>${key}</strong></td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }
}

// Render product reviews
function renderProductReviews(product) {
    const reviewsContent = document.getElementById('reviewsContent');
    if (!reviewsContent) return;
    
    // Generate mock reviews based on product rating and review count
    const reviews = generateMockReviews(product);
    
    reviewsContent.innerHTML = `
        <div class="reviews-summary">
            <div class="rating-overview">
                <div class="overall-rating">
                    <span class="rating-number">${product.rating}</span>
                    <div class="rating-stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">dựa trên ${product.reviews} đánh giá</span>
                </div>
                <div class="rating-breakdown">
                    ${generateRatingBreakdown(product.rating)}
                </div>
            </div>
            
            <div class="write-review-section">
                <h4>Viết đánh giá của bạn</h4>
                <form class="review-form" onsubmit="submitReview(event)">
                    <div class="rating-input">
                        <label>Đánh giá của bạn:</label>
                        <div class="star-rating-input" data-rating="0">
                            ${[1,2,3,4,5].map(i => `<i class="far fa-star" data-value="${i}"></i>`).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="reviewName">Họ tên:</label>
                        <input type="text" id="reviewName" required>
                    </div>
                    <div class="form-group">
                        <label for="reviewComment">Nhận xét:</label>
                        <textarea id="reviewComment" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="submit-review-btn">Gửi đánh giá</button>
                </form>
            </div>
        </div>
        
        <div class="reviews-list">
            <h4>Đánh giá từ khách hàng</h4>
            ${reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <strong class="reviewer-name">${review.name}</strong>
                            <div class="review-rating">${generateStars(review.rating)}</div>
                        </div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-content">
                        <p>${review.comment}</p>
                    </div>
                    ${review.helpful ? `
                        <div class="review-actions">
                            <button class="helpful-btn">
                                <i class="fas fa-thumbs-up"></i>
                                Hữu ích (${review.helpful})
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    // Initialize star rating input
    initializeStarRating();
}

// Generate mock reviews
function generateMockReviews(product) {
    const reviewTemplates = [
        {
            name: "Nguyễn Văn A",
            rating: 5,
            comment: "Sản phẩm rất tốt, chất lượng âm thanh tuyệt vời. Đóng gói cẩn thận, giao hàng nhanh.",
            date: "2024-01-15",
            helpful: 12
        },
        {
            name: "Trần Thị B",
            rating: 4,
            comment: "Tai nghe đẹp, âm bass ổn. Giá hợp lý so với chất lượng.",
            date: "2024-01-10",
            helpful: 8
        },
        {
            name: "Lê Minh C",
            rating: 5,
            comment: "Mình rất hài lòng với sản phẩm này. Thiết kế đẹp mắt và âm thanh chất lượng cao.",
            date: "2024-01-08",
            helpful: 15
        }
    ];
    
    return reviewTemplates.slice(0, Math.min(3, Math.floor(product.reviews / 50)));
}

// Generate rating breakdown
function generateRatingBreakdown(overallRating) {
    const breakdown = [
        { stars: 5, percentage: Math.round(overallRating * 20) },
        { stars: 4, percentage: Math.round((5 - overallRating) * 15) },
        { stars: 3, percentage: Math.round((5 - overallRating) * 8) },
        { stars: 2, percentage: Math.round((5 - overallRating) * 3) },
        { stars: 1, percentage: Math.round((5 - overallRating) * 2) }
    ];
    
    return breakdown.map(item => `
        <div class="rating-bar">
            <span class="rating-label">${item.stars} sao</span>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${item.percentage}%"></div>
            </div>
            <span class="rating-percentage">${item.percentage}%</span>
        </div>
    `).join('');
}

// Initialize star rating input
function initializeStarRating() {
    const starRating = document.querySelector('.star-rating-input');
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                starRating.setAttribute('data-rating', rating);
                
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.className = 'fas fa-star';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = index + 1;
                
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.className = 'fas fa-star';
                        s.style.color = '#ffa500';
                    } else {
                        s.className = 'far fa-star';
                        s.style.color = '#ddd';
                    }
                });
            });
        });
        
        starRating.addEventListener('mouseleave', () => {
            const currentRating = parseInt(starRating.getAttribute('data-rating'));
            
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.className = 'fas fa-star';
                    s.style.color = '#ffa500';
                } else {
                    s.className = 'far fa-star';
                    s.style.color = '#ddd';
                }
            });
        });
    }
}

// Submit review
function submitReview(event) {
    event.preventDefault();
    
    const form = event.target;
    const rating = document.querySelector('.star-rating-input').getAttribute('data-rating');
    const name = form.reviewName.value;
    const comment = form.reviewComment.value;
    
    if (!rating || rating === '0') {
        showError('Vui lòng chọn số sao đánh giá!');
        return;
    }
    
    // Simulate review submission
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        showSuccess('Cảm ơn bạn đã đánh giá sản phẩm!');
        form.reset();
        document.querySelector('.star-rating-input').setAttribute('data-rating', '0');
        document.querySelectorAll('.star-rating-input i').forEach(star => {
            star.className = 'far fa-star';
            star.style.color = '#ddd';
        });
    }, 1000);
}

// Initialize image gallery
function initializeImageGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.getElementById('thumbnails');
    
    if (!currentProduct || !mainImage) return;
    
    // For now, we'll use emoji icons as images
    // In a real application, you'd have actual product images
    const productImages = [
        currentProduct.image,
        currentProduct.image,
        currentProduct.image
    ];
    
    // Generate thumbnails
    if (thumbnails) {
        thumbnails.innerHTML = productImages.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="showImage(${index})" 
                 data-image="${img}">
                ${img}
            </div>
        `).join('');
    }
}

// Show specific image
function showImage(index) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails[index]) {
        const newImage = thumbnails[index].getAttribute('data-image');
        mainImage.innerHTML = newImage;
        
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }
}

// Load related products
function loadRelatedProducts(currentProduct) {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer) return;
    
    // Find products in the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no products in same category, show random products
        const randomProducts = products
            .filter(p => p.id !== currentProduct.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        
        relatedProductsContainer.innerHTML = randomProducts.map(product => 
            generateProductCard(product)
        ).join('');
    } else {
        relatedProductsContainer.innerHTML = relatedProducts.map(product => 
            generateProductCard(product)
        ).join('');
    }
}

// Show product not found
function showProductNotFound() {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Không tìm thấy sản phẩm</h2>
                <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã được gỡ bỏ.</p>
                <a href="products.html" class="cta-button">
                    <i class="fas fa-arrow-left"></i>
                    Quay lại trang sản phẩm
                </a>
            </div>
        `;
    }
}

// Initialize product actions
function initializeProductActions() {
    // Update wishlist button state
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn && currentProduct) {
        const isInWishlist = wishlist.find(item => item.id === currentProduct.id);
        if (isInWishlist) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Đã thích</span>';
            wishlistBtn.classList.add('active');
        }
    }
    
    // Update compare button state
    const compareBtn = document.querySelector('.compare-btn');
    if (compareBtn && currentProduct) {
        const isInCompare = compareList.find(item => item.id === currentProduct.id);
        if (isInCompare) {
            compareBtn.classList.add('active');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductDetail);
} else {
    initializeProductDetail();
}