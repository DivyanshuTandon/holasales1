const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

router.post('/signup', [
    check('name').notEmpty().withMessage('Name is required').isLength({ min: 1 }).withMessage('Name should not be empty'),
    check('email').isEmail().withMessage('Please enter a valid email address')
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }),
    check('phone').optional().isNumeric().withMessage('Phone number should contain only numbers')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number should be exactly 10 digits')
        .custom(async (value) => {
            if (value) {
                const existingUser = await User.findOne({ phone: value });
                if (existingUser) {
                    throw new Error('Phone number already in use');
                }
            }
        }),
    check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        });

        const result = await user.save();

        console.log(result);
        res.status(201).json({ new_User: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', [
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'User does not exist',
            });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Incorrect password',
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            success: true,
            msg: 'Login Successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
