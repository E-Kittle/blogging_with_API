const Admin = require('../controllers/admin');

exports.loginAdmin = function(req, res, next) {
    res.end('Route would login admin')
    // Needs to create a token
};

exports.logoutAdmin = function(req, res, next) {
    res.end('Route would logout admin');
    // Needs to destroy? the token
};

exports.createAdmin = function(req, res, next) {
    res.end('Route would create a new admin')
};