// Cart management
let cart = [];

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({...product, quantity: quantity});
        }
        updateCartUI();
        showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
        return true;
    }
    return false;
}

function removeFromCart(productId) {
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
        updateCartUI();
        renderCart();
        showSuccess('Đã xóa sản phẩm khỏi giỏ hàng!');
        return true;
    }
    return false;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            renderCart();
        }
        return true;
    }
    return false;
}

function setQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        updateCartUI();
        renderCart();
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    renderCart();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = getCartItemCount();
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);
    }
}

function showCart() {
    renderCart();
    showModal('cartModal');
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Giỏ hàng trống</div>';
        cartTotal.textContent = 'Tổng cộng: 0đ';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-category">${item.category}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" title="Giảm số lượng">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" title="Tăng số lượng">+</button>
            </div>
            <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="Xóa sản phẩm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = getCartTotal();
    cartTotal.textContent = `Tổng cộng: ${formatPrice(total)}`;
    if (checkoutBtn) checkoutBtn.style.display = 'block';
}

function checkout() {
    if (!currentUser) {
        closeModal('cartModal');
        showLoginModal();
        showSuccess('Vui lòng đăng nhập để thanh toán');
        return false;
    }
    
    if (cart.length === 0) {
        showSuccess('Giỏ hàng trống!');
        return false;
    }

    // Create order summary
    const orderSummary = {
        items: [...cart],
        total: getCartTotal(),
        user: currentUser,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Simulate order processing
    console.log('Processing order:', orderSummary);
    
    // Clear cart after successful checkout
    clearCart();
    closeModal('cartModal');
    showSuccess('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    return true;
}

// Quick add to cart with quantity
function quickAddToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    addToCart(productId, quantity);
}

// Save cart to localStorage (if available)
function saveCart() {
    try {
        localStorage.setItem('sansui_cart', JSON.stringify(cart));
    } catch (error) {
        console.log('Cannot save cart to localStorage');
    }
}

// Load cart from localStorage (if available)
function loadCart() {
    try {
        const savedCart = localStorage.getItem('sansui_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (error) {
        console.log('Cannot load cart from localStorage');
        cart = [];
    }
}

// Auto-save cart whenever it changes
function wrapCartFunction(originalFunc) {
    return function(...args) {
        const result = originalFunc.apply(this, args);
        saveCart();
        return result;
    };
}

// Override cart functions to auto-save
const _originalAddToCart = addToCart;
const _originalRemoveFromCart = removeFromCart;
const _originalUpdateQuantity = updateQuantity;
const _originalClearCart = clearCart;

addToCart = function(...args) {
    const result = _originalAddToCart.apply(this, args);
    saveCart();
    return result;
};

removeFromCart = function(...args) {
    const result = _originalRemoveFromCart.apply(this, args);
    saveCart();
    return result;
};

updateQuantity = function(...args) {
    const result = _originalUpdateQuantity.apply(this, args);
    saveCart();
    return result;
};

clearCart = function(...args) {
    const result = _originalClearCart.apply(this, args);
    saveCart();
    return result;
};

// Initialize cart on page load
function initCart() {
    loadCart();
    updateCartUI();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}