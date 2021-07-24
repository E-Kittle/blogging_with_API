const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments
let CommentSchema = new Schema(
    {
        name: {type: String, required: false, maxLength: 30, default: 'Guest'},
        comment: {type: String, required: true, maxLength: 300},
        date: {type: Date, required: true},
        post: {type: Schema.Types.ObjectId, ref: 'post', required: true}
    }
)

module.exports = mongoose.model('Comment', CommentSchema);