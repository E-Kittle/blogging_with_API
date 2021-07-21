var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

// Router to create a comment for a specific post
router.post('/posts/:postid/comments', commentController.comments_create);

// Route to delete a post under a specific comment
// Only an admin can access this route
router.delete('/posts/:postid/comments/:commentid', commentController.comment_delete);

module.exports = router;
