const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    hash_Password: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    avatar: {
        type: String,
    },

    newMessagePopUp: {
        type: Boolean,
        default: false
    },

    unreadMessage: {
        type: Boolean,
        default: false
    },

    unreadNotification: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin']
    },

    resetToken: {
        type: String
    },

    expireToken: {
        type: Date,
    },
}, {
    timestamps: true
});

module.exports = model('User', UserSchema);