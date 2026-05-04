const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// @desc    Register a new admin
// @route   POST /api/v1/admin/register
// @access  Public
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // 2. Create the admin (Password will be hashed by schema middleware)
        const admin = await Admin.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Login admin & get token
// @route   POST /api/v1/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // 2. Check for admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 3. Check if password matches
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 4. Create JWT Token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // 5. Send Token in Cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript from accessing the cookie
            secure: false,  // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    createAdmin,
    loginAdmin
};
