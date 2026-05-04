const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Middleware to protect routes and verify the JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Get token from cookies
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach admin data to the request object (excluding password)
        req.admin = await Admin.findById(decoded.id).select('-password');

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found, authorization failed'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};

module.exports = { protect };
