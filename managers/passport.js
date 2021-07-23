const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Admin = require('../models/admin');

require('dotenv').config();

passport.use(
    new LocalStrategy((username, password, cb) => {
        console.log('triggered');
        // console.log(`username: ${username}, password: ${password}`)
        Admin.findOne({ username, password })
            .then(user => {
                if (!user) {
                    return cb(null, false, { message: 'Incorrect email or password.' });
                }
                else{
                    return cb(null, user, { message: 'Logged In Successfully' });
                }
            })
            .catch(err => cb(err));
    }
    ));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
},
function(jwtPayload, cb) {
        return User.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        })
    }
))