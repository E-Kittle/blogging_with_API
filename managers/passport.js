const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('../models/user');

// Require the dotenv file for the secret
require('dotenv').config();

// Set the options object for the JwtStrategy
let opts = {}
opts.secretOrKey =  process.env.SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// Create the new JwtStrategy to check if the user has an active token for the db
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, returnedUser) {

        const user = {
            id: returnedUser._id,
            username: returnedUser.username,
            email: returnedUser.email,
            admin: returnedUser.admin
        }

        // If there is an error, return the error
        if (err) {
            return done(err, false);
        }
        // If token passed authentication, let the routeController handle it
        if (user) {
            return done(null, user);
        }
            // User failed authentication, return a 401: unauthorized status
        else {
            return done(null, false);
        }
    });
}));



