const express = require('express');
const authController = require('../controllers/authController');
const authLimiter = require('../middlewares/authLimiter');
const router = express.Router();

// Register a new user
router.post('/register', authLimiter, authController.register);

// Login a user and generate a JWT token
router.post('/login',authLimiter, authController.login);

router.get('/verify-email',authController.verifyEmail);
router.post('/forgot-password',authController.sendOTP);
router.post('/reset-password',authController.resetPassword);

module.exports = router;
