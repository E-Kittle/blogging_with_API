const Post = require('../models/post');
const { body, validationResult } = require('express-validator');


// Function to get the published posts
exports.posts_get = function (req, res, next) {
    // Grabs only published posts from the database
    Post.find({published: true})
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
}

// This function grabs all of the posts (published and not published)
// From the db - Admin only
exports.posts_get_protected = function (req, res, next) {
    // Grabs all posts from the database
    Post.find()
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
}

// Function to create a new post - Admin only
exports.posts_create = [

    // Validate and sanitize the data
    body('title', 'Title is required').isLength({ min: 1 }).escape().trim(),
    body('content', 'Content is required').isLength({ min: 1 }).escape().trim(),
    body('published').toBoolean(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        }

        // There were no errors so create the new post and save it to the database
        else {
            let today = new Date();
            let date = today.toDateString();

            const post = new Post(
                {
                    title: req.body.title,
                    content: req.body.content,
                    date: date,
                    published: req.body.published
                }
            ).save((err, result) => {
                if (err) { return next(err); }
                res.status(200).json(result);
            })
        }
    }
]

// Returns the data for a specific post
exports.posts_get_post = function (req, res, next) {

    // First, check if the post exists
    Post.findById(req.params.postid, function (err, post) {
        if (post === undefined) {
            res.status(404).json({ message: 'No such post exists' })
        }
        else if (err) { return next(err); }

        // Return the post to the user
        else {
            res.status(200).json(post)
        }
    })
}


// Function to edit a post
exports.posts_edit_post = [

    // Validate and sanitize the fields
    body('title', 'Title is required').isLength({ min: 1 }).escape().trim(),
    body('content', 'Content is required').isLength({ min: 1 }).escape().trim(),
    body('published').toBoolean(),

    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Ensure the original post exists
        Post.findById(req.params.postid, function (err, post) {

            if (post === undefined) {       //If no such post, return a 404 error
                res.status(404).json({ message: 'No post found' })
            }
            // Forward error from findById to next middleware
            else if (err) { return next(err); }

            // Called if the post exists and no errors were found by findById
            else {
                // If there were errors during validation, reject the submission and return the errors
                if (!errors.isEmpty()) {
                    const post = {
                        title: req.body.title,
                        content: req.body.content,
                        published: published
                    }
                    res.status(400).json({ errArr: errors.array(), post: post })
                }

                // There were no errors so update the post
                else {

                    let newPost = {
                        title: req.body.title,
                        content: req.body.content,
                        date: post.date,
                        published: req.body.published,
                        _id: req.params.postid
                    };

                    Post.findByIdAndUpdate(req.params.postid, newPost, {}, function (err) {
                        if (err) { return next(err); }
                        else {
                            res.status(200).json(newPost);
                        }
                    })
                }
            }
        })
    },
]

// Function delete a post
exports.posts_delete_post = function (req, res, next) {

    // Checks if the post id from the url parameter exists
    Post.findById(req.params.postid, function (err, post) {
        if (post === undefined) {
            res.status(404).json({ message: 'No such post exists' })
        }
        else if (err) { return next(err); }

        // post exists and no errors, so delete the post
        else {
            Post.findByIdAndDelete(req.params.postid, function deletePost(err) {
                if (err) { return next(err); }
                else {
                    res.status(200).json({ message: `Post deleted` })
                }
            })
        }
    })
}