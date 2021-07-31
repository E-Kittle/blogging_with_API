const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments
let CommentSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User', default: null},
        comment: {type: String, required: true, maxLength: 300},
        date: {type: Date, required: true},
        post: {type: Schema.Types.ObjectId, ref: 'post', required: true}
    }
)

module.exports = mongoose.model('Comment', CommentSchema);