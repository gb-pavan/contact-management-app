const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const {userSchema} = require('../validators/userValidator');
const sendMail = require('../utils/emailService');
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
 

const SECRET_KEY = "your_secret_key";

// Register a new user
exports.register = async (req, res) => {
    const { email, password } = req.body;    

    // Validate user input
    const { error } = userSchema.validate({ email, password });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    console.log('after validate')
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.createUser(email, hashedPassword, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else{
            console.log("JWT_SECRET:", process.env.JWT_SECRET);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            console.log("token",token);
            // Send verification email
            const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;
            await sendMail.sendVerificationEmail(email, email, verificationUrl);
            res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
        }
    });

    
};

// Login a user and generate a token
exports.login = (req, res) => {
    const { email, password } = req.body;

    user.getUserByEmail(email, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log("user details",user);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id,email:email }, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    });
};

exports.verifyEmail = async (req,res) => {
    const { token } = req.query;
    console.log("received token",token);
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded.email);
    const userRow = user.findUserByEmail(decoded.email);
    if (userRow){
        userRow.isVerified = true;
        return res.send(`isVerified: ${userRow.isVerified}`)
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).send('Invalid or expired token.');
  }

}

exports.sendOTP = async (req,res) => {
    const { email } = req.body;

  try {
    await user.getUserByEmail(email,async (err, userRow) => {
        if (err) {
            return res.status(401).json({ error: err });
        }
        if (!userRow) {
          return res.status(404).send('User not found.');
        }

            // Generate a one-time code (OTP)
        const otp = crypto.randomInt(100000, 999999); // Generates a 6-digit OTP
        const expiresAt = Date.now() + 3600000; // Set expiration time (1 hour)

        // Store OTP and expiration time in the database
        await user.saveOtpToDatabase(email, otp, expiresAt); // Implement this function

        // Send the OTP to the user's email
        await sendMail.sendVerificationEmail(email,email, `Your password reset code is: ${otp}`);

        res.status(200).send('Password reset code sent to your email.');
      }); // Assuming this function is implemented

    

    
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).send('Internal server error.');
  }
}

exports.resetPassword = async (req,res) => {
    const { email, otp, newPassword } = req.body;

    console.log("receive otp",otp,typeof(otp));

  try {
    // Retrieve OTP and expiration time from the database
    const otpData = await user.getOtpFromDatabase(email); // Implement this function

    if (!otpData) {
      return res.status(400).send('No OTP found for this email.');
    }

    console.log("optData", typeof(otpData.otp));

    // Verify the OTP
    if (Number(otpData.otp) !== otp) {
      return res.status(400).send('Invalid OTP.');
    }

    // Check if OTP is expired
    if (Date.now() > otpData.otp_expires_at) {
      return res.status(400).send('OTP has expired.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.updateUserPassword(email, hashedPassword); // Implement this function

    // Optionally, delete the OTP from the database
    await user.deleteOtpFromDatabase(email); // Implement this function

    res.status(200).send('Password has been reset successfully.');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal server error.');
  }
}

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};
