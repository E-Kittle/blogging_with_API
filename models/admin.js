// This schema is for the admin that has permissions to create/edit/delete posts and delete comments

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdminSchema = new Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true, minLength: 8}
    }
)

module.exports = mongoose.model('Admin', AdminSchema);