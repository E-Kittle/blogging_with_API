const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Import environmental variables - For jwt secret
require('dotenv').config();


exports.loginAdmin = function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('in auth')
        // console.log(user);
        if (err || !user) {
            // console.log(user)
            return res.status(400).json({
                message: "Something is not right",
                user: user
            });
        }
        else {
            // req.login(user, { session: false }, (err) => {
            //     if (err) {
            //         res.send(err);
            //     }
                
                // Everything worked. Create a json web token with the contents of the user object
                // and return it in the response
                const token = jwt.sign(user, process.env.SECRET);
                
                console.log('logged in');
                
                return res.json({ user, token });
            }
        
    })(req, res);
};

exports.logoutAdmin = function (req, res, next) {
    res.end('Route would logout admin');
    // Needs to destroy? the token
};

exports.createAdmin = function (req, res, next) {
    res.end('Route would create a new admin')
};