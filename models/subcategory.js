const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments
let SubCategorySchema = new Schema(
    {
        subcategory: {type: String, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
    }
)

module.exports = mongoose.model('SubCategory', SubCategorySchema);