// Contact page functionality

// Initialize contact page
function initializeContactPage() {
    initializeContactForm();
    initializeMap();
    initializeLiveChat();
    setupContactValidation();
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
        
        // Add real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Handle contact form submission
function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Gather form data
    const contactData = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim(),
        subject: formData.get('subject')?.trim() || 'Liên hệ từ website',
        message: formData.get('message')?.trim()
    };
    
    // Validate form data
    const validation = validateContactForm(contactData);
    if (!validation.isValid) {
        showFormErrors(validation.errors);
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form and button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Clear form
        form.reset();
        clearAllFormErrors();
        
        // Show success message
        showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
        
        // Store contact in local storage for follow-up
        storeContactSubmission(contactData);
        
        // Optional: Send confirmation email simulation
        sendConfirmationEmail(contactData.email);
        
    }, 2000); // Simulate network delay
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        errors.push({ field: 'name', message: 'Họ tên phải có ít nhất 2 ký tự' });
    }
    
    // Email validation
    if (!data.email) {
        errors.push({ field: 'email', message: 'Email là bắt buộc' });
    } else if (!isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }
    
    // Phone validation (optional but if provided must be valid)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push({ field: 'phone', message: 'Số điện thoại không hợp lệ' });
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
        errors.push({ field: 'message', message: 'Tin nhắn phải có ít nhất 10 ký tự' });
    }
    
    if (data.message && data.message.length > 1000) {
        errors.push({ field: 'message', message: 'Tin nhắn không được vượt quá 1000 ký tự' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!fieldValue || fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Họ tên phải có ít nhất 2 ký tự';
            }
            break;
            
        case 'email':
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Email là bắt buộc';
            } else if (!isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
            break;
            
        case 'phone':
            if (fieldValue && !isValidPhone(fieldValue)) {
                isValid = false;
                errorMessage = 'Số điện thoại không hợp lệ';
            }
            break;
            
        case 'message':
            if (!fieldValue || fieldValue.length < 10) {
                isValid = false;
                errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự';
            } else if (fieldValue.length > 1000) {
                isValid = false;
                errorMessage = 'Tin nhắn không được vượt quá 1000 ký tự';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(event) {
    const field = event.target || event;
    
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show form errors
function showFormErrors(errors) {
    // First clear all existing errors
    clearAllFormErrors();
    
    // Show each error
    errors.forEach(error => {
        const field = document.getElementById(error.field) || document.querySelector(`[name="${error.field}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
    
    // Focus on first error field
    if (errors.length > 0) {
        const firstErrorField = document.getElementById(errors[0].field) || 
                               document.querySelector(`[name="${errors[0].field}"]`);
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
}

// Clear all form errors
function clearAllFormErrors() {
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

// Store contact submission
function storeContactSubmission(contactData) {
    try {
        const submissions = getLocalStorage('contact_submissions', []);
        submissions.push({
            ...contactData,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        });
        
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions.splice(0, submissions.length - 10);
        }
        
        setLocalStorage('contact_submissions', submissions);
    } catch (error) {
        console.warn('Cannot store contact submission:', error);
    }
}

// Send confirmation email (simulation)
function sendConfirmationEmail(email) {
    console.log(`Sending confirmation email to: ${email}`);
    
    // In a real application, this would make an API call
    // For now, we'll just show a notification
    setTimeout(() => {
        showSuccess('Email xác nhận đã được gửi đến ' + email);
    }, 3000);
}

// Initialize map (placeholder implementation)
function initializeMap() {
    const mapContainer = document.getElementById('contactMap');
    if (!mapContainer) return;
    
    // For this example, we'll create a simple placeholder map
    // In a real application, you'd integrate with Google Maps, MapBox, etc.
    
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-map-marker-alt"></i>
            <div class="map-info">
                <h4>Sansui Headphones</h4>
                <p>123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                <a href="https://maps.google.com/?q=123+Nguyễn+Huệ+Quận+1+TP.HCM" 
                   target="_blank" class="map-link">
                    <i class="fas fa-external-link-alt"></i>
                    Xem trên Google Maps
                </a>
            </div>
        </div>
    `;
}

// Initialize live chat (placeholder implementation)
function initializeLiveChat() {
    createLiveChatWidget();
    setupChatEventListeners();
}

// Create live chat widget
function createLiveChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.id = 'liveChatWidget';
    chatWidget.className = 'live-chat-widget';
    
    chatWidget.innerHTML = `
        <div class="chat-toggle" onclick="toggleLiveChat()">
            <i class="fas fa-comments"></i>
            <span class="chat-notification" id="chatNotification">1</span>
        </div>
        
        <div class="chat-window" id="chatWindow" style="display: none;">
            <div class="chat-header">
                <h4>Hỗ trợ trực tuyến</h4>
                <button class="chat-close" onclick="closeLiveChat()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                        <div class="quick-replies">
                            <button onclick="sendQuickReply('Tôi cần tư vấn sản phẩm')">Tư vấn sản phẩm</button>
                            <button onclick="sendQuickReply('Hỗ trợ kỹ thuật')">Hỗ trợ kỹ thuật</button>
                            <button onclick="sendQuickReply('Chính sách bảo hành')">Bảo hành</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input">
                <input type="text" id="chatMessageInput" placeholder="Nhập tin nhắn..." 
                       onkeypress="handleChatKeyPress(event)">
                <button onclick="sendChatMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
}

// Setup chat event listeners
function setupChatEventListeners() {
    // Auto-hide notification after 10 seconds
    setTimeout(() => {
        const notification = document.getElementById('chatNotification');
        if (notification) {
            notification.style.display = 'none';
        }
    }, 10000);
}

// Toggle live chat
function toggleLiveChat() {
    const chatWindow = document.getElementById('chatWindow');
    const notification = document.getElementById('chatNotification');
    
    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'block';
        if (notification) notification.style.display = 'none';
        
        // Focus on input
        const chatInput = document.getElementById('chatMessageInput');
        if (chatInput) chatInput.focus();
    } else {
        chatWindow.style.display = 'none';
    }
}

// Close live chat
function closeLiveChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = 'none';
}

// Handle chat key press
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Send chat message
function sendChatMessage() {
    const chatInput = document.getElementById('chatMessageInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addChatMessage(botResponse, 'bot');
    }, 1000);
}

// Send quick reply
function sendQuickReply(message) {
    addChatMessage(message, 'user');
    
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addChatMessage(botResponse, 'bot');
    }, 1000);
}

// Add chat message
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate bot response
function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('tư vấn sản phẩm') || lowerMessage.includes('sản phẩm')) {
        return 'Chúng tôi có nhiều dòng tai nghe chất lượng cao: Hi-Fi, Gaming, Wireless, Studio. Bạn đang tìm loại tai nghe nào?';
    }
    
    if (lowerMessage.includes('hỗ trợ kỹ thuật') || lowerMessage.includes('kỹ thuật')) {
        return 'Tôi có thể hỗ trợ bạn về các vấn đề kỹ thuật. Bạn gặp khó khăn gì với sản phẩm?';
    }
    
    if (lowerMessage.includes('bảo hành')) {
        return 'Tất cả sản phẩm Sansui đều được bảo hành chính hãng 2-3 năm tùy dòng sản phẩm. Bạn cần hỗ trợ gì về bảo hành?';
    }
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
        return 'Giá sản phẩm từ 990.000đ đến 4.990.000đ tùy dòng. Bạn có thể xem chi tiết tại trang sản phẩm hoặc liên hệ để được tư vấn.';
    }
    
    if (lowerMessage.includes('địa chỉ') || lowerMessage.includes('cửa hàng')) {
        return 'Cửa hàng của chúng tôi tại: 123 Nguyễn Huệ, Quận 1, TP.HCM. Giờ mở cửa: T2-T6: 8:00-18:00, T7: 8:00-12:00.';
    }
    
    if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
        return 'Chúng tôi giao hàng toàn quốc, miễn phí trong nội thành TP.HCM. Thời gian giao hàng 1-3 ngày tùy khu vực.';
    }
    
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
        return 'Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin, đừng ngần ngại liên hệ nhé.';
    }
    
    // Default responses
    const defaultResponses = [
        'Tôi hiểu yêu cầu của bạn. Để được hỗ trợ tốt nhất, bạn có thể liên hệ hotline: 028 1234 5678',
        'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ có chuyên viên hỗ trợ bạn sớm nhất có thể.',
        'Bạn có thể để lại thông tin liên hệ, chúng tôi sẽ gọi lại tư vấn chi tiết cho bạn.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Setup contact validation with real-time feedback
function setupContactValidation() {
    // Add character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        addCharacterCounter(messageField, 1000);
    }
    
    // Add email suggestions
    const emailField = document.getElementById('email');
    if (emailField) {
        addEmailSuggestions(emailField);
    }
    
    // Add phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        addPhoneFormatting(phoneField);
    }
}

// Add character counter
function addCharacterCounter(field, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    field.parentNode.appendChild(counter);
    
    function updateCounter() {
        const currentLength = field.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.8) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
        
        if (currentLength > maxLength) {
            counter.classList.add('error');
        } else {
            counter.classList.remove('error');
        }
    }
    
    field.addEventListener('input', updateCounter);
    updateCounter(); // Initial update
}

// Add email suggestions
function addEmailSuggestions(emailField) {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    
    emailField.addEventListener('input', function() {
        const value = this.value;
        const atIndex = value.indexOf('@');
        
        if (atIndex > 0 && atIndex < value.length - 1) {
            const domain = value.substring(atIndex + 1);
            
            // Find matching domain
            const matchingDomain = commonDomains.find(d => d.startsWith(domain));
            if (matchingDomain && domain !== matchingDomain) {
                showEmailSuggestion(this, value.substring(0, atIndex + 1) + matchingDomain);
            }
        }
    });
}

// Show email suggestion
function showEmailSuggestion(field, suggestion) {
    let suggestionDiv = field.parentNode.querySelector('.email-suggestion');
    if (!suggestionDiv) {
        suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'email-suggestion';
        field.parentNode.appendChild(suggestionDiv);
    }
    
    suggestionDiv.innerHTML = `
        Có phải bạn muốn nhập: <strong onclick="acceptEmailSuggestion('${field.id}', '${suggestion}')">${suggestion}</strong>?
    `;
    suggestionDiv.style.display = 'block';
    
    // Hide suggestion after 5 seconds
    setTimeout(() => {
        suggestionDiv.style.display = 'none';
    }, 5000);
}

// Accept email suggestion
function acceptEmailSuggestion(fieldId, suggestion) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = suggestion;
        field.focus();
        
        // Hide suggestion
        const suggestionDiv = field.parentNode.querySelector('.email-suggestion');
        if (suggestionDiv) {
            suggestionDiv.style.display = 'none';
        }
    }
}

// Add phone formatting
function addPhoneFormatting(phoneField) {
    phoneField.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Remove non-digits
        
        // Format Vietnamese phone numbers
        if (value.startsWith('84')) {
            // International format
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
            }
        } else if (value.startsWith('0')) {
            // Domestic format
            if (value.length <= 10) {
                value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
            }
        }
        
        this.value = value;
    });
}

// Contact form auto-save (draft functionality)
function setupAutoSave() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const autoSaveKey = 'contact_form_draft';
    
    // Load saved draft
    const savedDraft = getLocalStorage(autoSaveKey);
    if (savedDraft) {
        Object.keys(savedDraft).forEach(key => {
            const field = contactForm.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = savedDraft[key];
            }
        });
        
        // Show draft notification
        showDraftNotification();
    }
    
    // Auto-save every 30 seconds
    setInterval(() => {
        const formData = new FormData(contactForm);
        const draft = {};
        
        for (let [key, value] of formData.entries()) {
            if (value.trim()) {
                draft[key] = value.trim();
            }
        }
        
        if (Object.keys(draft).length > 0) {
            setLocalStorage(autoSaveKey, draft);
        }
    }, 30000);
    
    // Clear draft when form is successfully submitted
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            removeLocalStorage(autoSaveKey);
        }, 3000);
    });
}

// Show draft notification
function showDraftNotification() {
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        Đã khôi phục bản nháp trước đó.
        <button onclick="clearDraft()" class="clear-draft-btn">Xóa bản nháp</button>
    `;
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.insertBefore(notification, contactForm.firstChild);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 10000);
    }
}

// Clear draft
function clearDraft() {
    removeLocalStorage('contact_form_draft');
    const notification = document.querySelector('.draft-notification');
    if (notification) {
        notification.style.display = 'none';
    }
    
    // Clear form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }
    
    showSuccess('Đã xóa bản nháp');
}

// Initialize FAQ section
function initializeFAQ() {
    const faqContainer = document.createElement('div');
    faqContainer.className = 'faq-section';
    faqContainer.innerHTML = `
        <h3>Câu hỏi thường gặp</h3>
        <div class="faq-list">
            ${generateFAQItems()}
        </div>
    `;
    
    const contactSection = document.querySelector('.contact-section .container');
    if (contactSection) {
        contactSection.appendChild(faqContainer);
    }
    
    // Add FAQ toggle functionality
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// Generate FAQ items
function generateFAQItems() {
    const faqData = [
        {
            question: 'Làm thế nào để liên hệ với chúng tôi?',
            answer: 'Bạn có thể liên hệ qua form trên website, gọi hotline 028 1234 5678, hoặc đến trực tiếp cửa hàng tại 123 Nguyễn Huệ, Quận 1, TP.HCM.'
        },
        {
            question: 'Thời gian phản hồi là bao lâu?',
            answer: 'Chúng tôi cam kết phản hồi trong vòng 24 giờ đối với liên hệ qua email/form, và ngay lập tức đối với cuộc gọi trong giờ hành chính.'
        },
        {
            question: 'Có hỗ trợ kỹ thuật không?',
            answer: 'Có, chúng tôi có đội ngũ kỹ thuật chuyên nghiệp hỗ trợ 24/7 qua hotline và chat trực tuyến.'
        },
        {
            question: 'Chính sách bảo hành như thế nào?',
            answer: 'Tất cả sản phẩm được bảo hành chính hãng từ 1-3 năm tùy loại sản phẩm. Bảo hành toàn quốc tại các trung tâm ủy quyền.'
        }
    ];
    
    return faqData.map(faq => `
        <div class="faq-item">
            <div class="faq-question">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

// Initialize contact page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeContactPage();
        setupAutoSave();
        initializeFAQ();
    });
} else {
    initializeContactPage();
    setupAutoSave();
    initializeFAQ();
}