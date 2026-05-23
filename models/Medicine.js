const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxlength: [200, 'Medicine name cannot be more than 200 characters']
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true,
    maxlength: [200, 'Generic name cannot be more than 200 characters']
  },
  brandName: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [200, 'Brand name cannot be more than 200 characters']
  },
  manufacturer: {
    name: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    licenseNumber: { type: String, trim: true }
  },
  category: {
    type: String,
    required: [true, 'Medicine category is required'],
    enum: [
      'Analgesics', 'Antibiotics', 'Antifungals', 'Antivirals', 'Antiseptics',
      'Antacids', 'Antihistamines', 'Antihypertensives', 'Antidiabetics',
      'Antidepressants', 'Anxiolytics', 'Anticonvulsants', 'Bronchodilators',
      'Corticosteroids', 'Diuretics', 'Hormones', 'Immunosuppressants',
      'Laxatives', 'Muscle Relaxants', 'NSAIDs', 'Sedatives', 'Stimulants',
      'Vitamins', 'Minerals', 'Supplements', 'Vaccines', 'Emergency',
      'Cardiovascular', 'Gastrointestinal', 'Respiratory', 'Neurological',
      'Dermatological', 'Ophthalmological', 'Gynecological', 'Pediatric',
      'Others'
    ]
  },
  subCategory: {
    type: String,
    trim: true
  },
  therapeuticClass: {
    type: String,
    required: [true, 'Therapeutic class is required'],
    trim: true
  },
  pharmacologicalClass: {
    type: String,
    required: [true, 'Pharmacological class is required'],
    trim: true
  },
  activeIngredients: [{
    ingredient: { type: String, required: true, trim: true },
    strength: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true }
  }],
  dosageForm: {
    type: String,
    required: [true, 'Dosage form is required'],
    enum: [
      'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment',
      'Drops', 'Spray', 'Inhaler', 'Suppository', 'Patch', 'Gel',
      'Lotion', 'Solution', 'Suspension', 'Powder', 'Granules'
    ]
  },
  strength: {
    value: { type: Number, required: true },
    unit: { type: String, required: true, trim: true }
  },
  packaging: {
    type: { 
      type: String, 
      required: true,
      enum: ['Strip', 'Bottle', 'Vial', 'Tube', 'Box', 'Sachet', 'Ampoule']
    },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, trim: true }
  },
  pricing: {
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    gst: { type: Number, default: 12, min: 0, max: 28 }
  },
  dosageInstructions: {
    defaultDosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    instructions: { type: String, required: true, trim: true },
    maxDailyDose: { type: String, trim: true },
    foodInstructions: { 
      type: String, 
      enum: ['Before meals', 'After meals', 'With meals', 'Empty stomach', 'Any time'],
      default: 'Any time'
    }
  },
  indications: [{
    condition: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
    firstLineTherapy: { type: Boolean, default: false }
  }],
  contraindications: [{
    condition: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['Absolute', 'Relative'], default: 'Absolute' },
    reason: { type: String, trim: true }
  }],
  sideEffects: {
    common: [{ type: String, trim: true }],
    rare: [{ type: String, trim: true }],
    serious: [{ type: String, trim: true }]
  },
  drugInteractions: [{
    medicine: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], required: true },
    effect: { type: String, required: true, trim: true },
    management: { type: String, trim: true }
  }],
  warnings: [{
    type: { 
      type: String, 
      enum: ['Black Box', 'Pregnancy', 'Pediatric', 'Geriatric', 'Hepatic', 'Renal'],
      required: true 
    },
    description: { type: String, required: true, trim: true }
  }],
  prescriptionRequired: {
    type: Boolean,
    required: true,
    default: false
  },
  scheduleType: {
    type: String,
    enum: ['OTC', 'Schedule H', 'Schedule H1', 'Schedule X', 'Narcotic'],
    default: 'OTC'
  },
  ageGroups: {
    pediatric: {
      suitable: { type: Boolean, default: false },
      minAge: { type: Number, min: 0 },
      maxAge: { type: Number, min: 0 },
      specialInstructions: { type: String, trim: true }
    },
    adult: {
      suitable: { type: Boolean, default: true },
      specialInstructions: { type: String, trim: true }
    },
    geriatric: {
      suitable: { type: Boolean, default: true },
      specialInstructions: { type: String, trim: true }
    },
    pregnancy: {
      category: { 
        type: String, 
        enum: ['A', 'B', 'C', 'D', 'X'],
        default: 'C'
      },
      trimesterRestrictions: [{ type: String, enum: ['First', 'Second', 'Third'] }],
      lactationSafe: { type: Boolean, default: false }
    }
  },
  storage: {
    temperature: { type: String, required: true, trim: true },
    humidity: { type: String, trim: true },
    lightProtection: { type: Boolean, default: false },
    specialInstructions: { type: String, trim: true }
  },
  inventory: {
    currentStock: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 10 },
    maxStock: { type: Number, min: 0 },
    supplier: { type: String, trim: true },
    batchNumber: { type: String, trim: true },
    expiryDate: { type: Date, required: true },
    manufacturingDate: { type: Date },
    lastRestocked: { type: Date, default: Date.now }
  },
  qualityControl: {
    approved: { type: Boolean, default: false },
    approvedBy: { type: String, trim: true },
    approvalDate: { type: Date },
    testReports: [{ 
      testType: String,
      result: String,
      date: { type: Date, default: Date.now }
    }]
  },
  tags: [{ type: String, trim: true }],
  searchKeywords: [{ type: String, trim: true }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false }
  }],
  documents: [{
    type: { type: String, enum: ['Product Insert', 'Safety Data', 'Certificate'], required: true },
    url: { type: String, required: true },
    title: { type: String, required: true, trim: true }
  }],
  popularity: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, default: 0 }
  },
  alternatives: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    type: { type: String, enum: ['Generic', 'Brand', 'Therapeutic'], required: true },
    reason: { type: String, trim: true }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  discontinuedDate: Date,
  discontinuationReason: { type: String, trim: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full medicine name
MedicineSchema.virtual('fullName').get(function() {
  return `${this.brandName} (${this.genericName})`;
});

// Virtual for discounted price
MedicineSchema.virtual('discountedPrice').get(function() {
  if (this.pricing.discount > 0) {
    return this.pricing.mrp * (1 - this.pricing.discount / 100);
  }
  return this.pricing.sellingPrice;
});

// Virtual for stock status
MedicineSchema.virtual('stockStatus').get(function() {
  if (this.inventory.currentStock === 0) return 'Out of Stock';
  if (this.inventory.currentStock <= this.inventory.reorderLevel) return 'Low Stock';
  return 'In Stock';
});

// Virtual for expiry status
MedicineSchema.virtual('expiryStatus').get(function() {
  const today = new Date();
  const expiryDate = new Date(this.inventory.expiryDate);
  const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysToExpiry < 0) return 'Expired';
  if (daysToExpiry <= 30) return 'Near Expiry';
  if (daysToExpiry <= 90) return 'Expiring Soon';
  return 'Good';
});

// Indexes for better query performance
MedicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text' });
MedicineSchema.index({ category: 1, subCategory: 1 });
MedicineSchema.index({ 'indications.condition': 1 });
MedicineSchema.index({ prescriptionRequired: 1 });
MedicineSchema.index({ 'pricing.sellingPrice': 1 });
MedicineSchema.index({ isActive: 1 });
MedicineSchema.index({ 'inventory.currentStock': 1 });
MedicineSchema.index({ createdAt: -1 });
MedicineSchema.index({ 'popularity.orders': -1 });
MedicineSchema.index({ 'inventory.expiryDate': 1 });

// Text search index
MedicineSchema.index({
  name: 'text',
  genericName: 'text',
  brandName: 'text',
  'manufacturer.name': 'text',
  searchKeywords: 'text'
});

// Pre-save middleware to update search keywords
MedicineSchema.pre('save', function(next) {
  // Auto-generate search keywords
  this.searchKeywords = [
    ...this.name.split(' '),
    ...this.genericName.split(' '),
    ...this.brandName.split(' '),
    this.category,
    this.therapeuticClass,
    ...this.indications.map(ind => ind.condition),
    ...this.tags
  ].filter(Boolean).map(keyword => keyword.toLowerCase());
  
  next();
});

// Static method to find medicines by symptoms/conditions
MedicineSchema.statics.findByCondition = function(condition, options = {}) {
  const query = {
    'indications.condition': new RegExp(condition, 'i'),
    isActive: true,
    'inventory.currentStock': { $gt: 0 }
  };
  
  return this.find(query)
    .sort(options.sort || { 'popularity.orders': -1 })
    .limit(options.limit || 20)
    .populate('alternatives.medicineId', 'name brandName pricing.sellingPrice');
};

// Static method to get medicine statistics
MedicineSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalMedicines: { $sum: 1 },
        activeMedicines: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        inStockMedicines: {
          $sum: { $cond: [{ $gt: ['$inventory.currentStock', 0] }, 1, 0] }
        },
        outOfStockMedicines: {
          $sum: { $cond: [{ $eq: ['$inventory.currentStock', 0] }, 1, 0] }
        },
        avgPrice: { $avg: '$pricing.sellingPrice' },
        totalValue: { 
          $sum: { 
            $multiply: ['$inventory.currentStock', '$pricing.costPrice'] 
          } 
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalMedicines: 0,
    activeMedicines: 0,
    inStockMedicines: 0,
    outOfStockMedicines: 0,
    avgPrice: 0,
    totalValue: 0
  };
};

// Static method to get popular medicines
MedicineSchema.statics.getPopular = function(limit = 10) {
  return this.find({ 
    isActive: true, 
    'inventory.currentStock': { $gt: 0 } 
  })
    .sort({ 'popularity.orders': -1, 'popularity.rating': -1 })
    .limit(limit)
    .select('name brandName pricing.sellingPrice popularity images');
};

// Instance method to check if medicine is available
MedicineSchema.methods.isAvailable = function() {
  return this.isActive && 
         this.inventory.currentStock > 0 && 
         new Date(this.inventory.expiryDate) > new Date();
};

// Instance method to update stock
MedicineSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.inventory.currentStock = Math.max(0, this.inventory.currentStock - quantity);
  } else if (operation === 'add') {
    this.inventory.currentStock += quantity;
    this.inventory.lastRestocked = new Date();
  }
  return this.save();
};

// Instance method to add view
MedicineSchema.methods.addView = function() {
  this.popularity.views += 1;
  return this.save();
};

// Instance method to get similar medicines
MedicineSchema.methods.getSimilar = function(limit = 5) {
  return this.constructor.find({
    _id: { $ne: this._id },
    $or: [
      { therapeuticClass: this.therapeuticClass },
      { 'indications.condition': { $in: this.indications.map(i => i.condition) } },
      { category: this.category }
    ],
    isActive: true,
    'inventory.currentStock': { $gt: 0 }
  })
    .limit(limit)
    .select('name brandName pricing.sellingPrice images');
};

module.exports = mongoose.model('Medicine', MedicineSchema);