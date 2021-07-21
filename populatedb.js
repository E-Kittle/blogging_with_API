#! /usr/bin/env node

console.log('This script populates test posts');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require('async');
const Post = require('./models/post');

// Connect to database
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create an array of posts 
const posts = [];


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

async.series([
    createPosts,
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