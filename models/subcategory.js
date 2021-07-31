const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments
let SubCategorySchema = new Schema(
    {
        subcat: {type: String, required: true},
        cat: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
    }
)

module.exports = mongoose.model('SubCategory', SubCategorySchema);