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
          " This sounds like a medical emergency! Please call emergency services immediately (102/108) or visit the nearest hospital. Don't delay seeking professional medical help!",
          " MEDICAL EMERGENCY: Please seek immediate medical attention! Call emergency services or go to the nearest hospital right away. This requires professional medical care.",
          " Emergency situation detected! Please contact emergency services (102/108) immediately or visit the nearest emergency room. Your safety is the priority!"
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
    this.medicalDisclaimer = " IMPORTANT: This is AI-based advice for informational purposes only. Please consult a licensed doctor or pharmacist before taking any medicine, especially for serious conditions. If symptoms persist or worsen, seek immediate medical attention.";
    
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
        
        <!-- WhatsApp Float Button -->
        <a href="https://wa.me/917588662926" target="_blank" class="whatsapp-float-btn" title="Chat on WhatsApp">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.895c-.002 2.1.549 4.16 1.595 5.975L0 24l6.335-1.654c1.745.961 3.731 1.468 5.753 1.469h.005c6.581 0 11.943-5.336 11.945-11.898.001-3.176-1.229-6.166-3.498-8.418h-.02zM12.046 21.84h-.004c-1.782-.001-3.529-.478-5.06-1.38l-.363-.213-3.766.982.998-3.655-.234-.37A9.972 9.972 0 0 1 2.08 11.89C2.082 6.424 6.556 1.966 12.05 1.966c2.659.001 5.161 1.036 7.039 2.915 1.879 1.877 2.916 4.372 2.914 7.022-.003 5.467-4.478 9.928-9.957 9.937zM17.5 14.385c-.3-.15-1.774-.871-2.049-.971-.275-.1-.475-.15-.675.15-.2.3-.775.971-.95 1.171-.175.2-.35.225-.65.075-.3-.15-1.265-.464-2.411-1.485-.892-.794-1.496-1.774-1.671-2.074-.175-.3-.019-.462.131-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.613-.925-2.206-.241-.575-.487-.497-.675-.506-.175-.008-.375-.008-.575-.008s-.525.075-.8.375c-.275.3-1.05 1.018-1.05 2.482 0 1.464 1.075 2.88 1.225 3.08.15.2 2.113 3.197 5.1 4.475.71.305 1.264.488 1.696.624.712.224 1.36.192 1.868.116.57-.086 1.774-.72 2.024-1.415.25-.694.25-1.288.175-1.415-.075-.125-.275-.2-.575-.35z"/>
          </svg>
        </a>

        <!-- Chat Toggle Button -->
        <button id="jarvis-toggle" class="jarvis-toggle-btn" title="Chat with MedAssist AI">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4M3 5h4"/>
          </svg>
        </button>

        <!-- Chat Window -->
        <div id="jarvis-chat-window" class="jarvis-chat-window">
          <!-- Header -->
          <div class="jarvis-header">
            <div class="jarvis-header-info">
              <div class="jarvis-avatar-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <div class="jarvis-info">
                <h4>MedAssist AI</h4>
                <p class="jarvis-status"><span class="status-dot"></span> Online</p>
              </div>
            </div>
            <div class="jarvis-header-controls">
              <button id="jarvis-voice-toggle" class="jarvis-icon-btn" title="Toggle voice assistant">
                <svg id="jarvis-voice-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              </button>
              <button id="jarvis-minimize" class="jarvis-icon-btn" title="Minimize chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
          </div>

          <!-- Input Area -->
          <div class="jarvis-input-area">
            <div class="jarvis-quick-actions">
              <button class="jarvis-quick-btn" data-action="common-cold">Common Cold</button>
              <button class="jarvis-quick-btn" data-action="fever">Fever</button>
              <button class="jarvis-quick-btn" data-action="headache">Headache</button>
            </div>
            <div class="jarvis-input-wrapper">
              <input type="text" id="jarvis-input" placeholder="Type your symptoms..." autocomplete="off">
              <div class="jarvis-input-controls">
                <button id="jarvis-voice-input" class="jarvis-input-btn" title="Voice input">
                  <svg id="jarvis-voice-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                </button>
                <button id="jarvis-send" class="jarvis-send-btn" title="Send message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    this.addChatbotStyles();
  }


    addChatbotStyles() {
    const styles = `
      <style id="jarvis-chatbot-styles">
        /* Global CSS for WhatsApp button */
        .whatsapp-float-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.25);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 9999;
          text-decoration: none;
        }
        .whatsapp-float-btn:hover {
          transform: scale(1.08) translateY(-3px);
          box-shadow: 0 12px 35px rgba(37, 211, 102, 0.35);
        }

        /* Container */
        .jarvis-chatbot-container {
          position: fixed;
          bottom: 95px;
          right: 24px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Toggle Button */
        .jarvis-toggle-btn {
          position: relative;
          background: rgba(37, 99, 235, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          width: 52px;
          height: 52px;
          padding: 0;
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .jarvis-toggle-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
          background: rgba(29, 78, 216, 0.95);
        }

        /* Chat Window */
        .jarvis-chat-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 360px;
          height: 560px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: none;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transform-origin: bottom right;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .jarvis-chat-window.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .jarvis-header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .jarvis-header-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .jarvis-avatar-small {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .jarvis-info h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .jarvis-status {
          margin: 4px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .jarvis-header-controls {
          display: flex;
          gap: 6px;
        }

        .jarvis-icon-btn {
          background: transparent;
          border: none;
          border-radius: 10px;
          width: 36px;
          height: 36px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          opacity: 0.8;
        }

        .jarvis-icon-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          opacity: 1;
        }

        .jarvis-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .jarvis-message {
          animation: jarvis-fade-in 0.3s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
          display: flex;
          flex-direction: column;
        }

        @keyframes jarvis-fade-in {
          to { opacity: 1; transform: translateY(0); }
        }

        .jarvis-message.user { align-items: flex-end; }
        .jarvis-message.jarvis { align-items: flex-start; }

        .jarvis-message-content {
          display: inline-block;
          max-width: 85%;
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 500;
        }

        .jarvis-message.user .jarvis-message-content {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.15);
        }

        .jarvis-message.jarvis .jarvis-message-content {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        /* Medicine Cards styled as premium SaaS cards */
        .jarvis-medicine-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          margin-top: 12px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
          width: 100%;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .jarvis-medicine-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .jarvis-medicine-name {
          font-weight: 600;
          color: #1e40af;
          font-size: 15px;
          margin-bottom: 8px;
        }

        .jarvis-medicine-details { font-size: 13px; color: #475569; line-height: 1.6; }
        .jarvis-medicine-price { font-weight: 600; color: #059669; margin-top: 10px; font-size: 15px; }

        .jarvis-add-to-cart {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.2s ease;
          width: 100%;
          display: block;
        }

        .jarvis-add-to-cart:hover {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .jarvis-out-of-stock-badge {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 12px;
          text-align: center;
        }

        .jarvis-disclaimer {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 12px;
          margin-top: 16px;
          line-height: 1.5;
        }

        .jarvis-typing-indicator {
          padding: 0 24px 10px 24px;
        }

        .jarvis-typing-dots { 
          display: inline-flex; 
          gap: 4px; 
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
        }
        
        .jarvis-typing-dots span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          animation: jarvis-typing-bounce 1.4s ease-in-out infinite both;
        }

        .jarvis-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .jarvis-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes jarvis-typing-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 
          40% { transform: scale(1); opacity: 1; }
        }

        .jarvis-input-area {
          background: #ffffff;
          padding: 16px 20px 20px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .jarvis-quick-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        
        .jarvis-quick-actions::-webkit-scrollbar { display: none; }

        .jarvis-quick-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .jarvis-quick-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .jarvis-input-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 6px 6px 6px 16px;
          transition: all 0.3s ease;
          height: 54px;
        }
        
        .jarvis-input-wrapper:focus-within {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        #jarvis-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          color: #0f172a;
          padding-right: 10px;
          font-family: inherit;
        }
        
        #jarvis-input::placeholder {
          color: #94a3b8;
        }

        .jarvis-input-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .jarvis-input-btn {
          background: transparent;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jarvis-input-btn:hover {
          background: #f1f5f9;
          color: #2563eb;
        }
        
        .jarvis-input-btn.listening {
          color: #ef4444;
          background: #fef2f2;
          animation: jarvis-pulse-mic 1.5s infinite;
        }
        
        @keyframes jarvis-pulse-mic {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .jarvis-send-btn {
          background: #2563eb;
          border: none;
          border-radius: 14px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .jarvis-send-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
        }

        .jarvis-emergency-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 16px;
          border-radius: 16px;
          margin: 10px 0;
          font-weight: 500;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .jarvis-chatbot-container {
            right: 16px;
            bottom: 85px;
          }

          .whatsapp-float-btn {
            bottom: 16px;
            right: 16px;
            width: 52px;
            height: 52px;
          }

          .jarvis-chat-window {
            width: calc(100vw - 32px);
            max-width: 360px;
            height: 65vh;
            bottom: 60px;
          }
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
      
      if (isVisible) {
        chatWindow.classList.remove('active');
        setTimeout(() => { chatWindow.style.display = 'none'; }, 300);
      } else {
        chatWindow.style.display = 'flex';
        void chatWindow.offsetWidth; // Trigger reflow
        chatWindow.classList.add('active');
      }
      
      if (!isVisible) {
        input.focus();
      }
    });

    // Minimize chat
    minimizeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      setTimeout(() => { chatWindow.style.display = 'none'; }, 300);
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
      text: `I understand you're looking for medical assistance. Could you please describe your symptoms in more detail? For example:\n\n• What type of pain or discomfort?\n• Where is it located?\n• How long have you been experiencing it?\n• Any other symptoms?\n\nThe more details you provide, the better I can help you find the right medicines.`,
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
    return ` MEDICAL EMERGENCY DETECTED!\n\nPlease take immediate action:\n• Call emergency services: 102 or 108\n• Go to the nearest hospital\n• Don't delay seeking professional help\n\nFor immediate assistance:\n Emergency: 102/108\n Nearest Hospital: [Location]\n Aditya Medical: +91-7588662926\n\nYour safety is the absolute priority!`;
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
    
    let response = `Based on your symptoms, you might be experiencing **${disease.name}** (${topResult.confidence}% match).

Here are my recommended medicines:

`;
    
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
    
    let response = `Here's information about **${medicine.name}** (${medicine.brand}):

`;
    response += `• **Type:** ${medicine.type}\n`;
    response += `• **Dosage:** ${medicine.dosage}\n`;
    response += `• **Price:** ₹${medicine.price}\n`;
    response += `• **Side Effects:** ${medicine.sideEffects}\n`;
    response += `• **Used for:** ${medicine.diseaseContext}

`;
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
               Add to Cart
            </button>
          ` : `
            <div class="jarvis-out-of-stock-badge">
               Out of Stock
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
        this.addMessage("Listening... Please speak your symptoms or questions.", 'jarvis');
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
      icon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>';
    } else {
      btn.classList.remove('listening');
      icon.innerHTML = '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line>';
    }
  }

  // Update voice toggle button appearance
  updateVoiceButton() {
    const btn = document.getElementById('jarvis-voice-toggle');
    const icon = document.getElementById('jarvis-voice-icon');
    
    if (this.isVoiceEnabled) {
      btn.classList.add('active');
      icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
    } else {
      btn.classList.remove('active');
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
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
      .replace(/[💊🎤⏹️🔊🔇]/g, '')
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
      this.addMessage(` ${medicineName} has been added to your cart for ₹${price}!`, 'jarvis');
    } else {
      // Fallback for demo
      this.addMessage(` ${medicineName} added to cart for ₹${price}! Please proceed to checkout when ready.`, 'jarvis');
      
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