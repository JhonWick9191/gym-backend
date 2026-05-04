const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin } = require('../controllers/adminController');

// Admin registration route
router.post('/register', createAdmin);

// Admin login route
router.post('/login', loginAdmin);

module.exports = router;
