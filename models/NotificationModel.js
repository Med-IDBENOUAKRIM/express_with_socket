const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    notifications: [
        {
            type: {
                type: String,
                enum: [ 'newLike', 'newComment', 'newFollower' ]
            },
            from_user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            post: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            commentId: {
                type: String,
            }, 
            text: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = model('Notification', NotificationSchema);