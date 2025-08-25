// Authentication functions
let currentUser = null;

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
    // Simulate login validation
    if (!email || !password) {
        showSuccess('Vui lòng nhập đầy đủ thông tin!');
        return false;
    }
    
    // Simulate successful login
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
    return true;
}

function register(name, email, password, confirmPassword) {
    // Validate registration data
    if (!name || !email || !password || !confirmPassword) {
        showSuccess('Vui lòng điền đầy đủ thông tin!');
        return false;
    }
    
    if (password !== confirmPassword) {
        showSuccess('Mật khẩu không khớp!');
        return false;
    }
    
    if (password.length < 6) {
        showSuccess('Mật khẩu phải có ít nhất 6 ký tự!');
        return false;
    }
    
    // Simulate registration
    currentUser = {
        name: name,
        email: email,
        phone: '',
        address: ''
    };
    
    document.getElementById('loggedOutMenu').style.display = 'none';
    document.getElementById('loggedInMenu').style.display = 'block';
    
    closeModal('registerModal');
    showSuccess('Đăng ký thành công!');
    return true;
}

function logout() {
    currentUser = null;
    document.getElementById('loggedOutMenu').style.display = 'block';
    document.getElementById('loggedInMenu').style.display = 'none';
    showSuccess('Đăng xuất thành công!');
}

function updateProfile(name, phone, address) {
    if (currentUser) {
        currentUser.name = name;
        currentUser.phone = phone;
        currentUser.address = address;
        closeModal('profileModal');
        showSuccess('Cập nhật thông tin thành công!');
        return true;
    }
    return false;
}

// Create auth modals dynamically
function createAuthModals() {
    const authModalsContainer = document.getElementById('authModals');
    if (!authModalsContainer) return;
    
    authModalsContainer.innerHTML = `
        <!-- Login Modal -->
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('loginModal')">&times;</span>
                <h2>Đăng nhập</h2>
                <form class="auth-form" id="loginForm">
                    <input type="email" placeholder="Email" id="loginEmail" required>
                    <input type="password" placeholder="Mật khẩu" id="loginPassword" required>
                    <button type="submit">Đăng nhập</button>
                </form>
                <div class="auth-switch">
                    <p>Chưa có tài khoản? <a onclick="switchToRegister()">Đăng ký ngay</a></p>
                </div>
            </div>
        </div>

        <!-- Register Modal -->
        <div id="registerModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('registerModal')">&times;</span>
                <h2>Đăng ký</h2>
                <form class="auth-form" id="registerForm">
                    <input type="text" placeholder="Họ tên" id="registerName" required>
                    <input type="email" placeholder="Email" id="registerEmail" required>
                    <input type="password" placeholder="Mật khẩu" id="registerPassword" required>
                    <input type="password" placeholder="Xác nhận mật khẩu" id="confirmPassword" required>
                    <button type="submit">Đăng ký</button>
                </form>
                <div class="auth-switch">
                    <p>Đã có tài khoản? <a onclick="switchToLogin()">Đăng nhập</a></p>
                </div>
            </div>
        </div>

        <!-- Profile Modal -->
        <div id="profileModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('profileModal')">&times;</span>
                <h2>Thông tin cá nhân</h2>
                <form class="auth-form" id="profileForm">
                    <input type="text" placeholder="Họ tên" id="profileName">
                    <input type="email" placeholder="Email" id="profileEmail" readonly>
                    <input type="tel" placeholder="Số điện thoại" id="profilePhone">
                    <textarea placeholder="Địa chỉ" id="profileAddress" rows="3"></textarea>
                    <button type="submit">Cập nhật thông tin</button>
                </form>
            </div>
        </div>
    `;
}

// Initialize auth system
function initAuth() {
    createAuthModals();
    
    // Form event listeners
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const profileForm = document.getElementById('profileForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                login(email, password);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                register(name, email, password, confirmPassword);
            });
        }
        
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('profileName').value;
                const phone = document.getElementById('profilePhone').value;
                const address = document.getElementById('profileAddress').value;
                
                updateProfile(name, phone, address);
            });
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}