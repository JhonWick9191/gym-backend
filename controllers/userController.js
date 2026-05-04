const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Add new user (student)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        let { name, email, monthlyFee, fromMonth, toMonth, admissionDate } = req.body;

        // 1. Basic Validation for required fields
        if (!name || !email || !monthlyFee || !fromMonth || !toMonth) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, monthlyFee, fromMonth, toMonth'
            });
        }

        // 2. Validate Monthly Fee
        if (monthlyFee <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Monthly fee must be greater than 0'
            });
        }

        // Convert strings to Date objects and normalize to start of day
        const start = new Date(fromMonth);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(toMonth);
        end.setHours(0, 0, 0, 0);

        // 3. Validate Date range: toMonth should not be earlier than fromMonth
        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'End month (toMonth) cannot be earlier than start month (fromMonth)'
            });
        }

        // 4. Automatically set admissionDate to first day of fromMonth if not provided
        if (!admissionDate) {
            admissionDate = new Date(start.getFullYear(), start.getMonth(), 1);
        } else {
            admissionDate = new Date(admissionDate);
        }
        admissionDate.setHours(0, 0, 0, 0);

        // 5. Calculate totalFee
        // Logic: (Diff in years * 12) + (Diff in months) + 1 (to include the starting month)
        const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        const totalFee = monthlyFee * totalMonths;

        // 6. Create the User in database
        const user = await User.create({
            name,
            email,
            monthlyFee,
            fromMonth: start,
            toMonth: end,
            admissionDate,
            totalFee,
            isNotified: false // Ensure notification flag is false for new/renewed periods
        });

        // 7. Return success response
        res.status(201).json({
            success: true,
            message: 'User added successfully',
            data: user
        });

    } catch (error) {
        // Handle unique email error or other mongoose validations
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all users whose fee has expired (toMonth < today)
// @route   GET /api/users/expired
// @access  Public
const getExpiredUsers = async (req, res) => {
    try {
        // Get current date and set it to the start of the day for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch users where toMonth is less than today
        const expiredUsers = await User.find({
            toMonth: { $lt: today }
        }).sort({ toMonth: 1 }); // Sort by oldest toMonth first

        res.status(200).json({
            success: true,
            count: expiredUsers.length,
            data: expiredUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get users whose fee is expiring in the current month
// @route   GET /api/users/expiring-this-month
// @access  Public
const getUsersExpiringThisMonth = async (req, res) => {
    try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Calculate the first and last day of the current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        // Fetch users whose toMonth falls within the current month
        const expiringUsers = await User.find({
            toMonth: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).sort({ toMonth: 1 });

        res.status(200).json({
            success: true,
            count: expiringUsers.length,
            data: expiringUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Manually trigger email notifications for expired users
// @route   POST /api/v1/users/notify-expired
// @access  Public
const notifyExpiredUsers = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find users where toMonth is less than today and haven't been notified yet
        const expiredUsers = await User.find({
            toMonth: { $lt: today },
            isNotified: false
        });

        if (expiredUsers.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No new expired users to notify'
            });
        }

        let sentCount = 0;
        for (const user of expiredUsers) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Fee Expired Notification',
                    text: `Hello ${user.name},\n\nYour subscription fee has expired on ${user.toMonth.toDateString()}.\nPlease renew your subscription to continue services.\n\nThank you.`
                });
                
                user.isNotified = true;
                await user.save();
                sentCount++;
            } catch (err) {
                console.error(`Failed to email ${user.email}:`, err.message);
            }
        }

        res.status(200).json({
            success: true,
            message: `Successfully notified ${sentCount} users`,
            count: sentCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Test email functionality
// @route   POST /api/v1/users/test-email
// @access  Public
const testEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address to send the test to'
            });
        }

        // Call the sendEmail utility
        await sendEmail({
            to: email,
            subject: 'Test Email from Backend',
            text: 'Hello,\n\nThis is a test email to verify that the email service is working correctly.\n\nThank you.'
        });

        res.status(200).json({
            success: true,
            message: `Test email sent successfully to ${email}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send test email. Please check your .env configuration.',
            error: error.message
        });
    }
};

// @desc    Update user fee duration (Renew subscription)
// @route   PUT /api/v1/users/update-fee/:id
// @access  Public (Admin recommended)
const updateUserFee = async (req, res) => {
    try {
        const { newToMonth } = req.body;
        const userId = req.params.id;

        // 1. Basic Validation
        if (!newToMonth) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new ending month (newToMonth)'
            });
        }

        // 2. Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // 3. Update the fields
        const end = new Date(newToMonth);
        end.setHours(0, 0, 0, 0);
        
        const start = new Date(user.fromMonth);
        start.setHours(0, 0, 0, 0);

        // Optional: Ensure the new date is later than the previous one
        if (end <= new Date(user.toMonth)) {
            return res.status(400).json({
                success: false,
                message: 'The new ending date must be later than the current ending date'
            });
        }

        user.toMonth = end;
        
        // 4. Recalculate Total Fee (Monthly Fee * Number of Months)
        const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        user.totalFee = user.monthlyFee * totalMonths;

        // 5. Reset Notification Flag
        // This is CRITICAL so the user can be notified again when this new period expires
        user.isNotified = false;

        // 6. Save changes
        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'User fee updated and subscription extended',
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all students
// @route   GET /api/v1/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Edit student details (Email and Expiry Date)
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
const editUser = async (req, res) => {
    try {
        const { email, toMonth } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (email) user.email = email;
        
        if (toMonth) {
            const end = new Date(toMonth);
            end.setHours(0, 0, 0, 0);
            
            const start = new Date(user.fromMonth);
            
            // Recalculate Total Fee based on new expiry date
            const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
            user.totalFee = user.monthlyFee * totalMonths;
            user.toMonth = end;
            
            // Reset notification flag since the period has changed
            user.isNotified = false;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete student
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Search students by name or email
// @route   GET /api/v1/users/search
// @access  Private (Admin)
const searchUsers = async (req, res) => {
    try {
        const { name, email, query: searchTerm } = req.query;
        let query = {};

        // If a general search term is provided, check both name and email
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        } else {
            // Apply specific filters if provided
            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }
            if (email) {
                query.email = { $regex: email, $options: 'i' };
            }
        }

        const users = await User.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
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
    createUser,
    getExpiredUsers,
    getUsersExpiringThisMonth,
    notifyExpiredUsers,
    testEmail,
    updateUserFee,
    getAllUsers,
    editUser,
    deleteUser,
    searchUsers
};
