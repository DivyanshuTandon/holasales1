const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                
                return /^[a-zA-Z0-9\s]+$/.test(value); 
            },
            message: 'Name should only contain letters, numbers, and spaces',
        },
    },
     email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value); 
            },
            message: 'Please enter a valid email address',
        },
    },
    phone: {
        type: Number,
        default: -1, 
        required: false, 
        unique: true,
        validate: {
            validator: function (value) {
                if (value === -1) {
                    return true; 
                }
                return /^\d{10}$/.test(value);
            },
            message: 'Please enter a valid 10-digit phone number or leave it as -1',
        },
    },
     password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 6; 
            },
            message: 'Password should be at least 6 characters long',
        },
    },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
