const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const async = require('async');
const { body, validationResult } = require('express-validator');


// Function to get the published posts
exports.get_posts = function (req, res, next) {

    // Grabs only published posts from the database
    Post.find({ published: true }).populate('category', 'name').populate('author', 'username')
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })


    /* - Temporarily keeping
    This will grab all the posts, not just published posts from the db
    if (req.query.allposts === 'false') {
        Post.find({published: true})
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
    } else {
        Post.find({})
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
    }
    */
}

// Grabs all published posts for a specific category
exports.get_posts_by_cat = function (req, res, next) {
    Post.find({ published: true, category: req.params.id }).populate('category', 'name')
        .exec(function (err, post_list) {
            if (post_list === undefined) {
                res.status(400).json({ message: 'Category not found' })
            }
            else if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
}

// Grabs all published posts for a specific subcategory
exports.get_posts_by_subcat = function (req, res, next) {
    Post.find({ published: true, subcategory: req.params.subcatid }).populate('category', 'name')
        .exec(function (err, post_list) {
            if (post_list.length === 0) {
                res.status(400).json({ message: 'Subcategory not found' })
            }
            else if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
}


// Function to create a new post - user only
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
            async.parallel({
                author: function (callback) {
                    User.findById(req.body.author, callback)
                },
                category: function (callback) {
                    Category.findById(req.body.category, callback)
                }
            }, function (err, results) {
                if (results.author === undefined || results.category === undefined) {
                    res.status(400).json({ message: 'Either author or category input are invalid' })
                }
                else if (err) {
                    return next(err);
                }
                else {


                    //Make sure the subcategory exists
                    let passed = results.category.subcategories.filter(subcat => { return subcat === req.body.subcategory });

                    if (passed.length !== 0) {
                        let today = new Date();
                        let date = today.toDateString();
                        const post = new Post(
                            {
                                author: req.body.author,
                                title: req.body.title,
                                content: req.body.content,
                                date: date,
                                published: req.body.published,
                                category: req.body.category,
                                subcategory: req.body.subcategory
                            }
                        ).save((err, result) => {
                            if (err) { 
                                if (err.keyValue.title) {
                                    res.status(500).json({message: 'title already exists'})
                                }
                                else {
                                    return next(err); 
                                }
                            
                            }
                            else { res.status(200).json(result); }
                        })
                    } else {
                        res.status(400).json({ message: 'No subcategory by that name' })
                    }
                }

            })
            
        }
    }
]

// Returns the data for a specific post
exports.posts_get_post = function (req, res, next) {

    // First, check if the post exists
    Post.findById(req.params.postid)
        .populate('author', 'username')
        .populate('category', 'name')
        .exec(function (err, post) {
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
            console.log(post)
            if (post === undefined) {       //If no such post, return a 404 error
                res.status(400).json({ message: 'No post found' })
            }
            // Forward error from findById to next middleware
            else if (err) { return next(err); }
            // Called if the post exists and no errors were found by findById
            else {
                // If there were errors during validation, reject the submission and return the errors
                if (!errors.isEmpty()) {
                    const post = {
                        author: req.body.author,
                        title: req.body.title,
                        content: req.body.content,
                        published: req.body.published,
                        category: req.body.category,
                        subcategory: req.body.subcategory
                    }
                    res.status(400).json({ errArr: errors.array(), post: post })
                }

                // There were no errors so make sure author and category/subcategory exist
                else {

                    async.parallel({
                        author: function (callback) {
                            User.findById(req.body.author, callback)
                        },
                        category: function (callback) {
                            Category.findById(req.body.category, callback)
                        }
                    }, function (err, results) {
                        if (results.author === undefined || results.category === undefined) {
                            res.status(400).json({ message: 'Either author or category input are invalid' })
                        }
                        else if (err) {
                            return next(err);
                        }
                        else {


                            //Make sure the subcategory exists
                            let passed = results.category.subcategories.filter(subcat => { return subcat === req.body.subcategory });

                            if (passed.length !== 0) {
                                let newPost = {
                                    author: req.body.author,
                                    title: req.body.title,
                                    content: req.body.content,
                                    published: req.body.published,
                                    category: req.body.category,
                                    subcategory: req.body.subcategory,
                                    _id: req.params.postid
                                };
                                Post.findByIdAndUpdate(req.params.postid, newPost, {}, function (err) {
                                    if (err) {
                                        if (err.keyValue.title === null) {
                                            res.status(500).json({message: 'title already exists'})
                                        }
                                        else{
                                            return next(err); }
                                        }
                                    else {
                                        res.status(200).json(newPost);
                                    }
                                })
                            } else {
                                res.status(400).json({ message: 'No subcategory by that name' })
                            }
                        }

                    })
                }
            }
        })
    }]


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