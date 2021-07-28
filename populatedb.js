#! /usr/bin/env node

// This script populates the db with test data
console.log('This script populates test posts, comments, and an user');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);


const async = require('async');
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');
const bcrypt = require('bcrypt');

// Connect to database
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create an array of posts 
const posts = [];
const comments = [];


// Function to create an user
// user test data will be removed from the database in production
function userCreate(username, password, cb) {

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        let userDetail = {username, password:hashedPassword};

        let user = new User(userDetail);
        user.save(function (err) {
            if (err) {
                cb(err, null);
                return;    
            }
            else {
                cb(null, user);
            }
        })
    })
}

// user test data will be removed from the db in production
function createuser(cb) {
    async.series([
        function(callback) {
            userCreate('removed', 'removed', callback)
        }
    ], cb)
}

// Function to create a post
function postCreate(title, content, published, cb) {
    let today = new Date();
    let date = today.toDateString();

    postDetail = {title:title, content:content, date:date, published:published};

    let post = new Post(postDetail);

    post.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        else {
            console.log('new Post: ' + post);
            posts.push(post);
            cb(null, post);
        }
    });
}

// Loads the db with posts
function createPosts(cb) {
    async.series([
        function(callback) {
            postCreate('Post1', 'Lots of content for post 1', true, callback);
        },
        function(callback) {
            postCreate('Post2', 'Lots of content for post 2', true, callback);
        },
        function(callback) {
            postCreate('Post3', 'Lots of content for post 3', true, callback);
        },
        function(callback) {
            postCreate('Post4', 'Lots of content for post 4', true, callback);
        },
        function(callback) {
            postCreate('Post5', 'Lots of content for post 5', true, callback);
        },
    ],
    cb);
}

// Function to create the comments in the db
function commentCreate(name, comment, post, cb) {
    let today = new Date();
    let date = today.toDateString();

    commentDetail = {
        name: name,
        comment: comment,
        date: date,
        post: post,
    }

    let newComment = new Comment(commentDetail);

    newComment.save(function (err) {
        if(err) {
            cb(err, null);
            return;
        }
        else {
            console.log('new Comment: ' +newComment);
            comments.push(newComment);
            cb(null, post);
        }
    })
}

// Loads the db with comments
function createComments(cb) {
    async.series([
        function(callback) {
            commentCreate('user1', 'A harsh comment', posts[1]._id, callback);
        },
        function(callback) {
            commentCreate('user2', 'A nice comment', posts[1]._id, callback);
        },
        function(callback) {
            commentCreate('user1', 'A harsh comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate('user2', 'A brutal comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate('user1', 'A harsh comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate('user2', 'A exhausted comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate('user3', 'A harsh comment', posts[0]._id, callback);
        },  
    ]
    ,cb);
}

async.series([
    createPosts,
    createComments,
    createuser
],
function(err, results) {
    if(err){
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('worked somehow');
    }

    mongoose.connection.close();
})