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

// ✅ Allowed Origins
const allowedOrigins = [
    'https://cult.fitness',
    'https://www.cult.fitness',
    'https://api.cult.fitness',
    'http://localhost:3000',
    'http://localhost:5173'
];

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

// ❌ IMPORTANT: DO NOT use app.options(cors()) anymore
// (remove this completely)

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', userRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Gym Management Backend is Running...');
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});