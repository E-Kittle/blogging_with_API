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
const users = [];

// Function to create an user
// user test data will be removed from the database in production
function userCreate(username, password, email, admin, cb) {

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        let userDetail = {username, password:hashedPassword, email, admin};

        let user = new User(userDetail);
        user.save(function (err) {
            if (err) {
                cb(err, null);
                return;    
            }
            else {
                users.push(user);
                cb(null, user);
            }
        })
    })
}

// user test data will be removed from the db in production
function createuser(cb) {
    async.series([
        function(callback) {
            userCreate('User1', 'Password1', 'test@test.com', true, callback)
        },
        function(callback) {
            userCreate('User2', 'Password2', 'test@test.com', false, callback)
        },
        function(callback) {
            userCreate('User3', 'Password3', 'test@test.com', true, callback)
        },
        function(callback) {
            userCreate('User4', 'Password4', 'test@test.com', true, callback)
        },
        function(callback) {
            userCreate('User5', 'Password5', 'test@test.com', false, callback)
        }
    ], cb)
}

// Function to create a post
function postCreate(author, title, content, published, cb) {
    let today = new Date();
    let date = today.toDateString();

    postDetail = {author:author, title:title, content:content, date:date, published:published};

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
            postCreate(users[0], 'Post1', 'Lots of content for post 1', true, callback);
        },
        function(callback) {
            postCreate(users[0], 'Post2', 'Lots of content for post 2', false, callback);
        },
        function(callback) {
            postCreate(users[2], 'Post3', 'Lots of content for post 3', true, callback);
        },
        function(callback) {
            postCreate(users[2], 'Post4', 'Lots of content for post 4', false, callback);
        },
        function(callback) {
            postCreate(users[2], 'Post5', 'Lots of content for post 5', true, callback);
        },
        function(callback) {
            postCreate(users[3], 'Post7', 'Lots of content for post 5', true, callback);
        },
        function(callback) {
            postCreate(users[3], 'Post10', 'Lots of content for post 5', true, callback);
        },
        function(callback) {
            postCreate(users[3], 'Post8', 'Lots of content for post 5', false, callback);
        },
        function(callback) {
            postCreate(users[0], 'Post9', 'Lots of content for post 5', true, callback);
        },
    ],
    cb);
}

// Function to create the comments in the db
function commentCreate(author, comment, post, cb) {
    let today = new Date();
    let date = today.toDateString();

    let commentDetail;
    if (author === '') {
        commentDetail = {
            comment: comment,
            date: date,
            post: post,
        }
    } else {
        commentDetail = {
            author: author,
            comment: comment,
            date: date,
            post: post,
        }
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
            commentCreate('', 'A harsh comment', posts[1]._id, callback);
        },
        function(callback) {
            commentCreate(users[0], 'A nice comment', posts[1]._id, callback);
        },
        function(callback) {
            commentCreate(users[0], 'A harsh comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate(users[3], 'A brutal comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate(users[4], 'A harsh comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate(users[1], 'A exhausted comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate(users[1], 'A harsh comment', posts[0]._id, callback);
        },  
        function(callback) {
            commentCreate(users[2], 'A harsh comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate(users[3], 'A brutal comment', posts[2]._id, callback);
        },
        function(callback) {
            commentCreate(users[4], 'A harsh comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate(users[1], 'A exhausted comment', posts[3]._id, callback);
        },
        function(callback) {
            commentCreate(users[1], 'A harsh comment', posts[0]._id, callback);
        },  
    ]
    ,cb);
}

async.series([
    createuser,
    createPosts,
    createComments
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