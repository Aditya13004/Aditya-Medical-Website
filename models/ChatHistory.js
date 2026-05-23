const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  
  // Session Information
  sessionInfo: {
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    duration: { type: Number, default: 0 }, // in seconds
    isActive: { type: Boolean, default: true },
    sessionType: {
      type: String,
      enum: ['Text_Chat', 'Voice_Chat', 'Mixed', 'Emergency'],
      default: 'Text_Chat'
    },
    platform: { 
      type: String, 
      enum: ['Web', 'Mobile_App', 'WhatsApp', 'Telegram'],
      default: 'Web'
    }
  },

  // Messages Array
  messages: [{
    messageId: { type: String, required: true },
    sender: { 
      type: String, 
      enum: ['User', 'AI', 'System'],
      required: true 
    },
    senderName: { type: String, default: 'Jarvis AI', trim: true },
    
    // Message Content
    content: {
      text: { type: String, required: true },
      originalText: { type: String }, // Before any processing
      processedText: { type: String }, // After NLP processing
      intent: { type: String, trim: true },
      entities: [{
        entity: { type: String, required: true },
        value: { type: String, required: true },
        confidence: { type: Number, min: 0, max: 1 }
      }],
      sentiment: { 
        type: String, 
        enum: ['Positive', 'Neutral', 'Negative', 'Mixed'],
        default: 'Neutral'
      },
      urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Emergency'],
        default: 'Low'
      }
    },
    
    // Media Attachments
    attachments: [{
      type: { 
        type: String, 
        enum: ['Audio', 'Image', 'Document', 'Video'],
        required: true 
      },
      url: { type: String, required: true },
      fileName: { type: String, trim: true },
      fileSize: { type: Number }, // in bytes
      mimeType: { type: String, trim: true },
      thumbnailUrl: { type: String }, // for images/videos
      duration: { type: Number }, // for audio/video in seconds
      transcription: { type: String }, // for audio files
      ocrText: { type: String }, // for images with text
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Voice Message Specific
    voice: {
      isVoiceMessage: { type: Boolean, default: false },
      audioUrl: { type: String },
      duration: { type: Number }, // in seconds
      language: { type: String, default: 'en-IN' },
      transcription: {
        text: { type: String },
        confidence: { type: Number, min: 0, max: 1 },
        alternativeTexts: [{ type: String }]
      },
      voiceToTextProvider: { type: String, trim: true }, // Google, Azure, AWS
      processedAt: Date
    },
    
    // AI Response Metadata
    aiMetadata: {
      model: { type: String, trim: true }, // GPT-4, Claude, etc.
      responseTime: { type: Number }, // in milliseconds
      tokensUsed: { type: Number },
      confidence: { type: Number, min: 0, max: 1 },
      temperature: { type: Number, min: 0, max: 2 },
      maxTokens: { type: Number },
      prompt: { type: String }, // The actual prompt sent to AI
      reasoning: { type: String }, // AI's reasoning process
      fallbackUsed: { type: Boolean, default: false },
      contextLength: { type: Number } // Number of previous messages considered
    },
    
    // Message Timing
    timestamp: { type: Date, default: Date.now },
    editedAt: Date,
    isEdited: { type: Boolean, default: false },
    
    // Message Status
    status: {
      type: String,
      enum: ['Sending', 'Sent', 'Delivered', 'Read', 'Failed'],
      default: 'Sent'
    },
    
    // User Interaction
    userFeedback: {
      helpful: { type: Boolean },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
      reportedIssue: { type: String, trim: true },
      submittedAt: Date
    },
    
    // Message Tags and Classification
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: [
        'Greeting', 'Symptom_Description', 'Medicine_Query', 'Dosage_Question',
        'Side_Effects', 'Emergency', 'General_Health', 'Prescription_Help',
        'Order_Related', 'Technical_Support', 'Feedback', 'Goodbye'
      ]
    },
    
    // Medical Context
    medicalContext: {
      symptomsDiscussed: [{ type: String, trim: true }],
      medicinesMentioned: [{ type: String, trim: true }],
      conditionsDiscussed: [{ type: String, trim: true }],
      bodyPartsReferenced: [{ type: String, trim: true }],
      urgencyLevel: {
        type: String,
        enum: ['Non-urgent', 'Monitor', 'Consult_Doctor', 'Urgent', 'Emergency'],
        default: 'Non-urgent'
      },
      disclaimerShown: { type: Boolean, default: false },
      medicalAdviceGiven: { type: Boolean, default: false }
    }
  }],

  // Session Analytics
  analytics: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    aiMessages: { type: Number, default: 0 },
    voiceMessages: { type: Number, default: 0 },
    attachmentsCount: { type: Number, default: 0 },
    
    // Response Times
    avgResponseTime: { type: Number, default: 0 }, // in milliseconds
    maxResponseTime: { type: Number, default: 0 },
    minResponseTime: { type: Number, default: 0 },
    
    // Medical Activity
    symptomsDiscussed: { type: Number, default: 0 },
    medicinesQueried: { type: Number, default: 0 },
    emergencyKeywords: { type: Number, default: 0 },
    disclaimersShown: { type: Number, default: 0 },
    
    // User Engagement
    userEngagementScore: { type: Number, min: 0, max: 10, default: 0 },
    sessionSatisfaction: { type: Number, min: 1, max: 5 },
    helpfulnessRating: { type: Number, min: 1, max: 5 },
    
    // Technical Metrics
    errorCount: { type: Number, default: 0 },
    fallbacksUsed: { type: Number, default: 0 },
    totalTokensUsed: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 } // in currency units
  },
  
  // Session Context
  context: {
    currentSymptoms: [{ type: String, trim: true }],
    discussedConditions: [{ type: String, trim: true }],
    mentionedMedicines: [{ type: String, trim: true }],
    userPreferences: {
      language: { type: String, default: 'en' },
      communicationStyle: { type: String, enum: ['Formal', 'Casual', 'Medical'], default: 'Casual' },
      detailLevel: { type: String, enum: ['Brief', 'Moderate', 'Detailed'], default: 'Moderate' }
    },
    conversationFlow: {
      currentStage: {
        type: String,
        enum: ['Greeting', 'Symptom_Gathering', 'Analysis', 'Recommendations', 'Follow_up', 'Closing'],
        default: 'Greeting'
      },
      completedStages: [{ type: String }],
      nextSuggestedActions: [{ type: String }]
    }
  },
  
  // Quality Assurance
  qualityMetrics: {
    medicalAccuracyScore: { type: Number, min: 0, max: 10 },
    responseRelevanceScore: { type: Number, min: 0, max: 10 },
    conversationFlowScore: { type: Number, min: 0, max: 10 },
    userSatisfactionScore: { type: Number, min: 0, max: 10 },
    
    // Flags for Review
    flaggedForReview: { type: Boolean, default: false },
    reviewReasons: [{ type: String }],
    reviewStatus: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Approved', 'Flagged'],
      default: 'Pending'
    },
    reviewedBy: { type: String, trim: true },
    reviewedAt: Date,
    reviewNotes: { type: String, trim: true }
  },
  
  // User Information (cached for quick access)
  userInfo: {
    name: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, default: 'India', trim: true }
    },
    isNewUser: { type: Boolean, default: true },
    previousSessionsCount: { type: Number, default: 0 }
  },
  
  // Technical Information
  technicalInfo: {
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    deviceInfo: {
      type: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'] },
      os: { type: String, trim: true },
      browser: { type: String, trim: true },
      version: { type: String, trim: true }
    },
    networkInfo: {
      connectionType: { type: String, trim: true },
      speed: { type: String, trim: true }
    },
    geolocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      accuracy: { type: Number }
    }
  },
  
  // Session Outcomes
  outcomes: {
    resolved: { type: Boolean, default: false },
    resolutionType: {
      type: String,
      enum: ['Information_Provided', 'Medicine_Recommended', 'Doctor_Referral', 'Emergency_Protocol', 'Follow_up_Needed']
    },
    actionsTaken: [{ type: String }],
    medicinesAddedToCart: { type: Number, default: 0 },
    consultationBooked: { type: Boolean, default: false },
    emergencyProtocolTriggered: { type: Boolean, default: false },
    userSatisfied: { type: Boolean }
  },
  
  // Data Retention
  retentionInfo: {
    shouldRetain: { type: Boolean, default: true },
    retentionPeriod: { type: Number, default: 365 }, // days
    anonymizeAfter: { type: Number, default: 90 }, // days
    deleteAfter: { type: Number, default: 1095 } // days (3 years)
  },
  
  isArchived: { type: Boolean, default: false },
  archivedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for session duration in minutes
ChatHistorySchema.virtual('sessionDurationMinutes').get(function() {
  if (this.sessionInfo.endTime && this.sessionInfo.startTime) {
    return Math.round((this.sessionInfo.endTime - this.sessionInfo.startTime) / (1000 * 60));
  }
  return Math.round(this.sessionInfo.duration / 60);
});

// Virtual for last message
ChatHistorySchema.virtual('lastMessage').get(function() {
  return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
});

// Virtual for conversation summary
ChatHistorySchema.virtual('conversationSummary').get(function() {
  const symptoms = [...new Set(this.context.currentSymptoms)];
  const medicines = [...new Set(this.context.mentionedMedicines)];
  const conditions = [...new Set(this.context.discussedConditions)];
  
  return {
    symptoms: symptoms.slice(0, 5),
    medicines: medicines.slice(0, 5),
    conditions: conditions.slice(0, 3),
    messageCount: this.analytics.totalMessages,
    duration: this.sessionDurationMinutes
  };
});

// Indexes for better query performance
ChatHistorySchema.index({ userId: 1, 'sessionInfo.startTime': -1 });
ChatHistorySchema.index({ sessionId: 1 });
ChatHistorySchema.index({ 'sessionInfo.isActive': 1 });
ChatHistorySchema.index({ 'sessionInfo.startTime': -1 });
ChatHistorySchema.index({ 'userInfo.name': 1 });
ChatHistorySchema.index({ consultationId: 1 });
ChatHistorySchema.index({ 'qualityMetrics.flaggedForReview': 1 });
ChatHistorySchema.index({ 'outcomes.emergencyProtocolTriggered': 1 });

// Text search index for message content
ChatHistorySchema.index({
  'messages.content.text': 'text',
  'context.currentSymptoms': 'text',
  'context.mentionedMedicines': 'text',
  'context.discussedConditions': 'text'
});

// Compound indexes for analytics
ChatHistorySchema.index({ 
  'sessionInfo.platform': 1, 
  'sessionInfo.startTime': -1 
});
ChatHistorySchema.index({ 
  userId: 1, 
  'sessionInfo.sessionType': 1, 
  'sessionInfo.startTime': -1 
});

// Pre-save middleware to update analytics
ChatHistorySchema.pre('save', function(next) {
  // Update message counts
  this.analytics.totalMessages = this.messages.length;
  this.analytics.userMessages = this.messages.filter(msg => msg.sender === 'User').length;
  this.analytics.aiMessages = this.messages.filter(msg => msg.sender === 'AI').length;
  this.analytics.voiceMessages = this.messages.filter(msg => msg.voice.isVoiceMessage).length;
  
  // Count attachments
  this.analytics.attachmentsCount = this.messages.reduce((total, msg) => 
    total + (msg.attachments ? msg.attachments.length : 0), 0
  );
  
  // Calculate average response time
  const aiMessages = this.messages.filter(msg => msg.sender === 'AI' && msg.aiMetadata.responseTime);
  if (aiMessages.length > 0) {
    const responseTimes = aiMessages.map(msg => msg.aiMetadata.responseTime);
    this.analytics.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    this.analytics.maxResponseTime = Math.max(...responseTimes);
    this.analytics.minResponseTime = Math.min(...responseTimes);
  }
  
  // Count medical-related metrics
  this.analytics.symptomsDiscussed = this.context.currentSymptoms.length;
  this.analytics.medicinesQueried = this.context.mentionedMedicines.length;
  this.analytics.disclaimersShown = this.messages.filter(msg => 
    msg.medicalContext.disclaimerShown
  ).length;
  
  // Calculate total tokens used
  this.analytics.totalTokensUsed = this.messages.reduce((total, msg) => 
    total + (msg.aiMetadata.tokensUsed || 0), 0
  );
  
  // Update session duration
  if (this.sessionInfo.endTime && this.sessionInfo.startTime) {
    this.sessionInfo.duration = Math.round(
      (this.sessionInfo.endTime - this.sessionInfo.startTime) / 1000
    );
  }
  
  next();
});

// Static method to get chat statistics
ChatHistorySchema.statics.getStats = async function(userId = null, dateRange = null) {
  const matchStage = {};
  if (userId) matchStage.userId = mongoose.Types.ObjectId(userId);
  if (dateRange) {
    matchStage['sessionInfo.startTime'] = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    };
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        activeSessions: {
          $sum: { $cond: [{ $eq: ['$sessionInfo.isActive', true] }, 1, 0] }
        },
        totalMessages: { $sum: '$analytics.totalMessages' },
        avgSessionDuration: { $avg: '$sessionInfo.duration' },
        avgMessagesPerSession: { $avg: '$analytics.totalMessages' },
        totalVoiceMessages: { $sum: '$analytics.voiceMessages' },
        emergencySessions: {
          $sum: { $cond: [{ $eq: ['$outcomes.emergencyProtocolTriggered', true] }, 1, 0] }
        },
        avgUserSatisfaction: { $avg: '$analytics.sessionSatisfaction' },
        flaggedSessions: {
          $sum: { $cond: [{ $eq: ['$qualityMetrics.flaggedForReview', true] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalSessions: 0,
    activeSessions: 0,
    totalMessages: 0,
    avgSessionDuration: 0,
    avgMessagesPerSession: 0,
    totalVoiceMessages: 0,
    emergencySessions: 0,
    avgUserSatisfaction: 0,
    flaggedSessions: 0
  };
};

// Instance method to add message
ChatHistorySchema.methods.addMessage = function(sender, text, options = {}) {
  const messageId = options.messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const message = {
    messageId,
    sender,
    senderName: sender === 'AI' ? 'Jarvis AI' : options.senderName || 'User',
    content: {
      text,
      originalText: text,
      intent: options.intent,
      sentiment: options.sentiment || 'Neutral',
      urgency: options.urgency || 'Low'
    },
    attachments: options.attachments || [],
    voice: options.voice || { isVoiceMessage: false },
    aiMetadata: options.aiMetadata || {},
    timestamp: new Date(),
    status: options.status || 'Sent',
    tags: options.tags || [],
    category: options.category,
    medicalContext: options.medicalContext || {
      disclaimerShown: false,
      medicalAdviceGiven: false
    }
  };
  
  this.messages.push(message);
  return this.save();
};

// Instance method to end session
ChatHistorySchema.methods.endSession = function() {
  this.sessionInfo.endTime = new Date();
  this.sessionInfo.isActive = false;
  this.sessionInfo.duration = Math.round(
    (this.sessionInfo.endTime - this.sessionInfo.startTime) / 1000
  );
  
  return this.save();
};

// Instance method to add user feedback
ChatHistorySchema.methods.addMessageFeedback = function(messageId, feedback) {
  const message = this.messages.id(messageId);
  if (message) {
    message.userFeedback = {
      ...feedback,
      submittedAt: new Date()
    };
    return this.save();
  }
  throw new Error('Message not found');
};

// Instance method to flag for review
ChatHistorySchema.methods.flagForReview = function(reasons) {
  this.qualityMetrics.flaggedForReview = true;
  this.qualityMetrics.reviewReasons = reasons;
  this.qualityMetrics.reviewStatus = 'Pending';
  
  return this.save();
};

// Instance method to get conversation context
ChatHistorySchema.methods.getConversationContext = function(lastNMessages = 10) {
  const recentMessages = this.messages.slice(-lastNMessages);
  const context = {
    symptoms: [...new Set(this.context.currentSymptoms)],
    medicines: [...new Set(this.context.mentionedMedicines)],
    conditions: [...new Set(this.context.discussedConditions)],
    recentMessages: recentMessages.map(msg => ({
      sender: msg.sender,
      text: msg.content.text,
      timestamp: msg.timestamp,
      intent: msg.content.intent,
      urgency: msg.content.urgency
    })),
    userPreferences: this.context.userPreferences,
    currentStage: this.context.conversationFlow.currentStage
  };
  
  return context;
};

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);