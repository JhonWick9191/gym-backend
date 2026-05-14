const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define Admin Schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    email: {
        type: String,
        
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role:{
   type:String,
   enum:["Admin"]
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Admin', adminSchema);
