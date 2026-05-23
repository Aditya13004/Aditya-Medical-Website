const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['AI_Chat', 'Telemedicine', 'In_Person', 'Emergency'],
    default: 'AI_Chat'
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Pending_Payment', 'Scheduled'],
    default: 'Active'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  
  // Patient Information
  patientInfo: {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: true 
    },
    weight: { type: Number, min: 0 }, // in kg
    height: { type: Number, min: 0 }, // in cm
    bloodGroup: { 
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    contactNumber: { type: String, trim: true },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true }
    }
  },

  // Chief Complaint
  chiefComplaint: {
    symptoms: [{
      name: { type: String, required: true, trim: true },
      severity: { 
        type: String, 
        enum: ['Mild', 'Moderate', 'Severe', 'Very Severe'],
        default: 'Mild'
      },
      duration: { type: String, trim: true }, // e.g., "2 days", "1 week"
      onset: { 
        type: String,
        enum: ['Sudden', 'Gradual', 'Progressive'],
        default: 'Gradual'
      },
      triggers: [{ type: String, trim: true }],
      relievingFactors: [{ type: String, trim: true }],
      associatedSymptoms: [{ type: String, trim: true }]
    }],
    description: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    painScale: { type: Number, min: 0, max: 10 } // 0-10 pain scale
  },

  // Medical History
  medicalHistory: {
    previousIllnesses: [{
      condition: { type: String, required: true, trim: true },
      diagnosedDate: Date,
      status: { 
        type: String, 
        enum: ['Active', 'Resolved', 'Chronic', 'Under Treatment'],
        default: 'Active'
      },
      notes: { type: String, trim: true }
    }],
    surgicalHistory: [{
      procedure: { type: String, required: true, trim: true },
      date: Date,
      hospital: { type: String, trim: true },
      complications: { type: String, trim: true }
    }],
    familyHistory: [{
      relation: { type: String, required: true, trim: true },
      condition: { type: String, required: true, trim: true },
      ageOfOnset: Number
    }],
    allergies: [{
      allergen: { type: String, required: true, trim: true },
      reaction: { type: String, required: true, trim: true },
      severity: { 
        type: String, 
        enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening'],
        default: 'Mild'
      }
    }],
    currentMedications: [{
      medicineName: { type: String, required: true, trim: true },
      dosage: { type: String, required: true, trim: true },
      frequency: { type: String, required: true, trim: true },
      startDate: Date,
      prescribedBy: { type: String, trim: true },
      reason: { type: String, trim: true }
    }],
    socialHistory: {
      smoking: {
        status: { type: String, enum: ['Never', 'Former', 'Current'], default: 'Never' },
        quantity: { type: String, trim: true },
        duration: { type: String, trim: true }
      },
      alcohol: {
        status: { type: String, enum: ['Never', 'Occasional', 'Regular', 'Heavy'], default: 'Never' },
        quantity: { type: String, trim: true },
        frequency: { type: String, trim: true }
      },
      exercise: {
        frequency: { type: String, trim: true },
        type: { type: String, trim: true }
      },
      diet: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'], default: 'Non-Vegetarian' },
      occupation: { type: String, trim: true },
      stress: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
    }
  },

  // Vital Signs
  vitalSigns: {
    temperature: { type: Number, min: 30, max: 50 }, // in Celsius
    bloodPressure: {
      systolic: { type: Number, min: 60, max: 300 },
      diastolic: { type: Number, min: 30, max: 200 }
    },
    heartRate: { type: Number, min: 30, max: 300 }, // bpm
    respiratoryRate: { type: Number, min: 8, max: 60 }, // breaths per minute
    oxygenSaturation: { type: Number, min: 70, max: 100 }, // percentage
    bmi: { type: Number, min: 10, max: 100 },
    recordedAt: { type: Date, default: Date.now },
    recordedBy: { type: String, trim: true }
  },

  // AI Analysis Results
  aiAnalysis: {
    symptomAnalysis: [{
      symptom: { type: String, required: true, trim: true },
      possibleCauses: [{ type: String, trim: true }],
      riskLevel: { 
        type: String, 
        enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        default: 'Low'
      },
      urgency: { 
        type: String, 
        enum: ['Non-urgent', 'Schedule appointment', 'Urgent', 'Emergency'],
        default: 'Non-urgent'
      }
    }],
    possibleConditions: [{
      condition: { type: String, required: true, trim: true },
      probability: { type: Number, min: 0, max: 100 }, // percentage
      severity: { 
        type: String, 
        enum: ['Mild', 'Moderate', 'Severe', 'Critical'],
        default: 'Mild'
      },
      description: { type: String, trim: true },
      recommendedActions: [{ type: String, trim: true }]
    }],
    riskFactors: [{ type: String, trim: true }],
    redFlags: [{ type: String, trim: true }],
    recommendations: {
      immediateActions: [{ type: String, trim: true }],
      lifestyle: [{ type: String, trim: true }],
      followUp: [{ type: String, trim: true }],
      monitoring: [{ type: String, trim: true }]
    },
    confidenceScore: { type: Number, min: 0, max: 100, default: 0 }
  },

  // Treatment Plan
  treatmentPlan: {
    diagnosis: [{
      primary: { type: Boolean, default: false },
      condition: { type: String, required: true, trim: true },
      icdCode: { type: String, trim: true },
      confidence: { type: Number, min: 0, max: 100 }
    }],
    medications: [{
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
      medicineName: { type: String, required: true, trim: true },
      dosage: { type: String, required: true, trim: true },
      frequency: { type: String, required: true, trim: true },
      duration: { type: String, required: true, trim: true },
      instructions: { type: String, trim: true },
      foodInstructions: { type: String, trim: true },
      sideEffects: [{ type: String, trim: true }],
      precautions: [{ type: String, trim: true }],
      addedToCart: { type: Boolean, default: false }
    }],
    investigations: [{
      test: { type: String, required: true, trim: true },
      urgency: { 
        type: String, 
        enum: ['Routine', 'Urgent', 'STAT'],
        default: 'Routine'
      },
      reason: { type: String, trim: true },
      expectedResults: { type: String, trim: true }
    }],
    referrals: [{
      specialty: { type: String, required: true, trim: true },
      reason: { type: String, required: true, trim: true },
      urgency: { 
        type: String, 
        enum: ['Routine', 'Urgent', 'STAT'],
        default: 'Routine'
      }
    }],
    followUp: {
      required: { type: Boolean, default: false },
      timeframe: { type: String, trim: true },
      reason: { type: String, trim: true },
      instructions: { type: String, trim: true }
    }
  },

  // Conversation History
  chatHistory: [{
    sender: { 
      type: String, 
      enum: ['User', 'AI', 'Doctor', 'System'],
      required: true 
    },
    message: { type: String, required: true },
    messageType: {
      type: String,
      enum: ['Text', 'Audio', 'Image', 'Document', 'Voice_Note'],
      default: 'Text'
    },
    audioUrl: { type: String }, // for voice messages
    attachments: [{
      url: { type: String, required: true },
      type: { type: String, required: true },
      name: { type: String, required: true }
    }],
    timestamp: { type: Date, default: Date.now },
    metadata: {
      confidence: { type: Number, min: 0, max: 100 },
      intent: { type: String, trim: true },
      entities: [{ type: String }],
      sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] }
    }
  }],

  // Appointment Details (for telemedicine/in-person)
  appointment: {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    scheduledDateTime: Date,
    duration: { type: Number, default: 30 }, // in minutes
    meetingUrl: { type: String, trim: true },
    meetingId: { type: String, trim: true },
    actualStartTime: Date,
    actualEndTime: Date,
    noShow: { type: Boolean, default: false },
    cancelledBy: { type: String, enum: ['Patient', 'Doctor', 'System'] },
    cancellationReason: { type: String, trim: true }
  },

  // Payment Information
  payment: {
    amount: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'INR' },
    status: { 
      type: String, 
      enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Free'],
      default: 'Free'
    },
    method: { type: String, enum: ['Card', 'UPI', 'Wallet', 'Cash', 'Free'] },
    transactionId: { type: String, trim: true },
    paymentDate: Date
  },

  // Quality and Feedback
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
    helpfulness: { type: Number, min: 1, max: 5 },
    accuracy: { type: Number, min: 1, max: 5 },
    userExperience: { type: Number, min: 1, max: 5 },
    suggestions: { type: String, trim: true },
    submittedAt: Date
  },

  // Technical Information
  technicalInfo: {
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    deviceType: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'] },
    platform: { type: String, trim: true },
    browser: { type: String, trim: true },
    location: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      city: { type: String, trim: true }
    }
  },

  // Analytics
  analytics: {
    duration: { type: Number, default: 0 }, // in seconds
    messageCount: { type: Number, default: 0 },
    voiceMessageCount: { type: Number, default: 0 },
    attachmentCount: { type: Number, default: 0 },
    symptomsAnalyzed: { type: Number, default: 0 },
    medicinesRecommended: { type: Number, default: 0 },
    aiInteractions: { type: Number, default: 0 }
  },

  isActive: { type: Boolean, default: true },
  completedAt: Date,
  notes: { type: String, trim: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for consultation duration
ConsultationSchema.virtual('consultationDuration').get(function() {
  if (this.completedAt && this.createdAt) {
    return Math.round((this.completedAt - this.createdAt) / 1000 / 60); // in minutes
  }
  return 0;
});

// Virtual for BMI calculation
ConsultationSchema.virtual('calculatedBMI').get(function() {
  if (this.patientInfo.weight && this.patientInfo.height) {
    const heightInMeters = this.patientInfo.height / 100;
    return (this.patientInfo.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual for risk assessment
ConsultationSchema.virtual('overallRiskLevel').get(function() {
  if (!this.aiAnalysis.symptomAnalysis.length) return 'Unknown';
  
  const riskLevels = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
  const maxRisk = Math.max(...this.aiAnalysis.symptomAnalysis.map(s => riskLevels[s.riskLevel] || 0));
  
  return Object.keys(riskLevels).find(key => riskLevels[key] === maxRisk) || 'Unknown';
});

// Indexes for better query performance
ConsultationSchema.index({ userId: 1, createdAt: -1 });
ConsultationSchema.index({ sessionId: 1 });
ConsultationSchema.index({ status: 1 });
ConsultationSchema.index({ type: 1 });
ConsultationSchema.index({ priority: 1 });
ConsultationSchema.index({ 'appointment.doctorId': 1 });
ConsultationSchema.index({ 'appointment.scheduledDateTime': 1 });
ConsultationSchema.index({ createdAt: -1 });
ConsultationSchema.index({ completedAt: -1 });

// Text search index for symptoms and conditions
ConsultationSchema.index({
  'chiefComplaint.description': 'text',
  'chiefComplaint.symptoms.name': 'text',
  'aiAnalysis.possibleConditions.condition': 'text',
  'treatmentPlan.diagnosis.condition': 'text'
});

// Pre-save middleware to update analytics
ConsultationSchema.pre('save', function(next) {
  // Update message count
  this.analytics.messageCount = this.chatHistory.length;
  
  // Count voice messages
  this.analytics.voiceMessageCount = this.chatHistory.filter(
    msg => msg.messageType === 'Audio' || msg.messageType === 'Voice_Note'
  ).length;
  
  // Count attachments
  this.analytics.attachmentCount = this.chatHistory.reduce(
    (total, msg) => total + (msg.attachments ? msg.attachments.length : 0), 0
  );
  
  // Count symptoms analyzed
  this.analytics.symptomsAnalyzed = this.aiAnalysis.symptomAnalysis.length;
  
  // Count medicines recommended
  this.analytics.medicinesRecommended = this.treatmentPlan.medications.length;
  
  // Count AI interactions
  this.analytics.aiInteractions = this.chatHistory.filter(msg => msg.sender === 'AI').length;
  
  // Calculate session duration
  if (this.completedAt) {
    this.analytics.duration = Math.round((this.completedAt - this.createdAt) / 1000);
  }
  
  next();
});

// Static method to get consultation statistics
ConsultationSchema.statics.getStats = async function(userId = null) {
  const matchStage = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalConsultations: { $sum: 1 },
        activeConsultations: {
          $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
        },
        completedConsultations: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        aiConsultations: {
          $sum: { $cond: [{ $eq: ['$type', 'AI_Chat'] }, 1, 0] }
        },
        avgDuration: { $avg: '$analytics.duration' },
        avgRating: { $avg: '$feedback.rating' },
        totalMessages: { $sum: '$analytics.messageCount' }
      }
    }
  ]);
  
  return stats[0] || {
    totalConsultations: 0,
    activeConsultations: 0,
    completedConsultations: 0,
    aiConsultations: 0,
    avgDuration: 0,
    avgRating: 0,
    totalMessages: 0
  };
};

// Static method to find consultations by symptoms
ConsultationSchema.statics.findBySymptoms = function(symptoms, limit = 10) {
  const symptomRegex = symptoms.map(symptom => new RegExp(symptom, 'i'));
  
  return this.find({
    $or: [
      { 'chiefComplaint.symptoms.name': { $in: symptomRegex } },
      { 'aiAnalysis.possibleConditions.condition': { $in: symptomRegex } }
    ]
  })
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');
};

// Instance method to add chat message
ConsultationSchema.methods.addMessage = function(sender, message, messageType = 'Text', metadata = {}) {
  this.chatHistory.push({
    sender,
    message,
    messageType,
    metadata,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to complete consultation
ConsultationSchema.methods.complete = function() {
  this.status = 'Completed';
  this.completedAt = new Date();
  this.isActive = false;
  
  return this.save();
};

// Instance method to add medicine to cart
ConsultationSchema.methods.addMedicineToCart = async function(medicineIndex) {
  if (this.treatmentPlan.medications[medicineIndex]) {
    this.treatmentPlan.medications[medicineIndex].addedToCart = true;
    return this.save();
  }
  throw new Error('Medicine not found in treatment plan');
};

// Instance method to calculate risk score
ConsultationSchema.methods.calculateRiskScore = function() {
  const riskWeights = {
    'Very Low': 1,
    'Low': 2, 
    'Medium': 3,
    'High': 4,
    'Very High': 5
  };
  
  let totalScore = 0;
  let count = 0;
  
  this.aiAnalysis.symptomAnalysis.forEach(symptom => {
    totalScore += riskWeights[symptom.riskLevel] || 0;
    count++;
  });
  
  return count > 0 ? Math.round(totalScore / count) : 0;
};

module.exports = mongoose.model('Consultation', ConsultationSchema);