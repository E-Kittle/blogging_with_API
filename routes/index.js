var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const passport = require('passport');

// Route to retrieve all published posts
router.get('/posts', postController.posts_get);

// Route to retrieve all posts: published and unpublished - user only
router.get('/allposts', passport.authenticate('jwt', { session: false }), postController.posts_get_protected);

//Route for creating a new post - must be user 
router.post('/posts', passport.authenticate('jwt', { session: false }), postController.posts_create);



// Routes for specific posts
router.get('/posts/:postid', postController.posts_get_post);

//Route for editting a post - Must be user
router.put('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_edit_post);

//Route for deleting a post - must be user
router.delete('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_delete_post);

// Router to get comments for a specific post
router.get('/posts/:postid/comments', commentController.comments_get);

// Router to create a comment for a specific post
router.post('/posts/:postid/comments', commentController.comments_create);

// Route to delete a post under a specific comment - user only
router.delete('/posts/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), commentController.comment_delete);


// Routes for the user
router.post('/auth/login', userController.loginUser);

// Route to create a new user
router.post('/auth/signup', userController.user_create);

// Route for general authorization
router.get('/auth/userAuth', passport.authenticate('jwt', { session: false }),userController.authorizeUser);

router.get('/auth/protected-test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.end('Protected route reached')
});

// router.post('/user/sign-up', passport.authenticate('jwt', {session: false}), userController.user_create);  - Depreciated
module.exports = router;