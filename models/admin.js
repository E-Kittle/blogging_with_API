// This schema is for the admin that has permissions to create/edit/delete posts and delete comments

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the Admin - Password is protected by bcrypt
let AdminSchema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, minLength: 8}
    }
)

module.exports = mongoose.model('Admin', AdminSchema);