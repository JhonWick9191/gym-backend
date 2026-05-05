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
// ✅ ALLOWED ORIGINS
// ==========================
const allowedOrigins = [
    'https://cult.fitness',
    'https://www.cult.fitness',
    'http://localhost:3000',
    'http://localhost:5173'
];

// ==========================
// ✅ CORS CONFIG (FIXED)
// ==========================
app.use(cors({
    origin: function (origin, callback) {
        // allow server-to-server / postman requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // ❌ DO NOT THROW ERROR (important)
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight explicitly
app.options(/.*/, cors());

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
    console.error(err.message);

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