// server.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes')
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();


app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/auth',authRoutes);
app.use('/auth/forgot',authRoutes);
app.use('/auth/reset',authRoutes);
app.use('/contacts',contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
