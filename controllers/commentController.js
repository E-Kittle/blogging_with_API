const Post = require('../models/post');
const Comment = require('../models/comment');




exports.comments_create = function(req, res, next) {
    res.end(`POST: Creates a new comment for post: ${req.params.postid}`);
}

exports.comment_delete = function(req, res, next) {
    res.end(`DELETE comment ${req.params.commentid} for post ${req.params.postid}`) 
}

