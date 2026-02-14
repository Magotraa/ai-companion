/* 
===============================================================================
CHATBOT JAVASCRIPT - ADD TO YOUR script.js FILE
===============================================================================
This handles all chat widget functionality including voice, API calls, etc.
*/

// ============================================
// CHAT WIDGET STATE MANAGEMENT
// ============================================

const chatWidget = {
    isOpen: false,
    isMinimized: false,
    messages: [],
    currentModel: 'claude-sonnet-4',
    isVoiceActive: false,
    recognition: null,
    synthesis: window.speechSynthesis
};

// ============================================
// DOM ELEMENTS
// ============================================

const chatElements = {
    button: document.getElementById('chatWidgetButton'),
    modal: document.getElementById('chatWidgetModal'),
    closeBtn: document.getElementById('chatClose'),
    minimizeBtn: document.getElementById('chatMinimize'),
    voiceBtn: document.getElementById('voiceToggle'),
    messages: document.getElementById('widgetChatMessages'),
    input: document.getElementById('widgetMessageInput'),
    sendBtn: document.getElementById('widgetSendBtn'),
    modelSelect: document.getElementById('widgetModelSelect'),
    typing: document.getElementById('widgetTyping'),
    toast: document.getElementById('chatToast'),
    toastText: document.getElementById('toastText')
};

// ============================================
// INITIALIZATION
// ============================================

function initChatWidget() {
    // Event listeners
    chatElements.button?.addEventListener('click', toggleChatWidget);
    chatElements.closeBtn?.addEventListener('click', closeChatWidget);
    chatElements.minimizeBtn?.addEventListener('click', minimizeChatWidget);
    chatElements.sendBtn?.addEventListener('click', sendChatMessage);
    chatElements.voiceBtn?.addEventListener('click', toggleVoice);
    chatElements.modelSelect?.addEventListener('change', handleModelChange);
    chatElements.input?.addEventListener('keydown', handleChatKeydown);
    chatElements.input?.addEventListener('input', autoResizeChatInput);

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            chatElements.input.value = e.target.textContent;
            sendChatMessage();
        });
    });

    // Initialize voice recognition
    initVoiceRecognition();

    console.log('Chat widget initialized successfully');
}

// ============================================
// WIDGET CONTROLS
// ============================================

function toggleChatWidget() {
    if (chatWidget.isOpen) {
        closeChatWidget();
    } else {
        openChatWidget();
    }
}

function openChatWidget() {
    chatWidget.isOpen = true;
    chatElements.modal?.classList.add('active');
    chatElements.input?.focus();
    
    // Hide badge
    const badge = chatElements.button?.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';
}

function closeChatWidget() {
    chatWidget.isOpen = false;
    chatElements.modal?.classList.remove('active');
}

function minimizeChatWidget() {
    closeChatWidget();
    showToast('Chat minimized - click the button to reopen!');
}

// ============================================
// MESSAGE HANDLING
// ============================================

function sendChatMessage() {
    const message = chatElements.input?.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatWidget.messages.push({ role: 'user', content: message });
    
    // Clear input
    chatElements.input.value = '';
    chatElements.input.style.height = 'auto';
    
    // Show typing indicator
    chatElements.typing?.classList.add('active');
    chatElements.sendBtn.disabled = true;
    
    // Simulate API call (replace with actual API integration)
    setTimeout(async () => {
        try {
            const response = await getAIResponse(message);
            chatElements.typing?.classList.remove('active');
            addChatMessage(response, 'assistant');
            chatWidget.messages.push({ role: 'assistant', content: response });
            chatElements.sendBtn.disabled = false;
        } catch (error) {
            chatElements.typing?.classList.remove('active');
            showToast('Error getting response. Please try again.');
            chatElements.sendBtn.disabled = false;
        }
    }, 1500);
}

function addChatMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-bubble">
            <p>${escapeHtml(content)}</p>
        </div>
    `;
    
    chatElements.messages?.appendChild(messageDiv);
    chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

// ============================================
// AI RESPONSE HANDLER
// ============================================

async function getAIResponse(userMessage) {
    // THIS IS WHERE YOU'LL INTEGRATE YOUR ACTUAL API
    // For now, it returns smart contextual responses about Dr. Arjun
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses about Dr. Arjun
    if (lowerMessage.includes('research') || lowerMessage.includes('publication')) {
        return "Dr. Arjun has published multiple SCIE-indexed papers on Transfer Learning and Neural Plasticity. His Ph.D. research at Dongguk University focused on 'Heterogeneous Transfer Learning in Image Classification Using Hebbian Principles.' You can explore his research publications on the AI Lab website!";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
        return "Dr. Arjun led the Generative AI-powered factory maintenance platform showcased at MWC 2025 Barcelona. He has extensive experience with multimodal AI systems, RAG pipelines using LLaMA2/3, and real-time computer vision for defect detection. Would you like to know more about a specific project?";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('expertise') || lowerMessage.includes('expert')) {
        return "Dr. Arjun specializes in:\n• Generative AI & LLMs (Llama2/3, GPT)\n• Computer Vision (DINOv2, YOLO)\n• Deep Learning & Neural Networks\n• MLOps (AWS SageMaker, Docker, CI/CD)\n• NLP & RAG architectures\n\nHe has 13+ years of experience in AI/ML research and development!";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
        return "You can reach Dr. Arjun at:\n📧 arjun.magotra.india@gmail.com\n📱 +91-9103295143\n💼 LinkedIn: linkedin.com/in/dr-arjun-magotra-bb37703a\n\nFeel free to connect for AI consulting, collaboration, or research opportunities!";
    }
    
    if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('phd')) {
        return "Dr. Arjun holds a Ph.D. in Computer Science Engineering from Dongguk University, South Korea (M.S. & Ph.D. Integrated Program). He was awarded a fully-funded scholarship at a Top-500 QS-ranked university and graduated with excellent grades (Ph.D. 4.08/4.5, MS 4.33/4.5).";
    }
    
    if (lowerMessage.includes('deloitte') || lowerMessage.includes('pwc') || lowerMessage.includes('experience')) {
        return "Dr. Arjun is currently a Senior Gen AI Expert at PWC Global Solutions. Previously, he was a Senior AI Consultant at Deloitte USI, where he led the GenAI factory maintenance project showcased at MWC 2025. He has 13+ years of total experience spanning AI research, academia, and enterprise consulting.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Dr. Arjun's AI assistant. I can tell you about his research, projects, expertise, or help you connect with him. What would you like to know?";
    }
    
    // Default intelligent response
    return "That's an interesting question! Dr. Arjun has deep expertise in AI/ML, Generative AI, Computer Vision, and MLOps. I can help you learn more about his research publications, project work, technical skills, or how to contact him. What specifically interests you?";
}

// ============================================
// VOICE FUNCTIONALITY
// ============================================

function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        chatWidget.recognition = new SpeechRecognition();
        chatWidget.recognition.continuous = false;
        chatWidget.recognition.interimResults = false;
        chatWidget.recognition.lang = 'en-US';

        chatWidget.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatElements.input.value = transcript;
            autoResizeChatInput({ target: chatElements.input });
            showToast('Voice input received! 🎤');
        };

        chatWidget.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            showToast('Voice input error. Please try again.');
            stopVoice();
        };

        chatWidget.recognition.onend = () => {
            stopVoice();
        };
    }
}

function toggleVoice() {
    if (!chatWidget.recognition) {
        showToast('Voice input not supported in this browser');
        return;
    }

    if (chatWidget.isVoiceActive) {
        stopVoice();
    } else {
        startVoice();
    }
}

function startVoice() {
    chatWidget.isVoiceActive = true;
    chatElements.voiceBtn?.classList.add('active');
    chatWidget.recognition?.start();
    showToast('Listening... Speak now! 🎤');
}

function stopVoice() {
    chatWidget.isVoiceActive = false;
    chatElements.voiceBtn?.classList.remove('active');
    chatWidget.recognition?.stop();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function handleChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

function autoResizeChatInput(e) {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
}

function handleModelChange(e) {
    chatWidget.currentModel = e.target.value;
    showToast(`Switched to ${e.target.options[e.target.selectedIndex].text}`);
}

function showToast(message) {
    chatElements.toastText.textContent = message;
    chatElements.toast?.classList.add('show');
    
    setTimeout(() => {
        chatElements.toast?.classList.remove('show');
    }, 3000);
}

// ============================================
// API INTEGRATION (CONFIGURE YOUR API HERE)
// ============================================

/*
TO INTEGRATE WITH ACTUAL AI APIS:

1. For Anthropic Claude:
   const response = await fetch('https://api.anthropic.com/v1/messages', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'x-api-key': 'YOUR_API_KEY',
           'anthropic-version': '2023-06-01'
       },
       body: JSON.stringify({
           model: 'claude-sonnet-4-20250514',
           max_tokens: 1024,
           messages: chatWidget.messages
       })
   });

2. For OpenAI:
   const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer YOUR_API_KEY'
       },
       body: JSON.stringify({
           model: 'gpt-4o',
           messages: chatWidget.messages
       })
   });

3. For Google Gemini:
   const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
           contents: chatWidget.messages,
           generationConfig: { temperature: 0.7 }
       })
   });

Replace the getAIResponse() function above with actual API calls.
*/

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

// Add this to your existing DOMContentLoaded event or create a new one
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
    initChatWidget();
}