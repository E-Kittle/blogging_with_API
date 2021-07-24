const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Import environmental variables - For jwt secret
require('dotenv').config();


exports.loginAdmin = function (req, res, next) {
    let { username, password } = req.body;

    // Query database to see if user exists
    Admin.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Incorrect email or password.' });
            }
            else {
                //User exists. Check if their password matches
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // Authentication passed. Create the token and return
                        // it to the client
                        const opts = {};
                        opts.expiresIn = 60 * 60;
                        const secret = process.env.SECRET;
                        const token = jwt.sign({ user }, secret, opts);
                        return res.status(200).json({
                            message: 'Authentication Successful',
                            token
                        })
                    }
                    else {
                        // Password check failed - return error
                        return res.status(400).json({ message: 'Incorrect email or password.' });
                    }
                })
            }
        })
};

// Method to create a new admin
exports.admin_create = [
    // Validate and sanitize data
    body('username', 'Username is required').escape().trim().isLength({ min: 3 }).withMessage('Min length is 3 characters'),
    body('password', 'Password is required').isLength({ min: 8 }).escape().trim().withMessage('Minimum password length is 8 characters'),

    (req, res, next) => {
        // Extract errors from validation
        const errors = validationResult(req);

        // If there are errors, handle them
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() });
        }
        // There are no errors, save the admin
        else {
            // Hash the password
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                let userDetail = {
                    username: req.body.username,
                    password: hashedPassword
                };
        
                let user = new Admin(userDetail);
                user.save((err, result) => {
                    if (err) { return next(err); }
                    res.status(200).json({'Message': 'Admin Created'})
                });
            });
        }
    }
]
