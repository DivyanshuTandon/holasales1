const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
  country: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
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
  mobilenumber: {
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
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
