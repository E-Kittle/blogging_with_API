const Post = require('../models/post');

exports.posts_get = function(req, res, next) {
    res.end('GET all posts')
}

exports.posts_create = function(req, res, next) {
    res.end('creates a new post')
}

// Displays a post and all associated comments
exports.posts_get_post = function(req, res, next) {
    res.end(`GET specific post ${req.params.postid}`)
}

exports.posts_edit_post = function(req, res, next) {
    res.end(`PUT specific post ${req.params.postid}`)
}

exports.posts_delete_post = function(req, res, next) {
    res.end(`DELETE specific post ${req.params.postid}`)
}