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

// Middleware to parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

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
