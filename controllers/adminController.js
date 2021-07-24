const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Import environmental variables - For jwt secret
require('dotenv').config();


exports.loginAdmin = function (req, res, next) {
    let { username, password } = req.body;

    // Query database to see if user exists
    Admin.findOne({ username, password })
    .then(user => {
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password.' });
        }
        else{
            // Authentication passed. Create the token and return
            // it to the client
            const opts = {};
            opts.expiresIn = 60*60;
            const secret = process.env.SECRET;
                // Should we create a custom user? This is returning the password too
            const token = jwt.sign({user}, secret, opts);
            return res.status(200).json({
                message: 'Authentication Passed',
                token
            })
        }
    })
};

exports.logoutAdmin = function (req, res, next) {
    res.end('Route would logout admin');
    // Needs to destroy? the token
};

exports.createAdmin = function (req, res, next) {
    res.end('Route would create a new admin')
};