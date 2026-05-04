const express = require('express');
const router = express.Router();
const { createUser, getExpiredUsers, getUsersExpiringThisMonth, notifyExpiredUsers, testEmail, updateUserFee, getAllUsers, editUser, deleteUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Define route for adding a user
// POST /api/users/create-user
router.post('/users/create-user', protect, createUser);
router.get('/users/expired', protect, getExpiredUsers);
router.get('/users/expiring-this-month', protect, getUsersExpiringThisMonth);
router.post('/users/notify-expired', protect, notifyExpiredUsers);
router.post('/users/test-email', protect, testEmail);
router.put('/users/update-fee/:id', protect, updateUserFee);

// New Routes
router.get('/users/search', protect, searchUsers);
router.get('/users', protect, getAllUsers);
router.put('/users/:id', protect, editUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
