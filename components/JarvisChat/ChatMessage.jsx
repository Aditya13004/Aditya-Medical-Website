import React, { useState } from 'react';
import { Volume2, VolumeX, ShoppingCart, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import MedicineRecommendation from './MedicineRecommendation';
import './ChatMessage.css';

const ChatMessage = ({ 
  message, 
  onAddToCart, 
  onSpeak, 
  isSpeaking, 
  onStopSpeaking 
}) => {
  const [showFullText, setShowFullText] = useState(false);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return messageTime.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = () => {
    if (message.isError) return <AlertTriangle size={16} className="error-icon" />;
    if (message.isSystemMessage) return <Info size={16} className="system-icon" />;
    if (message.isVoiceMessage) return <Volume2 size={16} className="voice-icon" />;
    return null;
  };

  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel?.toLowerCase()) {
      case 'emergency': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      default: return '#059669';
    }
  };

  const shouldTruncateText = (text) => {
    return text && text.length > 300;
  };

  const getTruncatedText = (text) => {
    if (!shouldTruncateText(text) || showFullText) return text;
    return text.substring(0, 300) + '...';
  };

  const handleSpeakMessage = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onSpeak(message.text);
    }
  };

  return (
    <div className={`message ${message.sender.toLowerCase()} ${message.isError ? 'error' : ''} ${message.isSystemMessage ? 'system' : ''}`}>
      {/* Avatar for AI/System messages */}
      {message.sender !== 'User' && (
        <div className="message-avatar">
          <img 
            src={message.sender === 'AI' ? '/images/jarvis-avatar.png' : '/images/system-avatar.png'}
            alt={message.sender}
            onError={(e) => {
              const color = message.sender === 'AI' ? '#4F46E5' : '#6B7280';
              const letter = message.sender.charAt(0);
              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3E${letter}%3C/text%3E%3C/svg%3E`;
            }}
          />
          {message.urgencyLevel && message.urgencyLevel !== 'Low' && (
            <div 
              className="urgency-indicator"
              style={{ backgroundColor: getUrgencyColor(message.urgencyLevel) }}
              title={`Urgency: ${message.urgencyLevel}`}
            >
              <AlertTriangle size={12} />
            </div>
          )}
        </div>
      )}

      <div className="message-content">
        {/* Message Header */}
        <div className="message-header">
          <div className="sender-info">
            <span className="sender-name">
              {message.sender === 'AI' ? 'Jarvis AI' : message.sender}
            </span>
            {getMessageIcon()}
          </div>
          <div className="message-meta">
            <span className="timestamp">
              <Clock size={12} />
              {formatTimestamp(message.timestamp)}
            </span>
            {message.aiMetadata?.confidence && (
              <span 
                className="confidence-score"
                title={`AI Confidence: ${Math.round(message.aiMetadata.confidence * 100)}%`}
              >
                {Math.round(message.aiMetadata.confidence * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Message Text */}
        <div className="message-text">
          <p>{getTruncatedText(message.text)}</p>
          
          {shouldTruncateText(message.text) && (
            <button 
              className="expand-button"
              onClick={() => setShowFullText(!showFullText)}
            >
              {showFullText ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Medical Disclaimer */}
        {message.showDisclaimer && (
          <div className="medical-disclaimer">
            <AlertTriangle size={14} />
            <span>
              This information is for educational purposes only. Always consult with a qualified healthcare professional before taking any medication or making health decisions.
            </span>
          </div>
        )}

        {/* Medicine Recommendations */}
        {message.recommendations && message.recommendations.length > 0 && (
          <div className="recommendations-section">
            <h4>Medicine Recommendations</h4>
            <div className="recommendations-grid">
              {message.recommendations.map((medicine, index) => (
                <MedicineRecommendation
                  key={medicine.id || index}
                  medicine={medicine}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            <div className="recommendations-disclaimer">
              <Info size={14} />
              <span>
                These are general recommendations based on common treatments. Dosages may vary based on age, weight, and medical history. Please consult a healthcare provider.
              </span>
            </div>
          </div>
        )}

        {/* Message Actions */}
        <div className="message-actions">
          {message.sender === 'AI' && !message.isSystemMessage && (
            <button 
              className="speak-button"
              onClick={handleSpeakMessage}
              title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
          )}
          
          {message.status && (
            <div className="message-status">
              {message.status === 'sent' && <CheckCircle size={14} className="status-sent" />}
              {message.status === 'delivered' && <CheckCircle size={14} className="status-delivered" />}
              {message.status === 'read' && <CheckCircle size={14} className="status-read" />}
              {message.status === 'failed' && <AlertTriangle size={14} className="status-failed" />}
            </div>
          )}
        </div>

        {/* AI Metadata (for debugging - can be removed in production) */}
        {process.env.NODE_ENV === 'development' && message.aiMetadata && (
          <details className="ai-metadata">
            <summary>AI Metadata</summary>
            <div className="metadata-content">
              {message.aiMetadata.model && (
                <div>Model: {message.aiMetadata.model}</div>
              )}
              {message.aiMetadata.responseTime && (
                <div>Response Time: {message.aiMetadata.responseTime}ms</div>
              )}
              {message.aiMetadata.confidence && (
                <div>Confidence: {(message.aiMetadata.confidence * 100).toFixed(1)}%</div>
              )}
              {message.aiMetadata.tokensUsed && (
                <div>Tokens Used: {message.aiMetadata.tokensUsed}</div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;