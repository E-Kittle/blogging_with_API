const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const Admin = require('../models/admin');

require('dotenv').config();

let opts = {}
opts.secretOrKey =  process.env.SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    Admin.findOne({id: jwt_payload.sub}, function(err, user) {

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



