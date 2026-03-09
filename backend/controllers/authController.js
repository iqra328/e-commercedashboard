const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('❌ User already exists:', username);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    
    // Create new user
    const user = new User({ username, password });
    await user.save();
    console.log('✅ User created:', user._id);
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send success response
    const response = {
      success: true,
      token,
      username: user.username,
      message: 'Registration successful'
    };
    
    console.log('✅ Sending response:', response);
    res.status(201).json(response);
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    console.log('🔑 Login request received:', req.body);
    
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    console.log('✅ Password matched for user:', username);
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send success response
    const response = {
      success: true,
      token,
      username: user.username,
      message: 'Login successful'
    };
    
    console.log('✅ Sending response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message 
    });
  }
};

module.exports = { register, login };