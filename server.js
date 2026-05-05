const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const initCronJob = require('./utils/cronJob');
initCronJob();

const app = express();

app.set("trust proxy", 1);

// ==========================
// ✅ ROBUST CORS CONFIGURATION (Production Ready)
// ==========================
const allowedOrigins = [
    'https://cult.fitness',
    'https://www.cult.fitness',
    'http://localhost:3000',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Reflect origin back
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, false); // Block other origins
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With", 
        "Accept", 
        "Origin"
    ],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// 1. Enable pre-flight for all routes
app.options('*', cors(corsOptions));

// 2. Apply CORS middleware
app.use(cors(corsOptions));

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
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
// ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});