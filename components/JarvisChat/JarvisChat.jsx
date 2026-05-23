import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Mic, MicOff, Send, Volume2, VolumeX, ShoppingCart, AlertTriangle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import VoiceControls from './VoiceControls';
import MedicineRecommendation from './MedicineRecommendation';
import EmergencyAlert from './EmergencyAlert';
import './JarvisChat.css';

const JarvisChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize session on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeSession();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  const initializeSession = async () => {
    try {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Add welcome message
      const welcomeMessage = {
        id: `msg_${Date.now()}`,
        sender: 'AI',
        text: "Hello! I'm Jarvis, your AI medical assistant. I'm here to help you with symptoms analysis, medicine recommendations, and general health questions. How are you feeling today?",
        timestamp: new Date(),
        showDisclaimer: true,
        aiMetadata: {
          confidence: 1.0,
          responseTime: 0
        }
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSendMessage = async (messageText = inputText, isVoiceMessage = false) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'User',
      text: messageText.trim(),
      timestamp: new Date(),
      isVoiceMessage,
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Analyze message for emergency keywords
      const isEmergency = detectEmergencyKeywords(messageText);
      if (isEmergency) {
        setShowEmergencyAlert(true);
      }

      // Send to AI for processing
      const aiResponse = await processUserMessage(messageText, sessionId, isVoiceMessage);
      
      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        sender: 'AI',
        text: aiResponse.text,
        timestamp: new Date(),
        recommendations: aiResponse.recommendations,
        urgencyLevel: aiResponse.urgencyLevel,
        showDisclaimer: aiResponse.showDisclaimer,
        aiMetadata: {
          confidence: aiResponse.confidence,
          responseTime: aiResponse.responseTime,
          model: aiResponse.model
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak response if voice is enabled
      if (voiceEnabled && !isVoiceMessage) {
        speakText(aiResponse.text);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        sender: 'AI',
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectEmergencyKeywords = (text) => {
    const emergencyKeywords = [
      'emergency', 'urgent', 'severe pain', 'chest pain', 'heart attack',
      'difficulty breathing', 'unconscious', 'bleeding heavily', 'poisoning',
      'suicide', 'overdose', 'stroke', 'allergic reaction', 'anaphylaxis'
    ];
    
    const lowerText = text.toLowerCase();
    return emergencyKeywords.some(keyword => lowerText.includes(keyword));
  };

  const processUserMessage = async (text, sessionId, isVoiceMessage) => {
    // Simulate AI processing - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          text: generateMockAIResponse(text),
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          responseTime: Math.random() * 1000 + 500, // 500-1500ms
          model: 'Jarvis-Medical-AI-v1',
          recommendations: generateMockRecommendations(text),
          urgencyLevel: 'Low',
          showDisclaimer: true
        };
        resolve(mockResponse);
      }, 1000 + Math.random() * 1000);
    });
  };

  const generateMockAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('headache')) {
      return "I understand you're experiencing a headache. Headaches can have various causes including stress, dehydration, lack of sleep, or tension. For mild headaches, I can recommend some over-the-counter medications that might help provide relief. Please remember to consult with a healthcare professional if your headache persists or worsens.";
    } else if (input.includes('fever')) {
      return "Fever is your body's natural response to fighting infection. For adults, a temperature above 100.4°F (38°C) is considered a fever. I can suggest some medications to help reduce fever and make you more comfortable, but it's important to monitor your symptoms and seek medical attention if the fever is high or persistent.";
    } else if (input.includes('cough')) {
      return "Coughs can be dry or productive and may be caused by various factors including viral infections, allergies, or irritants. I can recommend some medications that may help suppress the cough or make it more productive to clear your airways. However, if the cough persists for more than a few weeks, please consult a healthcare provider.";
    }
    
    return "Thank you for sharing your symptoms with me. Based on what you've described, I can provide some general guidance and medication recommendations that might help. Please remember that this information is for educational purposes only and should not replace professional medical advice.";
  };

  const generateMockRecommendations = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('headache')) {
      return [
        {
          id: '1',
          name: 'Paracetamol 650mg',
          brandName: 'Dolo 650',
          dosage: '1 tablet every 6-8 hours',
          duration: 'As needed, max 3 days',
          precautions: ['Do not exceed 4g per day', 'Avoid alcohol'],
          price: 15.50,
          available: true
        },
        {
          id: '2',
          name: 'Ibuprofen 400mg',
          brandName: 'Brufen 400',
          dosage: '1 tablet every 8 hours',
          duration: 'As needed, max 3 days',
          precautions: ['Take with food', 'Avoid if stomach ulcers'],
          price: 22.80,
          available: true
        }
      ];
    } else if (input.includes('fever')) {
      return [
        {
          id: '3',
          name: 'Paracetamol 500mg',
          brandName: 'Crocin 500',
          dosage: '1-2 tablets every 4-6 hours',
          duration: 'Until fever subsides',
          precautions: ['Do not exceed 4g per day'],
          price: 18.20,
          available: true
        }
      ];
    }
    
    return [];
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript, true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const addToCart = (medicine) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    
    // Show confirmation
    const confirmationMessage = {
      id: `msg_${Date.now()}_system`,
      sender: 'System',
      text: `${medicine.name} has been added to your cart.`,
      timestamp: new Date(),
      isSystemMessage: true
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <EmergencyAlert onClose={() => setShowEmergencyAlert(false)} />
      )}

      {/* Chat Bubble */}
      <div className={`jarvis-chat-container ${isOpen ? 'open' : ''}`}>
        {!isOpen && (
          <div className="chat-bubble" onClick={toggleChat}>
            <div className="avatar">
              <img 
                src="/images/jarvis-avatar.png" 
                alt="Jarvis AI" 
                className="avatar-image"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234F46E5'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EJ%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
            </div>
            <div className="bubble-content">
              <MessageSquare size={24} />
              <span className="bubble-text">Chat with Jarvis</span>
            </div>
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div className="header-left">
                <div className="avatar small">
                  <img 
                    src="/images/jarvis-avatar.png" 
                    alt="Jarvis AI"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234F46E5'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EJ%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="header-info">
                  <h3>Jarvis AI</h3>
                  <p>Medical Assistant</p>
                </div>
              </div>
              <div className="header-right">
                <button
                  className={`voice-toggle ${voiceEnabled ? 'active' : ''}`}
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  title={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                {cartItems.length > 0 && (
                  <button className="cart-button" title="View Cart">
                    <ShoppingCart size={18} />
                    <span className="cart-count">{cartItems.length}</span>
                  </button>
                )}
                <button className="close-button" onClick={toggleChat}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onAddToCart={addToCart}
                  onSpeak={speakText}
                  isSpeaking={isSpeaking}
                  onStopSpeaking={stopSpeaking}
                />
              ))}
              {isLoading && (
                <div className="message ai loading">
                  <div className="avatar small">
                    <img src="/images/jarvis-avatar.png" alt="Jarvis AI" />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="disclaimer-text">
                <AlertTriangle size={14} />
                <span>For medical emergencies, please call emergency services immediately.</span>
              </div>
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms or ask about medicines..."
                  className="message-input"
                  rows={1}
                  disabled={isLoading}
                />
                <div className="input-actions">
                  <button
                    className={`voice-button ${isListening ? 'active' : ''}`}
                    onMouseDown={startVoiceRecognition}
                    onMouseUp={stopVoiceRecognition}
                    onMouseLeave={stopVoiceRecognition}
                    disabled={isLoading}
                    title="Hold to speak"
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    className="send-button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isLoading}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JarvisChat;