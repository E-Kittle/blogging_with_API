const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 150, unique: true},
        content: {type: String, required: true},
        date: {type: Date, required: true},
        published: {type: Boolean, required: true}
    }
)

module.exports = mongoose.model('Post', PostSchema);