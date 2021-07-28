// This schema is for the user that has permissions to create/edit/delete posts and delete comments

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the user - Password is protected by bcrypt
let UserSchema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, minLength: 8},
        email: {type: String, required: true},
        admin: {type: Boolean, required: true}
    }
)

module.exports = mongoose.model('User', UserSchema);