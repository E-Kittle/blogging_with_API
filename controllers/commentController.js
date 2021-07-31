const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

// Gets all comments related to the postid from the database
exports.comments_get = function(req, res, next) {
    Comment.find({post: req.params.postid})
    .populate('author', 'username')
    .exec(function (err, comment_list) {
        if (err) { return next(err); }

        // There are no comments for the specific post so return an empty array
        if (comment_list === null) {
            comment_list = [];
            res.status(200).json({comments:comment_list, message:'No comments for this blog post'});
        }

        // Successfully found comments, return to client
        else {
            res.status(200).json({comments:comment_list});
        }
    })
}


// Create a new comment
exports.comments_create = [
    // Validate and sanitize data
    body('name').escape().trim(),
    body('comment', 'Content is required').isLength({ min: 1 }).escape().trim(),

    (req, res, next) => {
        // Extract errors from validation
        const errors = validationResult(req);
        
        // If there are errors, handle them
        if(!errors.isEmpty()) {
            res.status(400).json({errArr: errors.array() });
        }
        // There are no errors, save the comment
        else {
            // Grab todays date
            let today = new Date();
            let date = today.toDateString();

            // Check if the user entered a name (not required) for their comment
            if (req.body.name === '') {
                req.body.name='Guest';
            }

            // Create a new comment and save it to the database
            let newComment = new Comment(
                {
                    name: req.body.name,
                    comment: req.body.comment,
                    date: date,
                    post: req.params.postid
                }
            ).save((err, result) => {
                if (err) { return next(err); }
                res.status(200).json(result)
            })
        }

    }
]

// Function to delete a comment
exports.comment_delete = function(req, res, next) {

    // Check if the comment specified by the url paramenter exists
    Comment.findById(req.params.commentid, function (err, comment) {
        if (comment === undefined) {
            res.status(404).json({ message: 'No such comment exists' })
        }
        else if (err) { return next(err); }

        // Comment exists and no errors, so delete the comment
        else {
            Comment.findByIdAndDelete(req.params.commentid, function deleteComment(err) {
                if (err) { return next(err); }
                else {
                    res.status(200).json({ message: `Comment deleted` })
                }
            })
        }
    })
}

