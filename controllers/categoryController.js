
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Post = require('../models/post')

// Method to get all categories
exports.get_categories = function (req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) { return next(err); }
        else {
            res.status(200).json({categories})
        }
    })
}

// Method to add a new category
exports.post_category = [

    // Validate and sanitize the data
    body('name', 'Category name is required').isLength({ min: 1 }).escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        }

        // There were no errors so create the new category and save it to the database
        else {
            let category = new Category({ name: req.body.name});

            category.save(function (err) {
                if (err) {
                    return  next(err);
                } else {
                    res.status(200).json({category})
                }
            })
        }
    }
]

// Method to add a new subcategory
exports.post_subcategory = [

    // Validate and sanitize the data
    body('subcategory', 'Subcategory name is required').isLength({ min: 1 }).escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        }

        // There were no errors so create the new subcategory and save it to the database
        else {

            // First, make sure category exists and that the subcategory doesn't
            Category.findById(req.params.id, function(err, cat) {
                console.log(cat)
                if (cat === undefined) {    //No such category exists
                    res.status(400).json({message: 'No such category exists'})
                }
                else {
                    let passed = [];
                    passed = cat.subcategories.filter(subcat => { return subcat === req.body.subcategory});
                    if(passed.length === 0) { //No other subcategory with this name exists
                        // Update the category
                        let newCategory = {
                            _id: cat._id,
                            name: cat.name,
                            subcategories: [...cat.subcategories, req.body.subcategory]
                        }
                        
                        Category.findByIdAndUpdate(req.params.id, newCategory, {}, function(err) {
                            if (err) {return next(err); }
                            else{
                                res.status(200).json(newCategory)
                            }
                        })
                    }
                    else {
                        // Subcategory exists
                        res.status(400).json({message:'Subcategory already exists in this category'})
                    }
                }
            })

        }
    }
]

// Method to delete a category
exports.delete_category = function (req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) { return next(err); }
        else {
            res.status(200).json({categories})
        }
    })
}


// Method to delete a subcategory
exports.delete_subcategory = function (req, res, next) {
    let fixedSubCat = req.params.subcatid.replace('-', ' ');
    Post.find({subcategory: req.params.subcatid})
    .exec(function(err, results) {
        if (results.length > 0) {
            res.status(400).json({message: 'Reassign the following posts before deleting subcategory', results})
        } else{
            Category.findById(req.params.id, function (err, cat) {
                const index = cat.subcategories.indexOf(fixedSubCat);
                if (index < 0) {
                    // No subcategory with that name exists
                    res.status(400).json({message: 'No such subcategory exists'});
                } else {
                    cat.subcategories.splice(index, 1);
                    console.log(cat.subcategories)
                    let newCategory = {
                        _id: cat._id,
                        name: cat.name,
                        subcategories: [...cat.subcategories]
                    }
    
                    Category.findByIdAndUpdate(req.params.id, newCategory, {}, function(err) {
                        if (err) {return next(err); }
                        else{
                            res.status(200).json(newCategory)
                        }
                    })
                }
            })
        }
    })
    // Category.find({}, function(err, categories) {
    //     if (err) { return next(err); }
    //     else {
    //         res.status(200).json({categories})
    //     }
    // })
}