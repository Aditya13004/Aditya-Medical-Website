const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Routes - commented out as they don't exist
// const authRoutes = require('./routes/auth');
// const medicineRoutes = require('./routes/medicines');
// const consultationRoutes = require('./routes/consultations');
// const chatRoutes = require('./routes/chat');
// const userRoutes = require('./routes/users');

// Use in-memory database instead of MongoDB
const inMemoryDB = {
  users: [],
  products: [],
  orders: [],
  consultations: [],
  chathistory: [],
  
  // Find documents matching query
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

const simpleDB = {
  // User model functions
  User: {
    create: (data) => inMemoryDB.insertOne('users', data),
    find: (query, options) => inMemoryDB.find('users', query, options),
    findOne: (query) => inMemoryDB.findOne('users', query),
    findById: (id) => inMemoryDB.findById('users', id),
    updateOne: (id, update) => inMemoryDB.updateOne('users', id, update),
    deleteOne: (id) => inMemoryDB.deleteOne('users', id),
    countDocuments: (query) => inMemoryDB.countDocuments('users', query)
  },
  
  // Product model functions
  Product: {
    create: (data) => inMemoryDB.insertOne('products', data),
    find: (query, options) => inMemoryDB.find('products', query, options),
    findOne: (query) => inMemoryDB.findOne('products', query),
    findById: (id) => inMemoryDB.findById('products', id),
    updateOne: (id, update) => inMemoryDB.updateOne('products', id, update),
    deleteOne: (id) => inMemoryDB.deleteOne('products', id),
    countDocuments: (query) => inMemoryDB.countDocuments('products', query),
  },
  
  // Order model functions
  Order: {
    create: (data) => inMemoryDB.insertOne('orders', data),
    find: (query, options) => inMemoryDB.find('orders', query, options),
    findOne: (query) => inMemoryDB.findOne('orders', query),
    findById: (id) => inMemoryDB.findById('orders', id),
    updateOne: (id, update) => inMemoryDB.updateOne('orders', id, update),
    deleteOne: (id) => inMemoryDB.deleteOne('orders', id),
    countDocuments: (query) => inMemoryDB.countDocuments('orders', query),
  },
  
  // Connection simulation
  connect: async () => {
    console.log('✅ In-Memory DB connected');
    return true;
  }
};

// Initialize Express app
const app = express();
let PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from any origin for development, including file:// (origin === undefined/null)
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost',
      'http://127.0.0.1'
    ].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    // Fallback: allow all for development
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

// Serve static files - serve from root directory since all files are in workspace root
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to handle extensionless routes (e.g., /products -> products.html)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  
  // If the path doesn't have an extension
  if (!path.extname(req.path)) {
    const htmlPath = path.join(__dirname, req.path + '.html');
    const fs = require('fs');
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  next();
});

// API Routes - commented out as route files don't exist
// app.use('/api/auth', authRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/consult', consultationRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/users', userRoutes);

// Admin authentication endpoint
app.post('/api/auth/admin/login', authLimiter, (req, res) => {
  const { password } = req.body;
  
  // Simple admin password check (in production, use environment variable)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
  
  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(Date.now().toString()).toString('base64');
    res.json({
      success: true,
      message: 'Admin login successful',
      token: token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid admin password'
    });
  }
});

app.get('/api/auth/admin/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  try {
    // Decode and verify token (simple base64 decode for now)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const timestamp = parseInt(decoded, 10);
    
    // Check if token is valid (created within last 24 hours)
    const now = Date.now();
    const hoursSinceLogin = (now - timestamp) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.json({
      success: true,
      message: 'Token valid',
      isAdmin: true
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Orders API endpoints
app.get('/api/orders', (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }
    
    const orders = simpleDB.Order.find(query);
    
    // Sort by createdAt descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = simpleDB.Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const { status, ...updateData } = req.body;
    
    const updatedOrder = simpleDB.Order.updateOne(req.params.id, updateData);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = simpleDB.Order.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aditya Medical API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/ai-recommendations', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-recommendations.html'));
});



app.get('/prescription-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'prescription-upload.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Authentication pages
app.get('/client-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-login.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// Client pages
app.get('/client-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-dashboard.html'));
});

// Admin pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin-products', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-products.html'));
});

app.get('/admin-orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-orders.html'));
});

app.get('/admin-prescriptions', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-prescriptions.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 404 handler for other routes
app.use('*', (req, res) => {
  const notFoundPath = path.join(__dirname, '404.html');
  const fs = require('fs');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).send('<h1>404 – Page Not Found</h1><p><a href="/">Go Home</a></p>');
  }
});

// Database connection
const connectDB = async () => {
  try {
    // Use simple in-memory database instead of MongoDB
    await simpleDB.connect();
    console.log('✅ SimpleDB Connected Successfully (in-memory)');
    return true;
  } catch (error) {
    console.error('❌ SimpleDB connection error:', error.message);
    console.log('📄 Running without database - using mock data');
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    // Seed sample orders if database is connected
    if (dbConnected && inMemoryDB.orders.length === 0) {
      console.log('📦 Seeding sample orders...');
      
      // Sample Order 1 - Pending
      inMemoryDB.insertOne('orders', {
        orderId: 'ORD-001',
        customerId: 'user_1',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 9876543210',
        phone: '+91 9876543210',
        status: 'pending',
        medicinesText: 'Dolo 650 (10 tabs), Vitamin D3 (60 caps)',
        items: [
          {
            medicineId: 'med_1',
            medicineName: 'Dolo 650',
            quantity: 1,
            mrp: 50,
            sellingPrice: 45
          },
          {
            medicineId: 'med_2',
            medicineName: 'Vitamin D3',
            quantity: 1,
            mrp: 300,
            sellingPrice: 280
          }
        ],
        orderSummary: {
          totalAmount: 325,
          itemsCount: 2
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        updatedAt: new Date().toISOString()
      });
      
      // Sample Order 2 - Accepted
      inMemoryDB.insertOne('orders', {
        orderId: 'ORD-002',
        customerId: 'user_2',
        customerName: 'Priya Sharma',
        customerPhone: '+91 9123456789',
        phone: '+91 9123456789',
        status: 'accepted',
        medicinesText: 'Azithromycin 500mg (5 tabs), Paracetamol (20 tabs)',
        items: [
          {
            medicineId: 'med_3',
            medicineName: 'Azithromycin 500mg',
            quantity: 1,
            mrp: 120,
            sellingPrice: 110
          },
          {
            medicineId: 'med_4',
            medicineName: 'Paracetamol',
            quantity: 1,
            mrp: 30,
            sellingPrice: 25
          }
        ],
        orderSummary: {
          totalAmount: 135,
          itemsCount: 2
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date().toISOString()
      });
      
      // Sample Order 3 - Delivered
      inMemoryDB.insertOne('orders', {
        orderId: 'ORD-003',
        customerId: 'user_3',
        customerName: 'Amit Patel',
        customerPhone: '+91 9988776655',
        phone: '+91 9988776655',
        status: 'delivered',
        medicinesText: 'Calcium + Vitamin D3 (30 tabs), Multivitamin (60 caps)',
        items: [
          {
            medicineId: 'med_5',
            medicineName: 'Calcium + Vitamin D3',
            quantity: 2,
            mrp: 200,
            sellingPrice: 180
          },
          {
            medicineId: 'med_6',
            medicineName: 'Multivitamin',
            quantity: 1,
            mrp: 450,
            sellingPrice: 400
          }
        ],
        orderSummary: {
          totalAmount: 760,
          itemsCount: 3
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Seeded ${inMemoryDB.orders.length} sample orders`);
    }

    // SimpleDB doesn't need seeding like MongoDB
    if (dbConnected) {
      console.log('✅ SimpleDB is ready for use');
    } else {
      console.log('📄 Running without database - using mock data');
    }
    
    app.listen(PORT, () => {
      console.log('🚀 =================================');
      console.log(`🏥 Aditya Medical Server Running`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`⚕️  API: http://localhost:${PORT}/api`);
      console.log(`🤖 Jarvis AI: Ready for consultations`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 =================================');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;