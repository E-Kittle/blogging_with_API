#! /usr/bin/env node

// This script populates the db with test data
console.log('This script populates test posts, comments, categories, subcategories and users');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);


const async = require('async');
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');
const Category = require('./models/category');
const SubCategory = require('./models/subcategory');
const bcrypt = require('bcrypt');

// Connect to database
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create an array of posts 
const posts = [];
const comments = [];
const users = [];
const categories = [];
const subcategories = [];

// Function to create a new category
function categoryCreate(name, cb) {
    let category = new Category({ name });

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        } else {
            categories.push(category);
            cb(null, category);
        }
    })
}

// user test data will be removed from the db in production
function createCategory(cb) {
    async.series([
        function (callback) {
            categoryCreate('Science', callback)
        },
        function (callback) {
            categoryCreate('History', callback)
                },
        function (callback) {
            categoryCreate('Technology', callback)
        },
        function (callback) {
            categoryCreate('Pop Culture', callback)
        },
        function (callback) {
            categoryCreate('Fitness', callback)
        }
    ], cb)
}

// Function to create a new category
function subCategoryCreate(title, category, cb) {
    let newSubCategory = new SubCategory({ subcategory:title, category });

    newSubCategory.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        } else {
            subcategories.push(newSubCategory);
            cb(null, newSubCategory);
        }
    })
}

function createSubCategory(cb) {
    async.series([
        function (callback) {
            subCategoryCreate('Biology', categories[0], callback)
        },
        function (callback) {
            subCategoryCreate('Astronomy', categories[0], callback)
                },
        function (callback) {
            subCategoryCreate('Strength Training', categories[4], callback)
        },
        function (callback) {
            subCategoryCreate('Television', categories[3], callback)
        },
        function (callback) {
            subCategoryCreate('Mycology', categories[0], callback)
        },
        function (callback) {
            subCategoryCreate('Civil War', categories[1], callback)
        },
        function (callback) {
            subCategoryCreate('HIIT', categories[4], callback)
        }
    ], cb)
}

// Function to create an user
// user test data will be removed from the database in production
function userCreate(username, password, email, admin, cb) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        let userDetail = { username, password: hashedPassword, email, admin };

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
        function (callback) {
            userCreate('User1', 'Password1', 'test@test.com', true, callback)
        },
        function (callback) {
            userCreate('User2', 'Password2', 'test@test.com', false, callback)
        },
        function (callback) {
            userCreate('User3', 'Password3', 'test@test.com', true, callback)
        },
        function (callback) {
            userCreate('User4', 'Password4', 'test@test.com', true, callback)
        },
        function (callback) {
            userCreate('User5', 'Password5', 'test@test.com', false, callback)
        }
    ], cb)
}

// Function to create a post
function postCreate(author, title, content, published, subcategory, cb) {
    let today = new Date();
    let date = today.toDateString();

    postDetail = { author, title, content, date, published, subcategory };

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
        function (callback) {
            postCreate(users[0], 'Post1', 'Lots of content for post 1', true, subcategories[0], callback);
        },
        function (callback) {
            postCreate(users[0], 'Post2', 'Lots of content for post 2', false, subcategories[1],callback);
        },
        function (callback) {
            postCreate(users[2], 'Post3', 'Lots of content for post 3', true, subcategories[2], callback);
        },
        function (callback) {
            postCreate(users[2], 'Post4', 'Lots of content for post 4', false, subcategories[1], callback);
        },
        function (callback) {
            postCreate(users[2], 'Post5', 'Lots of content for post 5', true, subcategories[3], callback);
        },
        function (callback) {
            postCreate(users[3], 'Post7', 'Lots of content for post 5', true, subcategories[4], callback);
        },
        function (callback) {
            postCreate(users[3], 'Post10', 'Lots of content for post 5', true, subcategories[5], callback);
        },
        function (callback) {
            postCreate(users[3], 'Post8', 'Lots of content for post 5', false, subcategories[1], callback);
        },
        function (callback) {
            postCreate(users[0], 'Post9', 'Lots of content for post 5', true, subcategories[2], callback);
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
        if (err) {
            cb(err, null);
            return;
        }
        else {
            console.log('new Comment: ' + newComment);
            comments.push(newComment);
            cb(null, post);
        }
    })
}

// Loads the db with comments
function createComments(cb) {
    async.series([
        function (callback) {
            commentCreate('', 'A harsh comment', posts[1]._id, callback);
        },
        function (callback) {
            commentCreate(users[0], 'A nice comment', posts[1]._id, callback);
        },
        function (callback) {
            commentCreate(users[0], 'A harsh comment', posts[2]._id, callback);
        },
        function (callback) {
            commentCreate(users[3], 'A brutal comment', posts[2]._id, callback);
        },
        function (callback) {
            commentCreate(users[4], 'A harsh comment', posts[3]._id, callback);
        },
        function (callback) {
            commentCreate(users[1], 'A exhausted comment', posts[3]._id, callback);
        },
        function (callback) {
            commentCreate(users[1], 'A harsh comment', posts[0]._id, callback);
        },
        function (callback) {
            commentCreate(users[2], 'A harsh comment', posts[2]._id, callback);
        },
        function (callback) {
            commentCreate(users[3], 'A brutal comment', posts[2]._id, callback);
        },
        function (callback) {
            commentCreate(users[4], 'A harsh comment', posts[3]._id, callback);
        },
        function (callback) {
            commentCreate(users[1], 'A exhausted comment', posts[3]._id, callback);
        },
        function (callback) {
            commentCreate(users[1], 'A harsh comment', posts[0]._id, callback);
        },
    ]
        , cb);
}

async.series([
    createuser,
    createCategory,
    createSubCategory,
    createPosts,
    createComments
],
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('worked somehow');
        }

        mongoose.connection.close();
    })