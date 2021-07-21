var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.end("Homepage - Don't need unless I want to supply user with info on the API")
});

// Routes for all posts
router.get('/posts', function(req, res) {
  res.end('GET all posts')
})

router.post('/posts', function(req, res) {
  res.json({message: 'POST all posts'})
})

// Routes for specific posts

router.get('/posts/:postid', function(req, res) {
  res.end(`GET specific post ${req.params.postid}`)
});

router.put('/posts/:postid', function(req, res) {
  res.end(`PUT specific post ${req.params.postid}`)
});

router.delete('/posts/:postid', function(req, res) {
  res.end(`DELETE specific post ${req.params.postid}`)
});


module.exports = router;
