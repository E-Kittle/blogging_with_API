var express = require('express');
var router = express.Router();

// Router for all comments belonging to a specific post
router.get('/posts/:postid/comments', function(req, res) {
  res.end(`GET: returns all comments from post ${req.params.postid}`)
});

router.post('/posts/:postid/comments', function(req, res) {
  res.end(`POST: Creates a new comment for post: ${req.params.postid}`)
});

// Route to delete a post under a specific comment
// Only an admin can access this route
router.delete('/posts/:postid/comments/:commentid', (req, res) => {
  res.end(`DELETE comment ${req.params.commentid} for post ${req.params.postid}`)
})

module.exports = router;
