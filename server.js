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



// ✅ CORS (FIXED)
app.use(cors({
    origin: ['https://cult.fitness', 'https://www.cult.fitness'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));



// Middleware to parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Gym Management Backend is Running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});