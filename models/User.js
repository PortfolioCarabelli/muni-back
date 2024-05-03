// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recoverToken: {
        type: String,
        default: null 
    },
    date: {
        type: Date,
        default: Date.now
    },
    roleCode: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('User', UserSchema);
