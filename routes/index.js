var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const passport = require('passport');


/*ROUTES
    For 1-4 need to add ability to sort by date, and ability to limit number of posts per page
1- .get /posts -> Grabs all published posts - 
2- .get /categories -> Grabs all categories - used on homepage
3. .get /posts/category/:id -> Grabs all posts for a specific category
4. .get /posts/category/:id/subcategory/:subcatid -> Grabs all posts for a specific subcategory
5. .get /posts/:id -> Grabs all data for specific post
6. .post /posts -> Adds a new post
7. .put /posts/:id -> Edits a post
8. .DELETE /posts/:id -> Deletes a post
9. .get /posts/:id/comments -> Displays all comments for post
10. .post /posts/:id/comments -> Adds a comment
11. .delete /posts/:id/comments/:commentId -> Deletes a comment
12. .post /categories -> Adds a category
13. .post /categories/subcategory -> Adds a subcategory
14. .delete /categories/:id -> Deletes a category
15. .delete /categories/:id/subcategory/:subcatId - >Deletes a subcategory

user auth
1. .post /auth/login
2. .post /auth/signup
3. .get /auth/userauth -> Temporarily used to authenticate token


profile
.get /user/:id -> Grabs profile data
.get /user/:id/posts -> Grabs all posts for an admin user - This is for their 'manage posts' page 
*/



// Route to retrieve all published posts 
// !- need to allow for sorting- can do alphabetically or by release
// date in the future - Or can we just do this client side????
// That's probably best for now
//TESTED
router.get('/posts', postController.get_posts);

// Grabs all published posts for a specific category
//TESTED
router.get('/posts/category/:id', postController.get_posts_by_cat)

// Grabs all posts for a specific subcategory
//TESTED
router.get('/posts/category/:id/:subcatid', postController.get_posts_by_subcat)

//Route for creating a new post - must be user 
//TESTED - auth works
router.post('/posts', passport.authenticate('jwt', { session: false }), postController.posts_create);

// Routes for specific posts
//TESTED
router.get('/posts/:postid', postController.posts_get_post);

//Route for editting a post - Must be user
//TESTED - Fails to catch a post title being changed to another title
router.put('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_edit_post);

//Route for deleting a post - must be user
//TESTED
router.delete('/posts/:postid', passport.authenticate('jwt', { session: false }), postController.posts_delete_post);


// Router to get comments for a specific post
//TESTED
router.get('/posts/:postid/comments', commentController.comments_get);

// Router to create a comment for a specific post
//TESTED
router.post('/posts/:postid/comments', commentController.comments_create);

// Route to delete a post under a specific comment - user only
//TESTED
router.delete('/posts/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), commentController.comment_delete);



// 2- .get /categories -> Grabs all categories - used on homepage
// 12. .post /categories -> Adds a category
// 13. .post /categories/subcategory -> Adds a subcategory
// 14. .delete /categories/:id -> Deletes a category
// 15. .delete /categories/:id/subcategory/:subcatId - >Deletes a subcategory

//Route to get all of the categories
//TESTED
router.get('/categories', categoryController.get_categories);

// Route to add a new category
//TESTED
router.post('/categories', passport.authenticate('jwt', { session: false }), categoryController.post_category);

// Route to add a new subcategory
//TESTED
router.post('/categories/:id/subcategory', passport.authenticate('jwt', { session: false }), categoryController.post_subcategory);

// Route to delete a subcategory
//TESTED
router.delete('/categories/:id/subcategory/:subcatid', passport.authenticate('jwt', { session: false }), categoryController.delete_subcategory);



// Routes for the user
router.post('/auth/login', userController.loginUser);

// Route to create a new user
router.post('/auth/signup', userController.user_create);

// This grabs the profile data. If we also use the query parameter ?allposts=true - It'll return even the 
// unpublished posts and comments related to unpublished posts
router.get('/user/:id', userController.get_profile);

// Need to authenticate this 
router.get('/user/:id/posts', userController.get_user_posts);

// Route for general authorization
router.get('/auth/userAuth', passport.authenticate('jwt', { session: false }),userController.authorizeUser);

router.get('/auth/protected-test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.end('Protected route reached')
});

// router.post('/user/sign-up', passport.authenticate('jwt', {session: false}), userController.user_create);  - Depreciated
module.exports = router;