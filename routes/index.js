var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const adminController = require('../controllers/adminController');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.end("Homepage - Don't need unless I want to supply user with info on the API")
});


// Routes for all posts
  router.get('/posts', postController.posts_get);

  //Route for creating a new post - must be admin 
  router.post('/posts', passport.authenticate('jwt', { session: false }), postController.posts_create);



// Routes for specific posts
  router.get('/posts/:postid', postController.posts_get_post);

  //Route for editting a post - Must be admin
  router.put('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_edit_post);

  //Route for deleting a post - must be admin
  router.delete('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_delete_post);

// Router to get comments for a specific post
  router.get('/posts/:postid/comments', commentController.comments_get);

// Router to create a comment for a specific post
  router.post('/posts/:postid/comments', commentController.comments_create);

// Route to delete a post under a specific comment - ADMIN only
router.delete('/posts/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), commentController.comment_delete);


// Routes for the admin
router.post('/admin/login', adminController.loginAdmin);

module.exports = router;