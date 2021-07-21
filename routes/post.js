var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController')

/* GET home page. */
router.get('/', function(req, res) {
  res.end("Homepage - Don't need unless I want to supply user with info on the API")
});

// Routes for all posts
router.get('/posts', postController.posts_get);

router.post('/posts', postController.posts_create);

// Routes for specific posts

router.get('/posts/:postid', postController.posts_get_post);

router.put('/posts/:postid', postController.posts_edit_post);

router.delete('/posts/:postid', postController.posts_delete_post);


module.exports = router;
