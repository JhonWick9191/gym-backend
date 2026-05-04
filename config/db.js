const mongoose = require('mongoose');
require('dotenv').config();

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Connect using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error and exit the process if connection fails
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
