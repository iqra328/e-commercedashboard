const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration - Sabhi allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://e-commercedashboard-1fz7.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://localhost:4174',  // 👈 YEH ADD KARO
  'https://e-commercedashboard-1fz7.vercel.app'
];


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    });
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Debug middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// ✅ Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    cors: 'enabled',
    allowed_origins: allowedOrigins,
    origin_received: req.headers.origin || 'No origin',
    mongodb_status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 CORS enabled for:`, allowedOrigins);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});