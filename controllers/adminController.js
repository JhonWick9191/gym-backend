const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
require("dotenv").config()
// @desc    Register a new admin
// @route   POST /api/v1/admin/register
// @access  Public
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(404).json({
                success: false,
                message: "Please fill all input feilds"
            })
        }

        // 1. Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // bcrypt the password and save it in db 
        const hashpassword = await bcrypt.hash(password, 10)

        console.log(hashpassword)


        // create jwt 




        // 2. Create the admin (Password will be hashed by schema middleware)
        const admin = await Admin.create({
            name,
            email,
            password: hashpassword,
            role: "Admin"
        });

        const payload = ({
            name: admin.name,
            email: admin.email,
            role: admin.role
        })

        const option = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
                secure: true,
                sameSite: "None"
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "5h"
        })

        res.cookie("token", token, option).status(200).json({
            success: true,
            token,
            message: "Admin Register Sucessfully",
            data: admin
        })


    } catch (error) {
        console.log(error)
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
        console.log(admin.password)

        const isMatch = await bcrypt.compare(password, admin.password)
        console.log(password)
        console.log("this prints ", isMatch)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        } else {
            // create payload 
            const payloade = {
                email: admin.email,
                id: admin._id,
                role: admin.role
            }

            const token = jwt.sign(payloade, process.env.JWT_SECRET, {
                expiresIn: "5h"
            })


            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "None"
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                admin,
                message: "Login Sucessfully",

            })
        }


    } catch (error) {
        console.log(error)
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
