const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments
let CategorySchema = new Schema(
    {
        type: {Type: String, required: true}
    }
)

module.exports = mongoose.model('Category', CategorySchema);
