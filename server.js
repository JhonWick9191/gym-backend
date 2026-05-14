const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

// ==========================
// DATABASE CONNECTION
// ==========================
connectDB();

// ==========================
// CRON JOB
// ==========================
const initCronJob = require('./utils/cronJob');
initCronJob();

// ==========================
// EXPRESS APP
// ==========================
const app = express();

// ==========================
// CORS CONFIGURATION
// ==========================
app.use(cors({
    origin: [
        'https://cult.fitness',
        'https://www.cult.fitness',
        
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================
// ROUTES
// ==========================
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', userRoutes);

// ==========================
// HEALTH CHECK
// ==========================
app.get('/', (req, res) => {
    res.send('Gym Management Backend is Running...');
});

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
    });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});