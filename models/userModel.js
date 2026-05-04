const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    monthlyFee: {
        type: Number,
        required: [true, 'Please add a monthly fee'],
        min: [1, 'Monthly fee must be greater than 0']
    },
    fromMonth: {
        type: Date,
        required: [true, 'Please add a starting month']
    },
    toMonth: {
        type: Date,
        required: [true, 'Please add an ending month']
    },
    admissionDate: {
        type: Date,
        required: [true, 'Please add an admission date']
    },
    totalFee: {
        type: Number
    },
    isNotified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('User', userSchema);
