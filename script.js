let currentUser = null;
let cart = [];
let products = [
    {
        id: 1,
        name: "Sansui HD-990 Pro",
        category: "HI-FI",
        price: 2990000,
        originalPrice: 3490000,
        image: "🎧",
        rating: 4.8,
        reviews: 124,
        description: "Tai nghe Hi-Fi cao cấp với driver 50mm, âm thanh chi tiết và bass sâu.",
        badge: "Bán chạy",
        features: [
            "Driver 50mm chất lượng cao",
            "Thiết kế over-ear thoải mái",
            "Dây cáp có thể tháo rời",
            "Âm thanh vòm 7.1"
        ],
        specifications: {
            "Loại tai nghe": "Over-ear",
            "Kích thước driver": "50mm",
            "Tần số đáp ứng": "20Hz - 20kHz",
            "Độ nhạy": "110dB",
            "Trở kháng": "32Ω",
            "Trọng lượng": "300g"
        },
        thumbnails: ["🎧", "🎵", "🔊"]
    },
    {
        id: 2,
        name: "Sansui Gaming X7",
        category: "GAMING",
        price: 1590000,
        originalPrice: 1890000,
        image: "🎮",
        rating: 4.6,
        reviews: 89,
        description: "Tai nghe gaming chuyên nghiệp với micro có thể tháo rời và LED RGB.",
        badge: "Gaming",
        features: [
            "Micro chống ồn tháo rời",
            "Hệ thống đèn LED RGB",
            "Kết nối USB và 3.5mm",
            "Âm thanh vòm 7.1"
        ],
        specifications: {
            "Loại tai nghe": "Over-ear",
            "Kích thước driver": "40mm",
            "Tần số đáp ứng": "20Hz - 20kHz",
            "Độ nhạy": "105dB",
            "Trở kháng": "32Ω",
            "Trọng lượng": "280g"
        },
        thumbnails: ["🎮", "🎤", "💡"]
    },
    {
        id: 3,
        name: "Sansui Wireless Elite",
        category: "WIRELESS",
        price: 3990000,
        originalPrice: 4490000,
        image: "📱",
        rating: 4.9,
        reviews: 156,
        description: "Tai nghe không dây cao cấp với công nghệ ANC và thời lượng pin 30h.",
        badge: "Mới nhất",
        features: [
            "Công nghệ chống ồn chủ động (ANC)",
            "Thời lượng pin lên đến 30 giờ",
            "Kết nối Bluetooth 5.0",
            "Sạc nhanh USB-C"
        ],
        specifications: {
            "Loại tai nghe": "Over-ear",
            "Kích thước driver": "40mm",
            "Tần số đáp ứng": "15Hz - 22kHz",
            "Độ nhạy": "108dB",
            "Trở kháng": "32Ω",
            "Trọng lượng": "250g"
        },
        thumbnails: ["📱", "🔇", "🔋"]
    },
    {
        id: 4,
        name: "Sansui Studio Monitor",
        category: "STUDIO",
        price: 4990000,
        originalPrice: 5990000,
        image: "🎵",
        rating: 4.7,
        reviews: 67,
        description: "Tai nghe studio monitor chuyên nghiệp cho nhà sản xuất âm nhạc.",
        badge: "Pro",
        features: [
            "Âm thanh trung thực",
            "Thiết kế đóng kín",
            "Dây cáp dài 3m",
            "Đệm tai thoải mái"
        ],
        specifications: {
            "Loại tai nghe": "Over-ear",
            "Kích thước driver": "50mm",
            "Tần số đáp ứng": "10Hz - 30kHz",
            "Độ nhạy": "112dB",
            "Trở kháng": "64Ω",
            "Trọng lượng": "320g"
        },
        thumbnails: ["🎵", "🎙️", "🔌"]
    },
    {
        id: 5,
        name: "Sansui Sport Active",
        category: "SPORT",
        price: 990000,
        originalPrice: 1290000,
        image: "🏃",
        rating: 4.4,
        reviews: 203,
        description: "Tai nghe thể thao chống nước IPX7, phù hợp cho mọi hoạt động.",
        badge: "Thể thao",
        features: [
            "Chống nước IPX7",
            "Thiết kế in-ear chắc chắn",
            "Thời lượng pin 12 giờ",
            "Móc tai cố định"
        ],
        specifications: {
            "Loại tai nghe": "In-ear",
            "Kích thước driver": "10mm",
            "Tần số đáp ứng": "20Hz - 20kHz",
            "Độ nhạy": "100dB",
            "Trở kháng": "16Ω",
            "Trọng lượng": "25g"
        },
        thumbnails: ["🏃", "💦", "🔄"]
    },
    {
        id: 6,
        name: "Sansui Classic Vintage",
        category: "VINTAGE",
        price: 2490000,
        originalPrice: 2990000,
        image: "🎼",
        rating: 4.5,
        reviews: 98,
        description: "Tai nghe phong cách vintage với âm thanh ấm áp, thiết kế cổ điển.",
        badge: "Vintage",
        features: [
            "Thiết kế retro độc đáo",
            "Âm thanh ấm áp",
            "Đệm da cao cấp",
            "Dây cáp bện chống rối"
        ],
        specifications: {
            "Loại tai nghe": "Over-ear",
            "Kích thước driver": "40mm",
            "Tần số đáp ứng": "20Hz - 20kHz",
            "Độ nhạy": "108dB",
            "Trở kháng": "32Ω",
            "Trọng lượng": "280g"
        },
        thumbnails: ["🎼", "🎨", "🔗"]
    }
];

// User menu functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu.contains(event.target)) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showLoginModal() {
    showModal('loginModal');
}

function showRegisterModal() {
    showModal('registerModal');
}

function switchToRegister() {
    closeModal('loginModal');
    showModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    showModal('loginModal');
}

function showProfile() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileAddress').value = currentUser.address || '';
        showModal('profileModal');
    }
}

// Auth functions
function login(email, password) {
    currentUser = {
        email: email,
        name: email.split('@')[0],
        phone: '',
        address: ''
    };
    
    document.getElementById('loggedOutMenu').style.display = 'none';
    document.getElementById('loggedInMenu').style.display = 'block';
    
    showSuccess('Đăng nhập thành công!');
    closeModal('loginModal');
}

function logout() {
    currentUser = null;
    document.getElementById('loggedOutMenu').style.display = 'block';
    document.getElementById('loggedInMenu').style.display = 'none';
    showSuccess('Đăng xuất thành công!');
}

// Product functions
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = products.map(product => `
            <div class="product-card" onclick="viewProductDetail(${product.id})">
                <div class="product-badge">${product.badge}</div>
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                        </div>
                        <span class="rating-text">${product.rating} (${product.reviews} đánh giá)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                        <span class="discount">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product || !document.getElementById('productName')) return;

    // Populate product details
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productBadge').textContent = product.badge;
    document.getElementById('mainProductImage').innerHTML = product.image;
    document.getElementById('productStars').innerHTML = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    document.getElementById('productRating').textContent = `${product.rating} (${product.reviews} đánh giá)`;
    document.getElementById('currentPrice').textContent = formatPrice(product.price);
    document.getElementById('originalPrice').textContent = formatPrice(product.originalPrice);
    document.getElementById('discount').textContent = `-${Math.round((1 - product.price/product.originalPrice) * 100)}%`;
    document.getElementById('description').innerHTML = `<p>${product.description}</p>`;

    // Populate features
    document.getElementById('productFeatures').innerHTML = product.features.map(feature => `
        <li><i class="fas fa-check"></i> ${feature}</li>
    `).join('');

    // Populate specifications
    document.getElementById('specificationsTable').innerHTML = Object.entries(product.specifications).map(([key, value]) => `
        <tr>
            <th>${key}</th>
            <td>${value}</td>
        </tr>
    `).join('');

    // Populate thumbnails
    document.getElementById('productThumbnails').innerHTML = product.thumbnails.map((thumb, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeProductImage('${thumb}')">${thumb}</div>
    `).join('');

    // Populate reviews (static for now)
    document.getElementById('reviews').innerHTML = `
        <p>Khách hàng A: Sản phẩm tuyệt vời, âm thanh rất chi tiết!</p>
        <p>Khách hàng B: Thoải mái khi đeo lâu, đáng giá với số tiền bỏ ra.</p>
    `;
}

function changeProductImage(image) {
    document.getElementById('mainProductImage').innerHTML = image;
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Cart functions
let detailQuantity = 1;

function updateDetailQuantity(change) {
    detailQuantity = Math.max(1, detailQuantity + change);
    document.getElementById('quantityInput').value = detailQuantity;
}

function addToCartFromDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += detailQuantity;
        } else {
            cart.push({...product, quantity: detailQuantity});
        }
        updateCartUI();
        showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
        detailQuantity = 1;
        document.getElementById('quantityInput').value = detailQuantity;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        updateCartUI();
        showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            renderCart();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('show', totalItems > 0);
}

function showCart() {
    renderCart();
    showModal('cartModal');
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Giỏ hàng trống</div>';
        cartTotal.textContent = 'Tổng cộng: 0đ';
        document.getElementById('checkoutBtn').style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Tổng cộng: ${formatPrice(total)}`;
    document.getElementById('checkoutBtn').style.display = 'block';
}

function checkout() {
    if (!currentUser) {
        closeModal('cartModal');
        showLoginModal();
        showSuccess('Vui lòng đăng nhập để thanh toán');
        return;
    }
    
    if (cart.length === 0) {
        showSuccess('Giỏ hàng trống!');
        return;
    }

    cart = [];
    updateCartUI();
    closeModal('cartModal');
    showSuccess('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
}

// Form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showSuccess('Mật khẩu không khớp!');
        return;
    }
    
    login(email, password);
    closeModal('registerModal');
    showSuccess('Đăng ký thành công!');
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        this.reset();
    });
}

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentUser) {
        currentUser.name = document.getElementById('profileName').value;
        currentUser.phone = document.getElementById('profilePhone').value;
        currentUser.address = document.getElementById('profileAddress').value;
        closeModal('profileModal');
        showSuccess('Cập nhật thông tin thành công!');
    }
});

// Success message
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    successText.textContent = message;
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderProductDetail();
    updateCartUI();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});