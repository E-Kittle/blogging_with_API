var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const passport = require('passport');


// 3. Category appeared as null on a post - why

/*ROUTES
    For 1-4 need to add ability to sort by date, and ability to limit number of posts per page
D1- .get /posts -> Grabs all published posts - 
D2- .get /categories -> Grabs all categories - used on homepage
D3. .get /posts/category/:id -> Grabs all posts for a specific category
D4. .get /posts/category/:id/subcategory/:subcatid -> Grabs all posts for a specific subcategory
D5. .get /posts/:id -> Grabs all data for specific post
D6. .post /posts -> Adds a new post
D7. .put /posts/:id -> Edits a post
D8. .DELETE /posts/:id -> Deletes a post
D9. .get /posts/:id/comments -> Displays all comments for post
D10. .post /posts/:id/comments -> Adds a comment
D11. .delete /posts/:id/comments/:commentId -> Deletes a comment
D12. .post /categories -> Adds a category
D13. .post /categories/subcategory -> Adds a subcategory
D14. .delete /categories/:id -> Deletes a category
D15. .delete /categories/:id/subcategory/:subcatId - >Deletes a subcategory

user auth
1. .post /auth/login
2. .post /auth/signup
3. .get /auth/userauth -> Temporarily used to authenticate token


profile
.get /user/:id -> Grabs profile data
.get /user/:id/posts -> Grabs all posts for an admin user - This is for their 'manage posts' page 
*/



// Route to retrieve all published posts 
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
// NEED TO ADD AUTH
router.post('/posts', postController.posts_create);

// Routes for specific posts
//TESTED
router.get('/posts/:postid', postController.posts_get_post);

//Route for editting a post - Must be user
//TESTED 
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

//Route to get all of the categories
//TESTED
router.get('/categories', categoryController.get_categories);

// Route to add a new category
//TESTED
router.post('/categories', passport.authenticate('jwt', { session: false }), categoryController.post_category);

// Route to delete a category
//TESTED
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), categoryController.delete_category);

// Route to add a new subcategory
//TESTED
router.post('/categories/:id/subcategory', passport.authenticate('jwt', { session: false }), categoryController.post_subcategory);


// Route to delete a subcategory
//TESTED
router.delete('/categories/:id/subcategory/:subcatid', passport.authenticate('jwt', { session: false }), categoryController.delete_subcategory);



// Routes for the user
//TESTED
router.post('/auth/login', userController.loginUser);

// Route to create a new user
//TESTED
router.post('/auth/signup', userController.user_create);

// This grabs the profile data. Only returns comments associated with published posts
// and published posts (if the user has any) 
//TESTED
router.get('/user/:id', passport.authenticate('jwt', { session: false }), userController.get_profile);

// Route for admin user to see all posts, including unpublished posts
//TESTED
router.get('/user/:id/posts', passport.authenticate('jwt', { session: false }), userController.get_user_posts);

// Route for general authorization- Just checks token
//TESTED
router.get('/auth/userAuth', passport.authenticate('jwt', { session: false }), userController.authorizeUser);

// router.post('/user/sign-up', passport.authenticate('jwt', {session: false}), userController.user_create);  - Depreciated
module.exports = router;