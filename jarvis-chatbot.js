// Jarvis AI Chatbot - Intelligent Medical Assistant with Voice Capabilities
// Advanced conversational AI for Aditya Medical & General Store

class JarvisAIChatbot {
  constructor() {
    this.medicineDB = new GlobalMedicineDatabase();
    this.isVoiceEnabled = false;
    this.isListening = false;
    this.isSpeaking = false;
    this.conversationHistory = [];
    this.currentContext = null;
    this.patientProfile = {};
    
    // Speech recognition and synthesis
    this.speechRecognition = null;
    this.speechSynthesis = window.speechSynthesis;
    this.currentUtterance = null;
    
    // Initialize speech recognition if available
    this.initializeSpeechRecognition();
    
    // Conversation patterns and responses
    this.conversationPatterns = {
      greetings: {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'howdy'],
        responses: [
          "Hello! I'm MedAssist AI, your AI medical assistant from Aditya Medical & General Store. How can I help you with your health concerns today?",
          "Hi there! I'm MedAssist AI, ready to assist you with medicine recommendations and health guidance. What symptoms are you experiencing?",
          "Greetings! I'm MedAssist AI, your personal medical AI. Tell me about your health concerns and I'll provide personalized recommendations.",
          "Hello! Welcome to Aditya Medical. I'm MedAssist AI, here to help with your medical queries. How are you feeling today?"
        ]
      },
      symptoms_inquiry: {
        patterns: ['i have', 'i am feeling', 'i feel', 'symptoms', 'pain', 'ache', 'hurt', 'sick', 'unwell'],
        responses: [
          "I understand you're not feeling well. Can you describe your symptoms in detail? For example, what type of pain, where is it located, and how long have you been experiencing it?",
          "I'm sorry to hear you're not feeling well. Please tell me more about your symptoms - their severity, duration, and any other details that might help me provide better recommendations.",
          "Let me help you with that. Could you provide more information about your symptoms? The more details you give me, the better I can assist you."
        ]
      },
      medicine_inquiry: {
        patterns: ['medicine for', 'drug for', 'treatment for', 'what should i take', 'recommend medicine', 'suggest medicine'],
        responses: [
          "I can certainly help you find the right medicine. Let me analyze your condition and provide appropriate recommendations.",
          "Based on your symptoms, I'll suggest suitable medicines. Please remember this is AI-based guidance and you should consult a doctor for serious conditions.",
          "I'll provide medicine recommendations based on your symptoms. Always consult with a healthcare professional before starting any new medication."
        ]
      },
      emergency: {
        patterns: ['emergency', 'urgent', 'serious', 'severe pain', 'cant breathe', 'chest pain', 'heart attack', 'stroke'],
        responses: [
          "🚨 This sounds like a medical emergency! Please call emergency services immediately (102/108) or visit the nearest hospital. Don't delay seeking professional medical help!",
          "⚠️ MEDICAL EMERGENCY: Please seek immediate medical attention! Call emergency services or go to the nearest hospital right away. This requires professional medical care.",
          "🚨 Emergency situation detected! Please contact emergency services (102/108) immediately or visit the nearest emergency room. Your safety is the priority!"
        ]
      },
      dosage_inquiry: {
        patterns: ['how much', 'dosage', 'how many', 'how often', 'when to take', 'frequency'],
        responses: [
          "Dosage depends on various factors including age, weight, and severity. Let me provide you with standard dosage information, but please consult a pharmacist or doctor for personalized dosing.",
          "I'll give you the standard dosage recommendations. However, always follow your doctor's prescription or consult our pharmacist for personalized dosing guidance."
        ]
      },
      side_effects: {
        patterns: ['side effects', 'adverse effects', 'reactions', 'problems with', 'issues with'],
        responses: [
          "I can provide information about common side effects. If you're experiencing any adverse reactions, please consult a healthcare professional immediately.",
          "Side effects can vary between individuals. I'll share common ones, but seek medical attention if you experience any concerning symptoms."
        ]
      },
      price_inquiry: {
        patterns: ['price', 'cost', 'how much does', 'expensive', 'cheap', 'affordable'],
        responses: [
          "I'll provide current pricing information for the medicines. Prices may vary and we often have discounts available.",
          "Let me check the current prices for you. We strive to offer competitive rates and may have special offers."
        ]
      },
      availability: {
        patterns: ['available', 'in stock', 'do you have', 'can i get'],
        responses: [
          "Let me check our current inventory for you. We maintain good stock of most common medicines.",
          "I'll verify availability for you. If we don't have something in stock, I can suggest alternatives or check when we'll receive it."
        ]
      }
    };
    
    // Medical disclaimer
    this.medicalDisclaimer = "⚠️ IMPORTANT: This is AI-based advice for informational purposes only. Please consult a licensed doctor or pharmacist before taking any medicine, especially for serious conditions. If symptoms persist or worsen, seek immediate medical attention.";
    
    this.initializeChatbot();
  }

  // Initialize speech recognition
  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';
      
      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleUserInput(transcript, true);
      };
      
      this.speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.updateVoiceButton();
      };
      
      this.speechRecognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButton();
      };
    }
  }

  // Initialize chatbot UI
  initializeChatbot() {
    this.createChatbotHTML();
    this.bindEventListeners();
    
    // Add initial greeting
    setTimeout(() => {
      this.addMessage("Hello! I'm MedAssist AI, your AI medical assistant. I can help you with medicine recommendations, symptom analysis, and health guidance. How can I assist you today?", 'jarvis');
    }, 1000);
  }

  // Create chatbot HTML structure
  createChatbotHTML() {
    const chatbotHTML = `
      <!-- Jarvis Chatbot -->
      <div id="jarvis-chatbot" class="jarvis-chatbot-container">
        <!-- Chat Toggle Button -->
        <button id="jarvis-toggle" class="jarvis-toggle-btn" title="Chat with MedAssist AI">
          <div class="jarvis-avatar">
            <span class="jarvis-icon">🤖</span>
            <div class="jarvis-pulse-ring"></div>
          </div>
          <span class="jarvis-label">MedAssist AI</span>
        </button>

        <!-- Chat Window -->
        <div id="jarvis-chat-window" class="jarvis-chat-window">
          <!-- Header -->
          <div class="jarvis-header">
            <div class="jarvis-header-info">
              <div class="jarvis-avatar-small">🤖</div>
              <div class="jarvis-info">
                <h4>MedAssist AI Assistant</h4>
                <p class="jarvis-status">Online • Medical AI</p>
              </div>
            </div>
            <div class="jarvis-header-controls">
              <button id="jarvis-voice-toggle" class="jarvis-voice-btn" title="Toggle voice assistant">
                <span id="jarvis-voice-icon">🔊</span>
              </button>
              <button id="jarvis-minimize" class="jarvis-minimize-btn" title="Minimize chat">
                <span>—</span>
              </button>
            </div>
          </div>

          <!-- Messages Container -->
          <div id="jarvis-messages" class="jarvis-messages">
            <!-- Messages will be added here dynamically -->
          </div>

          <!-- Typing Indicator -->
          <div id="jarvis-typing" class="jarvis-typing-indicator" style="display: none;">
            <div class="jarvis-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="jarvis-typing-text">MedAssist AI is analyzing...</span>
          </div>

          <!-- Input Area -->
          <div class="jarvis-input-area">
            <div class="jarvis-input-container">
              <input type="text" id="jarvis-input" placeholder="Type your symptoms or ask about medicines..." autocomplete="off">
              <button id="jarvis-voice-input" class="jarvis-voice-input-btn" title="Voice input">
                <span id="jarvis-voice-input-icon">🎤</span>
              </button>
              <button id="jarvis-send" class="jarvis-send-btn" title="Send message">
                <span>▶</span>
              </button>
            </div>
            <div class="jarvis-quick-actions">
              <button class="jarvis-quick-btn" data-action="common-cold">Common Cold</button>
              <button class="jarvis-quick-btn" data-action="fever">Fever</button>
              <button class="jarvis-quick-btn" data-action="headache">Headache</button>
              <button class="jarvis-quick-btn" data-action="stomach-pain">Stomach Pain</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add chatbot HTML to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Add CSS styles
    this.addChatbotStyles();
  }

  // Add chatbot styles
  addChatbotStyles() {
    const styles = `
      <style id="jarvis-chatbot-styles">
        .jarvis-chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .jarvis-toggle-btn {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .jarvis-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .jarvis-avatar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jarvis-icon {
          font-size: 24px;
          z-index: 2;
          position: relative;
        }

        .jarvis-pulse-ring {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 35px;
          height: 35px;
          animation: jarvis-pulse 2s ease-out infinite;
        }

        @keyframes jarvis-pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .jarvis-label {
          font-size: 14px;
          white-space: nowrap;
        }

        .jarvis-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e5e5;
        }

        .jarvis-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .jarvis-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jarvis-avatar-small {
          font-size: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jarvis-info h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .jarvis-status {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .jarvis-header-controls {
          display: flex;
          gap: 8px;
        }

        .jarvis-voice-btn,
        .jarvis-minimize-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .jarvis-voice-btn:hover,
        .jarvis-minimize-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .jarvis-voice-btn.active {
          background: #4CAF50;
          animation: jarvis-pulse-voice 1s ease-in-out infinite;
        }

        @keyframes jarvis-pulse-voice {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .jarvis-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8f9fa;
        }

        .jarvis-message {
          margin-bottom: 15px;
          animation: jarvis-message-in 0.3s ease-out;
        }

        @keyframes jarvis-message-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .jarvis-message.user {
          text-align: right;
        }

        .jarvis-message.jarvis {
          text-align: left;
        }

        .jarvis-message-content {
          display: inline-block;
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
        }

        .jarvis-message.user .jarvis-message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .jarvis-message.jarvis .jarvis-message-content {
          background: white;
          color: #333;
          border: 1px solid #e5e5e5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .jarvis-medicine-card {
          background: #f8f9ff;
          border: 1px solid #e1e5ff;
          border-radius: 12px;
          padding: 15px;
          margin: 10px 0;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }

        .jarvis-medicine-name {
          font-weight: 600;
          color: #667eea;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .jarvis-medicine-details {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        .jarvis-medicine-price {
          font-weight: 600;
          color: #22c55e;
          margin-top: 8px;
        }

        .jarvis-add-to-cart {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .jarvis-add-to-cart:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .jarvis-out-of-stock-badge {
          background: #fee2e2;
          border: 1px solid #fca5a5;
          color: #dc2626;
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.08);
        }

        .jarvis-disclaimer {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #d97706;
          padding: 10px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 10px;
          line-height: 1.4;
        }

        .jarvis-typing-indicator {
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
        }

        .jarvis-typing-dots {
          display: flex;
          gap: 4px;
        }

        .jarvis-typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #667eea;
          animation: jarvis-typing-bounce 1.4s ease-in-out infinite both;
        }

        .jarvis-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .jarvis-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes jarvis-typing-bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 
          40% {
            transform: scale(1);
          }
        }

        .jarvis-typing-text {
          font-size: 12px;
          color: #666;
          font-style: italic;
        }

        .jarvis-input-area {
          background: white;
          padding: 15px;
          border-top: 1px solid #e5e5e5;
        }

        .jarvis-input-container {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        #jarvis-input {
          flex: 1;
          border: 2px solid #e5e5e5;
          border-radius: 25px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        #jarvis-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .jarvis-voice-input-btn,
        .jarvis-send-btn {
          background: #667eea;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .jarvis-voice-input-btn:hover,
        .jarvis-send-btn:hover {
          background: #5a6fd8;
          transform: scale(1.1);
        }

        .jarvis-voice-input-btn.listening {
          background: #ef4444;
          animation: jarvis-pulse-recording 1s ease-in-out infinite;
        }

        @keyframes jarvis-pulse-recording {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .jarvis-quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .jarvis-quick-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .jarvis-quick-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .jarvis-emergency-alert {
          background: #fee2e2;
          border: 2px solid #fca5a5;
          color: #dc2626;
          padding: 15px;
          border-radius: 12px;
          margin: 10px 0;
          font-weight: 600;
          animation: jarvis-emergency-pulse 1s ease-in-out infinite;
        }

        @keyframes jarvis-emergency-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .jarvis-chatbot-container {
            right: 16px;
            bottom: 76px; /* floats neatly above the sticky bottom bar */
            left: auto;
            transform: none;
          }

          .jarvis-toggle-btn {
            padding: 0;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .jarvis-label {
            display: none; /* hide text label to keep the button compact and circular */
          }

          .jarvis-pulse-ring {
            width: 48px;
            height: 48px;
          }

          .jarvis-chat-window {
            width: calc(100vw - 32px);
            max-width: 360px;
            height: 60vh;
            right: 0;
            left: auto;
            bottom: 64px;
          }

          .jarvis-quick-actions {
            justify-content: center;
          }
        }

        /* Accessibility */
        .jarvis-chatbot-container * {
          transition: all 0.3s ease;
        }

        .jarvis-chatbot-container button:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  // Bind event listeners
  bindEventListeners() {
    const toggleBtn = document.getElementById('jarvis-toggle');
    const chatWindow = document.getElementById('jarvis-chat-window');
    const minimizeBtn = document.getElementById('jarvis-minimize');
    const sendBtn = document.getElementById('jarvis-send');
    const input = document.getElementById('jarvis-input');
    const voiceInputBtn = document.getElementById('jarvis-voice-input');
    const voiceToggleBtn = document.getElementById('jarvis-voice-toggle');

    // Toggle chat window
    toggleBtn.addEventListener('click', () => {
      const isVisible = chatWindow.style.display === 'flex';
      chatWindow.style.display = isVisible ? 'none' : 'flex';
      
      if (!isVisible) {
        input.focus();
      }
    });

    // Minimize chat
    minimizeBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });

    // Send message
    sendBtn.addEventListener('click', () => {
      this.handleSendMessage();
    });

    // Input enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSendMessage();
      }
    });

    // Voice input
    voiceInputBtn.addEventListener('click', () => {
      this.toggleVoiceInput();
    });

    // Voice toggle
    voiceToggleBtn.addEventListener('click', () => {
      this.toggleVoiceMode();
    });

    // Quick actions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('jarvis-quick-btn')) {
        const action = e.target.getAttribute('data-action');
        this.handleQuickAction(action);
      }
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('jarvis-add-to-cart')) {
        const medicineName = e.target.getAttribute('data-medicine');
        const price = parseFloat(e.target.getAttribute('data-price'));
        this.addToCart(medicineName, price);
      }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.jarvis-chatbot-container')) {
        // Don't close immediately, let user click outside briefly
      }
    });
  }

  // Handle sending message
  handleSendMessage() {
    const input = document.getElementById('jarvis-input');
    const message = input.value.trim();
    
    if (message) {
      this.handleUserInput(message);
      input.value = '';
    }
  }

  // Handle user input (text or voice)
  async handleUserInput(message, isVoice = false) {
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process the message
    const response = await this.processUserMessage(message);
    
    // Hide typing indicator
    this.hideTypingIndicator();
    
    // Add Jarvis response
    this.addMessage(response.text, 'jarvis', response.data);
    
    // Speak response if voice mode is enabled
    if (this.isVoiceEnabled) {
      this.speakResponse(response.text);
    }
    
    // Scroll to bottom
    this.scrollToBottom();
  }

  // Process user message and generate response
  async processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for emergency keywords first
    if (this.isEmergencyMessage(lowerMessage)) {
      return {
        text: this.getEmergencyResponse(),
        data: { type: 'emergency' }
      };
    }
    
    // 1. Search for medicine/symptom recommendations first
    const medicineResults = this.medicineDB.searchBySymptoms(message);
    if (medicineResults.length > 0) {
      return this.generateMedicineResponse(medicineResults, message);
    }
    
    // 2. Check for specific medicine inquiry by name
    const medicineInfo = this.medicineDB.getMedicineByName(message);
    if (medicineInfo) {
      return this.generateSpecificMedicineResponse(medicineInfo);
    }
    
    // 3. Only check general conversation patterns if no direct match in the database
    const patternResponse = this.getPatternResponse(lowerMessage);
    if (patternResponse) {
      return { text: patternResponse, data: { type: 'pattern' } };
    }
    
    // Default response with suggestions
    return {
      text: "I understand you're looking for medical assistance. Could you please describe your symptoms in more detail? For example:\n\n• What type of pain or discomfort?\n• Where is it located?\n• How long have you been experiencing it?\n• Any other symptoms?\n\nThe more details you provide, the better I can help you find the right medicines.",
      data: { type: 'clarification' }
    };
  }

  // Check if message indicates emergency
  isEmergencyMessage(message) {
    const emergencyKeywords = [
      'emergency', 'urgent', 'serious', 'severe pain', 'cant breathe', 
      'chest pain', 'heart attack', 'stroke', 'unconscious', 'bleeding heavily',
      'allergic reaction', 'difficulty breathing', 'severe headache'
    ];
    
    return emergencyKeywords.some(keyword => message.includes(keyword));
  }

  // Get emergency response
  getEmergencyResponse() {
    return "🚨 MEDICAL EMERGENCY DETECTED!\n\nPlease take immediate action:\n• Call emergency services: 102 or 108\n• Go to the nearest hospital\n• Don't delay seeking professional help\n\nFor immediate assistance:\n📞 Emergency: 102/108\n🏥 Nearest Hospital: [Location]\n📱 Aditya Medical: +91-7588662926\n\nYour safety is the absolute priority!";
  }

  // Get pattern-based response
  getPatternResponse(message) {
    for (const [patternType, patternData] of Object.entries(this.conversationPatterns)) {
      for (const pattern of patternData.patterns) {
        if (message.includes(pattern)) {
          const responses = patternData.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    return null;
  }

  // Generate medicine recommendation response
  generateMedicineResponse(results, originalMessage) {
    const topResult = results[0];
    const disease = topResult.disease;
    
    let response = `Based on your symptoms, you might be experiencing **${disease.name}** (${topResult.confidence}% match).\n\nHere are my recommended medicines:\n\n`;
    
    const medicineData = [];
    
    disease.medicines.slice(0, 3).forEach((medicine, index) => {
      response += `**${index + 1}. ${medicine.name}** (${medicine.brand})\n`;
      response += `• Dosage: ${medicine.dosage}\n`;
      response += `• Type: ${medicine.type}\n`;
      response += `• Price: ₹${medicine.price}\n`;
      response += `• Side Effects: ${medicine.sideEffects}\n\n`;
      
      medicineData.push(medicine);
    });
    
    response += this.medicalDisclaimer;
    
    return {
      text: response,
      data: { 
        type: 'medicine_recommendation',
        medicines: medicineData,
        disease: disease.name,
        confidence: topResult.confidence
      }
    };
  }

  // Generate specific medicine response
  generateSpecificMedicineResponse(medicineInfo) {
    const medicine = medicineInfo;
    
    let response = `Here's information about **${medicine.name}** (${medicine.brand}):\n\n`;
    response += `• **Type:** ${medicine.type}\n`;
    response += `• **Dosage:** ${medicine.dosage}\n`;
    response += `• **Price:** ₹${medicine.price}\n`;
    response += `• **Side Effects:** ${medicine.sideEffects}\n`;
    response += `• **Used for:** ${medicine.diseaseContext}\n\n`;
    response += this.medicalDisclaimer;
    
    return {
      text: response,
      data: {
        type: 'medicine_info',
        medicine: medicine
      }
    };
  }

  // Add message to chat
  addMessage(content, sender, data = null) {
    const messagesContainer = document.getElementById('jarvis-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `jarvis-message ${sender}`;
    
    if (sender === 'jarvis' && data) {
      messageDiv.innerHTML = this.formatJarvisMessage(content, data);
    } else {
      messageDiv.innerHTML = `<div class="jarvis-message-content">${this.formatMessageText(content)}</div>`;
    }
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  // Format Jarvis message with special data
  formatJarvisMessage(content, data) {
    let html = `<div class="jarvis-message-content">${this.formatMessageText(content)}</div>`;
    
    if (data.type === 'emergency') {
      html = `<div class="jarvis-message-content jarvis-emergency-alert">${this.formatMessageText(content)}</div>`;
    }
    
    if (data.type === 'medicine_recommendation' && data.medicines) {
      html += this.generateMedicineCards(data.medicines);
    }
    
    if (data.type === 'medicine_info' && data.medicine) {
      html += this.generateMedicineCards([data.medicine]);
    }
    
    return html;
  }

  // Generate medicine cards
  generateMedicineCards(medicines) {
    let html = '';
    
    medicines.forEach(medicine => {
      const isAvailable = medicine.availability !== false;
      html += `
        <div class="jarvis-medicine-card">
          <div class="jarvis-medicine-name">${medicine.name} (${medicine.brand})</div>
          <div class="jarvis-medicine-details">
            <strong>Dosage:</strong> ${medicine.dosage}<br>
            <strong>Type:</strong> ${medicine.type}<br>
            <strong>Side Effects:</strong> ${medicine.sideEffects}
          </div>
          <div class="jarvis-medicine-price">₹${medicine.price}</div>
          ${isAvailable ? `
            <button class="jarvis-add-to-cart" data-medicine="${medicine.name}" data-price="${medicine.price}">
              🛒 Add to Cart
            </button>
          ` : `
            <div class="jarvis-out-of-stock-badge">
              ❌ Out of Stock
            </div>
          `}
        </div>
      `;
    });
    
    html += `<div class="jarvis-disclaimer">${this.medicalDisclaimer}</div>`;
    
    return html;
  }

  // Format message text (convert markdown-like syntax)
  formatMessageText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // Handle quick actions
  handleQuickAction(action) {
    const actions = {
      'common-cold': 'I have a runny nose, sneezing, and mild fever. What medicine should I take?',
      'fever': 'I have a high fever and body ache. Please recommend medicine.',
      'headache': 'I have a severe headache. What can I take for relief?',
      'stomach-pain': 'I have stomach pain and acidity. Please suggest medicine.'
    };
    
    const message = actions[action];
    if (message) {
      document.getElementById('jarvis-input').value = message;
      this.handleSendMessage();
    }
  }

  // Voice input functionality
  toggleVoiceInput() {
    if (!this.speechRecognition) {
      this.addMessage("Voice input is not supported in your browser. Please type your message instead.", 'jarvis');
      return;
    }
    
    if (this.isListening) {
      this.speechRecognition.stop();
      this.isListening = false;
    } else {
      try {
        this.speechRecognition.start();
        this.isListening = true;
        this.addMessage("🎤 Listening... Please speak your symptoms or questions.", 'jarvis');
      } catch (error) {
        console.error('Speech recognition error:', error);
        this.addMessage("Sorry, I couldn't start voice recognition. Please try again.", 'jarvis');
      }
    }
    
    this.updateVoiceInputButton();
  }

  // Toggle voice mode
  toggleVoiceMode() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    this.updateVoiceButton();
    
    const status = this.isVoiceEnabled ? "Voice mode enabled! I'll speak my responses." : "Voice mode disabled.";
    this.addMessage(status, 'jarvis');
  }

  // Update voice input button appearance
  updateVoiceInputButton() {
    const btn = document.getElementById('jarvis-voice-input');
    const icon = document.getElementById('jarvis-voice-input-icon');
    
    if (this.isListening) {
      btn.classList.add('listening');
      icon.textContent = '⏹️';
    } else {
      btn.classList.remove('listening');
      icon.textContent = '🎤';
    }
  }

  // Update voice toggle button appearance
  updateVoiceButton() {
    const btn = document.getElementById('jarvis-voice-toggle');
    const icon = document.getElementById('jarvis-voice-icon');
    
    if (this.isVoiceEnabled) {
      btn.classList.add('active');
      icon.textContent = '🔊';
    } else {
      btn.classList.remove('active');
      icon.textContent = '🔇';
    }
  }

  // Speak response using text-to-speech
  speakResponse(text) {
    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
    }
    
    // Clean text for speech (remove markdown and HTML)
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/[🚨⚠️📞🏥📱💊🛒🎤⏹️🔊🔇]/g, '')
      .replace(/₹/g, 'rupees');
    
    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.rate = 0.9;
    this.currentUtterance.pitch = 1.1;
    this.currentUtterance.volume = 0.8;
    
    // Try to use a medical/professional voice
    const voices = this.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Microsoft')
    ) || voices[0];
    
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }
    
    this.currentUtterance.onstart = () => {
      this.isSpeaking = true;
    };
    
    this.currentUtterance.onend = () => {
      this.isSpeaking = false;
    };
    
    this.speechSynthesis.speak(this.currentUtterance);
  }

  // Show typing indicator
  showTypingIndicator() {
    document.getElementById('jarvis-typing').style.display = 'flex';
    this.scrollToBottom();
  }

  // Hide typing indicator
  hideTypingIndicator() {
    document.getElementById('jarvis-typing').style.display = 'none';
  }

  // Scroll messages to bottom
  scrollToBottom() {
    const messagesContainer = document.getElementById('jarvis-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Add to cart integration
  addToCart(medicineName, price) {
    // Try to use existing cart system
    if (typeof window.addToCart === 'function') {
      window.addToCart(medicineName, price);
      this.addMessage(`✅ ${medicineName} has been added to your cart for ₹${price}!`, 'jarvis');
    } else {
      // Fallback for demo
      this.addMessage(`✅ ${medicineName} added to cart for ₹${price}! Please proceed to checkout when ready.`, 'jarvis');
      
      // Update cart count if element exists
      const cartCount = document.getElementById('cartCount');
      if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
      }
    }
  }
}

// Initialize Jarvis when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait for medicine database to load
  if (typeof GlobalMedicineDatabase !== 'undefined') {
    window.jarvisAI = new JarvisAIChatbot();
  } else {
    console.error('GlobalMedicineDatabase not loaded. Please ensure jarvis-medicine-database.js is included.');
  }
});