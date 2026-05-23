// In-memory User model
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory database (defined in server.js but accessible here)
let inMemoryDB = {
  users: [],
  // Initialize with the same methods as in server.js
  find: function(collection, query = {}) {
    let results = [...this[collection]];
    
    // Apply query filters
    Object.keys(query).forEach(key => {
      if (key === '$or') {
        const orConditions = query[key];
        results = results.filter(doc => 
          orConditions.some(condition => 
            Object.keys(condition).every(orKey => 
              String(doc[orKey]).toLowerCase().includes(String(condition[orKey]).toLowerCase())
            )
          )
        );
      } else {
        results = results.filter(doc => {
          if (typeof query[key] === 'object' && query[key].$regex) {
            const regex = new RegExp(query[key].$regex, query[key].$options || 'i');
            return regex.test(doc[key]);
          } else if (typeof query[key] === 'object' && query[key].$in) {
            return query[key].$in.includes(doc[key]);
          } else {
            return doc[key] === query[key];
          }
        });
      }
    });
    
    return results;
  },
  
  // Find single document
  findOne: function(collection, query) {
    const results = this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  },
  
  // Find by ID
  findById: function(collection, id) {
    return this[collection].find(doc => doc._id === id);
  },
  
  // Insert document
  insertOne: function(collection, document) {
    const autoIncrement = {
      users: 1,
      products: 1,
      orders: 1,
      consultations: 1,
      chathistory: 1
    };
    
    const newDoc = {
      ...document,
      _id: `${collection}_${autoIncrement[collection]++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this[collection].push(newDoc);
    return newDoc;
  },
  
  // Update document by ID
  updateOne: function(collection, id, update) {
    const index = this[collection].findIndex(doc => doc._id === id);
    if (index !== -1) {
      const oldDoc = this[collection][index];
      this[collection][index] = {
        ...oldDoc,
        ...update,
        _id: oldDoc._id,
        updatedAt: new Date().toISOString()
      };
      return this[collection][index];
    }
    return null;
  },
  
  // Delete document by ID
  deleteOne: function(collection, id) {
    const index = this[collection].findIndex(doc => doc._id === id);
    if (index !== -1) {
      const deleted = this[collection].splice(index, 1)[0];
      return deleted;
    }
    return null;
  },
  
  // Count documents
  countDocuments: function(collection, query = {}) {
    return this.find(collection, query).length;
  }
};

// User model with in-memory database compatibility
const User = {
  // Create new user
  create: async (userData) => {
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcryptjs.hash(userData.password, 10);
    }
    
    // Generate OTP if needed
    if (!userData.otp) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      userData.otp = {
        code: bcryptjs.hashSync(otp, 10),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      };
    }
    
    // Check if user already exists
    const existing = inMemoryDB.findOne('users', { phone: userData.phone });
    if (existing) {
      throw new Error('User already exists with this phone number');
    }
    
    const user = inMemoryDB.insertOne('users', userData);
    
    // Add instance methods to the returned user
    user.generateOTP = function() {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.otp = {
        code: bcryptjs.hashSync(otp, 10),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      };
      return otp; // Return plain OTP to send to user
    };
    
    user.verifyOTP = async function(candidateOTP) {
      if (!this.otp || !this.otp.code) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
      }
      
      if (new Date() > this.otp.expiresAt) {
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }
      
      if (this.otp.attempts >= 3) {
        return { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
      }
      
      const isMatch = await bcryptjs.compare(candidateOTP, this.otp.code);
      
      if (!isMatch) {
        this.otp.attempts += 1;
        inMemoryDB.updateOne('users', this._id, { otp: this.otp });
        return { 
          success: false, 
          message: `Invalid OTP. ${3 - this.otp.attempts} attempts remaining.` 
        };
      }
      
      inMemoryDB.updateOne('users', this._id, { 
        otp: undefined, 
        isVerified: true, 
        lastLogin: new Date().toISOString() 
      });
      
      return { success: true, message: 'OTP verified successfully.' };
    };
    
    user.getSignedJwtToken = function() {
      return jwt.sign(
        { 
          id: this._id, 
          phone: this.phone, 
          role: this.role 
        },
        process.env.JWT_SECRET || 'aditya_medical_jwt_secret_2024',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
    };
    
    user.toPublicJSON = function() {
      return {
        _id: this._id,
        phone: this.phone,
        name: this.name,
        role: this.role,
        isVerified: this.isVerified,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
      };
    };
    
    return user;
  },

  // Find user by query
  find: async (query) => {
    const users = inMemoryDB.find('users', query);
    return users.map(user => {
      user.generateOTP = function() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = {
          code: bcryptjs.hashSync(otp, 10),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          attempts: 0
        };
        return otp; // Return plain OTP to send to user
      };
      
      user.verifyOTP = async function(candidateOTP) {
        if (!this.otp || !this.otp.code) {
          return { success: false, message: 'No OTP found. Please request a new one.' };
        }
        
        if (new Date() > this.otp.expiresAt) {
          return { success: false, message: 'OTP has expired. Please request a new one.' };
        }
        
        if (this.otp.attempts >= 3) {
          return { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
        }
        
        const isMatch = await bcryptjs.compare(candidateOTP, this.otp.code);
        
        if (!isMatch) {
          this.otp.attempts += 1;
          inMemoryDB.updateOne('users', this._id, { otp: this.otp });
          return { 
            success: false, 
            message: `Invalid OTP. ${3 - this.otp.attempts} attempts remaining.` 
          };
        }
        
        inMemoryDB.updateOne('users', this._id, { 
          otp: undefined, 
          isVerified: true, 
          lastLogin: new Date().toISOString() 
        });
        
        return { success: true, message: 'OTP verified successfully.' };
      };
      
      user.getSignedJwtToken = function() {
        return jwt.sign(
          { 
            id: this._id, 
            phone: this.phone, 
            role: this.role 
          },
          process.env.JWT_SECRET || 'aditya_medical_jwt_secret_2024',
          { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );
      };
      
      user.toPublicJSON = function() {
        return {
          _id: this._id,
          phone: this.phone,
          name: this.name,
          role: this.role,
          isVerified: this.isVerified,
          createdAt: this.createdAt,
          lastLogin: this.lastLogin
        };
      };
      
      return user;
    });
  },

  // Find single user
  findOne: async (query) => {
    const user = inMemoryDB.findOne('users', query);
    if (!user) return null;
    
    user.generateOTP = function() {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.otp = {
        code: bcryptjs.hashSync(otp, 10),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      };
      return otp; // Return plain OTP to send to user
    };
    
    user.verifyOTP = async function(candidateOTP) {
      if (!this.otp || !this.otp.code) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
      }
      
      if (new Date() > this.otp.expiresAt) {
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }
      
      if (this.otp.attempts >= 3) {
        return { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
      }
      
      const isMatch = await bcryptjs.compare(candidateOTP, this.otp.code);
      
      if (!isMatch) {
        this.otp.attempts += 1;
        inMemoryDB.updateOne('users', this._id, { otp: this.otp });
        return { 
          success: false, 
          message: `Invalid OTP. ${3 - this.otp.attempts} attempts remaining.` 
        };
      }
      
      inMemoryDB.updateOne('users', this._id, { 
        otp: undefined, 
        isVerified: true, 
        lastLogin: new Date().toISOString() 
      });
      
      return { success: true, message: 'OTP verified successfully.' };
    };
    
    user.getSignedJwtToken = function() {
      return jwt.sign(
        { 
          id: this._id, 
          phone: this.phone, 
          role: this.role 
        },
        process.env.JWT_SECRET || 'aditya_medical_jwt_secret_2024',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
    };
    
    user.toPublicJSON = function() {
      return {
        _id: this._id,
        phone: this.phone,
        name: this.name,
        role: this.role,
        isVerified: this.isVerified,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
      };
    };
    
    return user;
  },

  // Find user by ID
  findById: async (id) => {
    const user = inMemoryDB.findById('users', id);
    if (!user) return null;
    
    user.generateOTP = function() {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.otp = {
        code: bcryptjs.hashSync(otp, 10),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      };
      return otp; // Return plain OTP to send to user
    };
    
    user.verifyOTP = async function(candidateOTP) {
      if (!this.otp || !this.otp.code) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
      }
      
      if (new Date() > this.otp.expiresAt) {
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }
      
      if (this.otp.attempts >= 3) {
        return { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
      }
      
      const isMatch = await bcryptjs.compare(candidateOTP, this.otp.code);
      
      if (!isMatch) {
        this.otp.attempts += 1;
        inMemoryDB.updateOne('users', this._id, { otp: this.otp });
        return { 
          success: false, 
          message: `Invalid OTP. ${3 - this.otp.attempts} attempts remaining.` 
        };
      }
      
      inMemoryDB.updateOne('users', this._id, { 
        otp: undefined, 
        isVerified: true, 
        lastLogin: new Date().toISOString() 
      });
      
      return { success: true, message: 'OTP verified successfully.' };
    };
    
    user.getSignedJwtToken = function() {
      return jwt.sign(
        { 
          id: this._id, 
          phone: this.phone, 
          role: this.role 
        },
        process.env.JWT_SECRET || 'aditya_medical_jwt_secret_2024',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
    };
    
    user.toPublicJSON = function() {
      return {
        _id: this._id,
        phone: this.phone,
        name: this.name,
        role: this.role,
        isVerified: this.isVerified,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
      };
    };
    
    return user;
  },

  // Update user
  updateOne: async (id, update) => {
    if (update.password) {
      update.password = await bcryptjs.hash(update.password, 10);
    }
    return inMemoryDB.updateOne('users', id, update);
  },

  // Delete user
  deleteOne: async (id) => {
    return inMemoryDB.deleteOne('users', id);
  },

  // Count users
  countDocuments: async (query) => {
    return inMemoryDB.countDocuments('users', query);
  }
};

module.exports = User;