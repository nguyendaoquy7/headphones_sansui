// Shopping cart functionality
let cart = [];

// Load cart from localStorage when page loads
function loadCart() {
    const savedCart = localStorage.getItem('sansui_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('sansui_cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showSuccess(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showSuccess(`Đã xóa "${itemName}" khỏi giỏ hàng!`);
    }
}

// Update item quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);
    }
}

// Show cart modal
function showCart() {
    updateCartDisplay();
    showModal('cartModal');
}

// Update cart display in modal
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p>Giỏ hàng của bạn đang trống</p>
                <button class="cta-button" onclick="closeModal('cartModal')">
                    Tiếp tục mua sắm
                </button>
            </div>
        `;
        cartTotal.textContent = 'Tổng cộng: 0đ';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-image">${item.image}</div>
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    ${formatCurrency(itemTotal)}
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Xóa sản phẩm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `Tổng cộng: ${formatCurrency(total)}`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showSuccess('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    if (!currentUser) {
        closeModal('cartModal');
        showLoginModal();
        showSuccess('Vui lòng đăng nhập để tiếp tục thanh toán!');
        return;
    }
    
    // Simulate checkout process
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = {
        items: [...cart],
        total: total,
        user: currentUser,
        orderDate: new Date().toISOString(),
        orderId: 'ORD' + Date.now()
    };
    
    // Clear cart after successful checkout
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    closeModal('cartModal');
    
    showSuccess(`Đặt hàng thành công! Mã đơn hàng: ${orderDetails.orderId}`);
    
    // In a real app, this would send the order to the server
    console.log('Order placed:', orderDetails);
}

// Clear entire cart
function clearCart() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showSuccess('Đã xóa toàn bộ giỏ hàng!');
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Add event listener for add to cart buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart') || 
            event.target.closest('.add-to-cart')) {
            
            const button = event.target.classList.contains('add-to-cart') ? 
                          event.target : event.target.closest('.add-to-cart');
            
            const productId = button.getAttribute('data-product-id');
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            if (productId) {
                addToCart(parseInt(productId), quantity);
            }
        }
    });
});

// Mini cart functionality (for header)
function toggleMiniCart() {
    const miniCart = document.getElementById('miniCart');
    if (miniCart) {
        miniCart.classList.toggle('show');
    }
}

// Update mini cart display
function updateMiniCartDisplay() {
    const miniCartItems = document.getElementById('miniCartItems');
    const miniCartTotal = document.getElementById('miniCartTotal');
    
    if (!miniCartItems) return;
    
    if (cart.length === 0) {
        miniCartItems.innerHTML = '<div class="mini-cart-empty">Giỏ hàng trống</div>';
        if (miniCartTotal) miniCartTotal.textContent = '0đ';
        return;
    }
    
    let miniCartHTML = '';
    let total = 0;
    
    cart.slice(0, 3).forEach(item => { // Show only first 3 items
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        miniCartHTML += `
            <div class="mini-cart-item">
                <div class="mini-cart-image">${item.image}</div>
                <div class="mini-cart-info">
                    <div class="mini-cart-title">${item.name}</div>
                    <div class="mini-cart-price">${formatCurrency(item.price)} x ${item.quantity}</div>
                </div>
            </div>
        `;
    });
    
    if (cart.length > 3) {
        miniCartHTML += `<div class="mini-cart-more">+${cart.length - 3} sản phẩm khác</div>`;
    }
    
    miniCartItems.innerHTML = miniCartHTML;
    if (miniCartTotal) {
        miniCartTotal.textContent = formatCurrency(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    }
}