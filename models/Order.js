const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
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
  
  // Order Status
  status: {
    type: String,
    enum: [
      'Cart', 'Pending', 'Confirmed', 'Processing', 'Packed', 
      'Shipped', 'Out_for_Delivery', 'Delivered', 'Cancelled', 
      'Returned', 'Refunded', 'Failed'
    ],
    default: 'Pending'
  },
  
  // Order Items
  items: [{
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine',
      required: true 
    },
    medicineName: { type: String, required: true, trim: true },
    brandName: { type: String, trim: true },
    genericName: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    dosageForm: { type: String, trim: true },
    strength: { type: String, trim: true },
    packaging: { type: String, trim: true },
    batchNumber: { type: String, trim: true },
    expiryDate: { type: Date },
    
    // Pricing
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0, min: 0 },
    
    // Quantity and Total
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    
    // Medicine Details for Reference
    prescriptionRequired: { type: Boolean, default: false },
    scheduleType: { type: String, default: 'OTC' },
    
    // Prescription Details (if required)
    prescription: {
      required: { type: Boolean, default: false },
      uploaded: { type: Boolean, default: false },
      prescriptionUrl: { type: String },
      doctorName: { type: String, trim: true },
      hospitalName: { type: String, trim: true },
      prescriptionDate: Date,
      verified: { type: Boolean, default: false },
      verifiedBy: { type: String, trim: true },
      verificationDate: Date,
      verificationNotes: { type: String, trim: true }
    },
    
    // Fulfillment
    available: { type: Boolean, default: true },
    substituted: { type: Boolean, default: false },
    substituteMedicine: {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
      medicineName: { type: String, trim: true },
      reason: { type: String, trim: true },
      priceAdjustment: { type: Number, default: 0 }
    },
    
    // Delivery Status
    itemStatus: {
      type: String,
      enum: ['Available', 'Packed', 'Shipped', 'Delivered', 'Unavailable', 'Substituted'],
      default: 'Available'
    }
  }],
  
  // Order Summary
  orderSummary: {
    itemsCount: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    totalDiscount: { type: Number, default: 0, min: 0 },
    deliveryCharges: { type: Number, default: 0, min: 0 },
    packagingCharges: { type: Number, default: 0, min: 0 },
    gst: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    amountPayable: { type: Number, required: true, min: 0 },
    savings: { type: Number, default: 0, min: 0 }
  },
  
  // Customer Information
  customerInfo: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    alternatePhone: { type: String, trim: true }
  },
  
  // Delivery Address
  deliveryAddress: {
    type: { 
      type: String, 
      enum: ['Home', 'Work', 'Other'],
      default: 'Home'
    },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    landmark: { type: String, trim: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryInstructions: { type: String, trim: true }
  },
  
  // Payment Information
  payment: {
    method: { 
      type: String, 
      enum: ['Card', 'UPI', 'Net Banking', 'Wallet', 'COD'],
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Partial_Refund'],
      default: 'Pending'
    },
    transactionId: { type: String, trim: true },
    paymentId: { type: String, trim: true },
    gateway: { type: String, trim: true }, // Razorpay, Stripe, etc.
    paidAmount: { type: Number, default: 0, min: 0 },
    refundAmount: { type: Number, default: 0, min: 0 },
    paymentDate: Date,
    failureReason: { type: String, trim: true },
    
    // COD specific
    codCharges: { type: Number, default: 0, min: 0 },
    codCollected: { type: Boolean, default: false },
    codCollectionDate: Date
  },
  
  // Delivery Information
  delivery: {
    type: { 
      type: String, 
      enum: ['Standard', 'Express', 'Same_Day', 'Scheduled'],
      default: 'Standard'
    },
    estimatedDate: { type: Date, required: true },
    actualDate: Date,
    timeSlot: { type: String, trim: true },
    partnerId: { type: String, trim: true }, // Delivery partner ID
    partnerName: { type: String, trim: true },
    trackingId: { type: String, trim: true },
    deliveryCharges: { type: Number, default: 0, min: 0 },
    freeDelivery: { type: Boolean, default: false },
    
    // Delivery Person Details
    deliveryPerson: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      vehicleNumber: { type: String, trim: true }
    },
    
    // Delivery Attempts
    deliveryAttempts: [{
      attemptDate: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['Successful', 'Failed', 'Customer_Unavailable', 'Address_Issue'],
        required: true
      },
      reason: { type: String, trim: true },
      notes: { type: String, trim: true },
      nextAttempt: Date
    }],
    
    // Special Instructions
    specialInstructions: { type: String, trim: true },
    signatureRequired: { type: Boolean, default: false },
    proofOfDelivery: {
      type: { type: String, enum: ['Signature', 'Photo', 'OTP'] },
      url: { type: String },
      verificationCode: { type: String }
    }
  },
  
  // Order Timeline
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    updatedBy: { type: String, trim: true } // System, User, Admin, etc.
  }],
  
  // Prescription Management
  prescriptions: [{
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: String, trim: true },
    verificationDate: Date,
    verificationNotes: { type: String, trim: true },
    applicableMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
  }],
  
  // Return/Refund Information
  returns: [{
    itemIndex: { type: Number, required: true },
    reason: { 
      type: String, 
      enum: [
        'Damaged Product', 'Wrong Product', 'Expired Product', 
        'Not Required', 'Quality Issue', 'Late Delivery', 'Other'
      ],
      required: true
    },
    description: { type: String, trim: true },
    requestDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Requested', 'Approved', 'Rejected', 'Picked_Up', 'Refunded'],
      default: 'Requested'
    },
    refundAmount: { type: Number, min: 0 },
    refundMethod: { type: String, enum: ['Original_Payment', 'Wallet', 'Bank_Transfer'] },
    pickupScheduled: Date,
    images: [{ type: String }], // URLs of return images
    processedBy: { type: String, trim: true },
    processedAt: Date,
    notes: { type: String, trim: true }
  }],
  
  // Customer Feedback
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
    deliveryRating: { type: Number, min: 1, max: 5 },
    packagingRating: { type: Number, min: 1, max: 5 },
    overallExperience: { type: Number, min: 1, max: 5 },
    wouldRecommend: { type: Boolean },
    submittedAt: Date,
    images: [{ type: String }] // URLs of feedback images
  },
  
  // Order Analytics
  analytics: {
    sourceChannel: { type: String, trim: true }, // Web, Mobile App, WhatsApp
    deviceType: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'] },
    platform: { type: String, trim: true },
    referralSource: { type: String, trim: true },
    campaignId: { type: String, trim: true },
    
    // Order Processing Times
    processingTime: { type: Number }, // Time from order to confirmation (minutes)
    packingTime: { type: Number }, // Time from confirmation to packed (minutes)
    shippingTime: { type: Number }, // Time from packed to shipped (minutes)
    deliveryTime: { type: Number }, // Time from shipped to delivered (minutes)
    totalTime: { type: Number } // Total time from order to delivery (minutes)
  },
  
  // Special Offers and Coupons
  offers: [{
    code: { type: String, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ['Percentage', 'Fixed', 'Free_Delivery'] },
    discountValue: { type: Number, min: 0 },
    appliedAmount: { type: Number, min: 0 }
  }],
  
  // Internal Notes
  internalNotes: [{
    note: { type: String, required: true, trim: true },
    addedBy: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
    category: { 
      type: String, 
      enum: ['General', 'Prescription', 'Delivery', 'Payment', 'Customer_Service'],
      default: 'General'
    }
  }],
  
  // Flags and Alerts
  flags: {
    highValue: { type: Boolean, default: false },
    prescriptionPending: { type: Boolean, default: false },
    deliveryAlert: { type: Boolean, default: false },
    paymentAlert: { type: Boolean, default: false },
    customerComplaint: { type: Boolean, default: false },
    fraudSuspicion: { type: Boolean, default: false }
  },
  
  // Order Source
  source: {
    type: { 
      type: String, 
      enum: ['Direct', 'Consultation', 'Repeat', 'Subscription'],
      default: 'Direct'
    },
    details: { type: String, trim: true }
  },
  
  isActive: { type: Boolean, default: true },
  deletedAt: Date,
  deletedBy: { type: String, trim: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order age in days
OrderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
OrderSchema.virtual('deliveryStatus').get(function() {
  if (this.status === 'Delivered') return 'Delivered';
  if (this.status === 'Cancelled') return 'Cancelled';
  if (this.delivery.actualDate) return 'Delivered';
  if (this.status === 'Out_for_Delivery') return 'Out for Delivery';
  if (this.status === 'Shipped') return 'In Transit';
  if (this.status === 'Packed') return 'Ready to Ship';
  return 'Processing';
});

// Virtual for payment status summary
OrderSchema.virtual('paymentStatusSummary').get(function() {
  if (this.payment.method === 'COD' && this.status === 'Delivered' && !this.payment.codCollected) {
    return 'COD Pending';
  }
  return this.payment.status;
});

// Virtual for total savings
OrderSchema.virtual('totalSavings').get(function() {
  return this.orderSummary.totalDiscount + (this.delivery.freeDelivery ? this.orderSummary.deliveryCharges : 0);
});

// Indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ 'delivery.estimatedDate': 1 });
OrderSchema.index({ 'delivery.actualDate': 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'items.medicineId': 1 });
OrderSchema.index({ consultationId: 1 });
OrderSchema.index({ 'customerInfo.phone': 1 });
OrderSchema.index({ 'delivery.trackingId': 1 });

// Compound indexes
OrderSchema.index({ userId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ status: 1, 'delivery.estimatedDate': 1 });
OrderSchema.index({ 'payment.method': 1, 'payment.status': 1 });

// Pre-save middleware to generate order ID and update timeline
OrderSchema.pre('save', function(next) {
  // Generate order ID if not exists
  if (!this.orderId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderId = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  
  // Update timeline if status changed
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      description: `Order status updated to ${this.status}`,
      updatedBy: 'System'
    });
  }
  
  // Calculate order summary
  if (this.isModified('items')) {
    this.orderSummary.itemsCount = this.items.length;
    this.orderSummary.subtotal = this.items.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    this.orderSummary.totalDiscount = this.items.reduce((sum, item) => sum + item.discountAmount, 0);
    
    // Calculate GST (12% default)
    this.orderSummary.gst = Math.round(this.orderSummary.subtotal * 0.12);
    
    // Calculate total amount
    this.orderSummary.totalAmount = this.orderSummary.subtotal + this.orderSummary.gst + 
                                   this.orderSummary.deliveryCharges + this.orderSummary.packagingCharges;
    
    this.orderSummary.amountPayable = this.orderSummary.totalAmount - this.orderSummary.totalDiscount;
    this.orderSummary.savings = this.orderSummary.totalDiscount;
  }
  
  next();
});

// Static method to get order statistics
OrderSchema.statics.getStats = async function(userId = null, dateRange = null) {
  const matchStage = {};
  if (userId) matchStage.userId = mongoose.Types.ObjectId(userId);
  if (dateRange) {
    matchStage.createdAt = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    };
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
        },
        totalRevenue: { $sum: '$orderSummary.amountPayable' },
        avgOrderValue: { $avg: '$orderSummary.amountPayable' },
        totalSavings: { $sum: '$orderSummary.savings' },
        codOrders: {
          $sum: { $cond: [{ $eq: ['$payment.method', 'COD'] }, 1, 0] }
        },
        onlineOrders: {
          $sum: { $cond: [{ $ne: ['$payment.method', 'COD'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    totalSavings: 0,
    codOrders: 0,
    onlineOrders: 0
  };
};

// Static method to get popular medicines
OrderSchema.statics.getPopularMedicines = function(limit = 10, dateRange = null) {
  const matchStage = { status: 'Delivered' };
  if (dateRange) {
    matchStage.createdAt = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate)
    };
  }
  
  return this.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.medicineId',
        medicineName: { $first: '$items.medicineName' },
        totalQuantity: { $sum: '$items.quantity' },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$items.totalPrice' },
        avgPrice: { $avg: '$items.sellingPrice' }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

// Instance method to add timeline event
OrderSchema.methods.addTimelineEvent = function(status, description, updatedBy = 'System', location = null) {
  this.timeline.push({
    status,
    timestamp: new Date(),
    description,
    updatedBy,
    location
  });
  return this.save();
};

// Instance method to update delivery status
OrderSchema.methods.updateDeliveryStatus = function(status, description, location = null) {
  this.status = status;
  return this.addTimelineEvent(status, description, 'System', location);
};

// Instance method to calculate delivery time
OrderSchema.methods.calculateDeliveryTime = function() {
  if (this.delivery.actualDate && this.createdAt) {
    return Math.round((this.delivery.actualDate - this.createdAt) / (1000 * 60 * 60 * 24)); // in days
  }
  return null;
};

// Instance method to check if prescription is required
OrderSchema.methods.isPrescriptionRequired = function() {
  return this.items.some(item => item.prescriptionRequired);
};

// Instance method to check if prescription is complete
OrderSchema.methods.isPrescriptionComplete = function() {
  const prescriptionRequired = this.items.filter(item => item.prescriptionRequired);
  const prescriptionUploaded = this.items.filter(item => item.prescription.uploaded);
  
  return prescriptionRequired.length === prescriptionUploaded.length;
};

// Instance method to process return
OrderSchema.methods.processReturn = function(itemIndex, reason, description) {
  this.returns.push({
    itemIndex,
    reason,
    description,
    requestDate: new Date(),
    status: 'Requested'
  });
  
  return this.save();
};

// Instance method to add internal note
OrderSchema.methods.addInternalNote = function(note, addedBy, category = 'General') {
  this.internalNotes.push({
    note,
    addedBy,
    category,
    addedAt: new Date()
  });
  
  return this.save();
};

module.exports = mongoose.model('Order', OrderSchema);