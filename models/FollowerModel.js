const { Schema, model} = require('mongoose');

const FollowerSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    followres: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }],

    following: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
});

module.exports = model('Follower', FollowerSchema);