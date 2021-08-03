const User = require('../models/user');
const Comment = require('../models/comment');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Import environmental variables - For jwt secret
require('dotenv').config();

exports.authorizeUser = function (req, res, next) {
    return res.status(200).json({ user: req.user });
}



exports.loginUser = function (req, res, next) {
    let { username, password } = req.body;

    // Query database to see if user exists
    User.findOne({ username })
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

                        // User data to send back to the frontend
                        const newUser = {
                            username: user.username,
                            email: user.email,
                            admin: user.admin
                        }

                        return res.status(200).json({
                            message: 'Authentication Successful',
                            token,
                            user: newUser
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

// Method to create a new user
exports.user_create = [
    // Validate and sanitize data
    body('username', 'Username is required').escape().trim().isLength({ min: 3 }).withMessage('Min length is 3 characters'),
    body('password', 'Password is required').isLength({ min: 8 }).escape().trim().withMessage('Minimum password length is 8 characters'),
    body('email', 'Email is required').escape().trim().isLength({ min: 3 }).withMessage('Min length is 3 characters'),

    (req, res, next) => {
        // Extract errors from validation
        const errors = validationResult(req);

        // If there are errors, handle them
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() });
        }
        // There are no errors, save the user
        else {
            if (req.body.admin === undefined) {
                res.status(400).json({ message: 'Admin status required' })
            }
            else {
                // Hash the password
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    let userDetail = {
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        admin: req.body.admin
                    };

                    let user = new User(userDetail);
                    user.save((err, result) => {
                        if (err === null) {
                            res.status(200).json({ 'Message': 'user Created' })
                        }
                        else if (err.keyValue.username) {
                            res.status(400).json({ message: "User already exists" })
                        } else if (err) { return next(err); }
                    });
                });
            }
        }
    }
]

exports.get_profile = function (req, res, next) {
    //Check if the client wants all posts/comments or just published

    async.parallel({
        user: function (callback) {
            User.findById(req.params.id, callback)
        },
        comments: function (callback) {
            Comment.find({ author: req.params.id }, '_id comment date post').populate('post', 'title published').exec(callback)
        }
    }, function (err, results) {
        if (results.user === undefined || results.user === null) {
            // No user found with that id
            res.status(400).json({ user: null, message: 'No user with provided id exists' })
        } else {

            if (err) { return next(err); }
            let user = {
                id: results.user._id,
                username: results.user.username,
                email: results.user.email,
                admin: results.user.admin
            }

            if (results.user.admin) {
                Post.find({ author: req.params.id, published: true })
                    .populate('category', 'name')
                    .exec((err, posts) => {
                        if (err) { return next(err) }

                        let filteredComments = results.comments.filter(comment => {
                            return comment.post.published;
                        })
                        let result = { comments: filteredComments, user: user, posts: posts }
                        res.status(200).json(result)
                    })

            }
            else {
                let result = { comments: results.comments, user: user }
                res.status(200).json(result);
            }

        }
    }
    )

};

exports.get_user_posts = function (req, res, next) {
    Post.find({ author: req.params.id })
    .populate('category', 'name')
        .exec((err, posts) => {
            if (posts===undefined) {
                res.status(400).json('User not found')
            }
            else if (err) { return next(err) }
            res.status(200).json(posts)
        })
}