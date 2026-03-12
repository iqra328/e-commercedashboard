const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',   // ✅ FIX (your frontend)
  'http://localhost:5175',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://localhost:4175',
  'https://e-commercedashboard-1fz7.vercel.app',
  'https://stately-nougat-47382c.netlify.app' 
];

// ✅ CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {

    // allow requests with no origin (mobile apps / postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// ✅ Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: "Server working",
    origin: req.headers.origin
  });
});

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ 404
app.use((req,res)=>{
  res.status(404).json({message:"Route not found"});
});

// ✅ Error handler
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message:err.message});
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Allowed origins:", allowedOrigins);
});
