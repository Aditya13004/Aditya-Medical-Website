import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Phone, Clock, MapPin, Heart } from 'lucide-react';
import './EmergencyAlert.css';

const EmergencyAlert = ({ onClose }) => {
  const [countdown, setCountdown] = useState(10);
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(true);

  useEffect(() => {
    let interval;
    
    if (autoCloseEnabled && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown, autoCloseEnabled, onClose]);

  const emergencyNumbers = [
    {
      service: 'National Emergency',
      number: '112',
      description: 'All emergencies (Police, Fire, Medical)',
      icon: <Phone size={20} />
    },
    {
      service: 'Ambulance',
      number: '108',
      description: 'Medical emergencies',
      icon: <Heart size={20} />
    },
    {
      service: 'Police',
      number: '100',
      description: 'Law enforcement',
      icon: <Phone size={20} />
    },
    {
      service: 'Fire Department',
      number: '101',
      description: 'Fire emergencies',
      icon: <Phone size={20} />
    }
  ];

  const handleCallEmergency = (number) => {
    // Disable auto-close when user interacts
    setAutoCloseEnabled(false);
    
    // Create a tel: link
    window.location.href = `tel:${number}`;
  };

  const handleStayConnected = () => {
    setAutoCloseEnabled(false);
    setCountdown(0);
  };

  return (
    <div className="emergency-alert-overlay" onClick={onClose}>
      <div className="emergency-alert-modal" onClick={e => e.stopPropagation()}>
        <div className="emergency-alert-header">
          <div className="emergency-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="emergency-title">
            <h2>Emergency Detected</h2>
            <p>Your message suggests a potential medical emergency</p>
          </div>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close emergency alert"
          >
            <X size={24} />
          </button>
        </div>

        <div className="emergency-alert-content">
          <div className="emergency-warning">
            <div className="warning-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="warning-text">
              <strong>Important:</strong> If you are experiencing a medical emergency, 
              please call emergency services immediately instead of using this chat service. 
              AI assistance cannot replace immediate professional medical care in emergencies.
            </div>
          </div>

          <div className="emergency-numbers">
            <h3>Emergency Contact Numbers</h3>
            <div className="numbers-grid">
              {emergencyNumbers.map((emergency, index) => (
                <div key={index} className="emergency-number-card">
                  <div className="number-icon">
                    {emergency.icon}
                  </div>
                  <div className="number-info">
                    <div className="service-name">{emergency.service}</div>
                    <div className="number">{emergency.number}</div>
                    <div className="description">{emergency.description}</div>
                  </div>
                  <button 
                    className="call-button"
                    onClick={() => handleCallEmergency(emergency.number)}
                  >
                    <Phone size={16} />
                    Call Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="emergency-tips">
            <h4>In Case of Emergency:</h4>
            <ul>
              <li>
                <Clock size={16} />
                <span>Call emergency services immediately</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>Provide your exact location</span>
              </li>
              <li>
                <Heart size={16} />
                <span>Stay calm and follow dispatcher instructions</span>
              </li>
              <li>
                <Phone size={16} />
                <span>Keep your phone line open</span>
              </li>
            </ul>
          </div>

          <div className="emergency-actions">
            <button 
              className="emergency-call-button"
              onClick={() => handleCallEmergency('112')}
            >
              <Phone size={20} />
              Call Emergency Services (112)
            </button>
            
            <button 
              className="continue-chat-button"
              onClick={handleStayConnected}
            >
              Continue with AI Chat
              {autoCloseEnabled && (
                <span className="countdown">({countdown}s)</span>
              )}
            </button>
          </div>

          <div className="emergency-disclaimer">
            <AlertTriangle size={16} />
            <span>
              This AI assistant is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or 
              other qualified health provider with any questions you may have regarding 
              a medical condition.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;