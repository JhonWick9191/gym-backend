const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Cron Jobs
const initCronJob = require('./utils/cronJob');
initCronJob();

const app = express();

// ✅ TRUST PROXY (IMPORTANT for cookies behind Nginx/Cloudflare)
app.set("trust proxy", 1);



// ✅ CORS Configuration
const allowedOrigins = [
    'https://cult.fitness',
    'https://www.cult.fitness',
    'https://api.cult.fitness',
    'http://localhost:3000',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// Middleware to parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Routes (Admin first for specificity)
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', userRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Gym Management Backend is Running...');
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});