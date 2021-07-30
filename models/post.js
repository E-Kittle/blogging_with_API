const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the posts
let PostSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'user', required: true},
        title: {type: String, required: true, maxLength: 150, unique: true},
        content: {type: String, required: true},
        date: {type: Date, required: true},
        published: {type: Boolean, required: true}
    }
)

module.exports = mongoose.model('Post', PostSchema);