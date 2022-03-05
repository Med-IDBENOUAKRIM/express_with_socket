const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    chats: [
        {
            messageWith: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            messages: [
                {
                    msg: { type: String, required: true },
                    sender: {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    receiver: {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    date: { type: Date }
                }
            ]
        }
    ]
});

module.exports = model('Chat', ChatSchema);