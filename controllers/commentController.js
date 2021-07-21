const Post = require('../models/post');
const Comment = require('../models/comment');


exports.comments_get = function(req, res, next) {
    Comment.find({post: req.params.postid})
    .exec(function (err, comment_list) {
        if (err) { return next(err); }
        if (comment_list === null) {
            //oops - work on this later
            next();
        }
        else {
            res.status(200).json({comments:comment_list});
        }
    })
}

exports.comments_create = function(req, res, next) {
    res.end(`POST: Creates a new comment for post: ${req.params.postid}`);
}

exports.comment_delete = function(req, res, next) {
    res.end(`DELETE comment ${req.params.commentid} for post ${req.params.postid}`) 
}

