const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ✅ Sirf routes - CORS server.js mein handle ho raha hai
router.post('/register', register);
router.post('/login', login);

module.exports = router;
