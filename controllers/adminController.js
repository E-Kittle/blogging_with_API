const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');

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
                        // Should we create a custom user? This is returning the password too
                        const token = jwt.sign({ user }, secret, opts);
                        return res.status(200).json({
                            message: 'Authentication Passed',
                            token
                        })
                    }
                    else {
                        return res.status(400).json({ message: 'Incorrect email or password.' });
                    }
                })
            }
        })
};

// We could also add a create_admin method; however, in the context of this blog
// it seems appropriate to keep it limited to one admin/user