const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');


exports.comments_get = function(req, res, next) {
    Comment.find({post: req.params.postid})
    .exec(function (err, comment_list) {
        if (err) { return next(err); }
        if (comment_list === null) {
            comment_list = [];
            res.status(200).json({comments:comment_list, message:'No comments for this blog post'});
        }
        else {
            res.status(200).json({comments:comment_list});
        }
    })
}

exports.comments_create = function(req, res, next) {

    // Validate and sanitize data
    //name, comment, date, post (which post it's referencing)
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
}

exports.comment_delete = function(req, res, next) {
    Comment.findById(req.params.commentid, function (err, comment) {
        if (comment === undefined) {
            res.status(404).json({ message: 'No such comment exists' })
        }
        else if (err) { return next(err); }
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

