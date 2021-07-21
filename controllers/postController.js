const Post = require('../models/post');
const { body, validationResult } = require('express-validator');


// Function to get the posts - We can also add a query parameter to the URL
// if we want to allow the user to sort the results
exports.posts_get = function (req, res, next) {
    Post.find()
        .exec(function (err, post_list) {
            if (err) { return next(err); }
            else {      //Successful data grab
                res.status(200).json(post_list);
            }
        })
}


exports.posts_create = [
    body('title', 'Title is required').isLength({ min: 1 }).escape().trim(),
    body('content', 'Content is required').isLength({ min: 1 }).escape().trim(),
    body('published').toBoolean(),

    (req, res, next) => {
        const errors = validationResult(req);

        // If there were errors, reject the submission and return the errors
        if (!errors.isEmpty()) {

            // Do we do this on the backend or allow them to handle it on the frontend?
            const post = {
                title: req.body.title,
                content: req.body.content
            }


            res.status(400).json({ errArr: errors.array() })

            /*
            This is what the errArr would look like for the client
                {
                    "errArr": [
                        {
                            "msg": "Title is required",
                            "param": "title",
                            "location": "body"
                        },
                        {
                            "msg": "Content is required",
                            "param": "content",
                            "location": "body"
                        }
                    ]
                }
            */
        }

        // There were no errors save the post
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

// Displays a post and makes sure it exists
exports.posts_get_post = function (req, res, next) {
    Post.findById(req.params.postid, function (err, post) {
        if (post === undefined) {
            res.status(404).json({ message: 'No such post exists' })
        }
        else if (err) { return next(err); }
        else {
            res.status(200).json(post)
        }
    })
}



exports.posts_edit_post = [
    body('title', 'Title is required').isLength({ min: 1 }).escape().trim(),
    body('content', 'Content is required').isLength({ min: 1 }).escape().trim(),
    body('published').toBoolean(),

    (req, res, next) => {
        const errors = validationResult(req);

        Post.findById(req.params.postid, function (err, post) {

            if (post === undefined) {
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

// END OF EDITS





exports.posts_delete_post = function (req, res, next) {
    Post.findById(req.params.postid, function (err, post) {
        if (post === undefined) {
            res.status(404).json({ message: 'No such post exists' })
        }
        else if (err) { return next(err); }
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