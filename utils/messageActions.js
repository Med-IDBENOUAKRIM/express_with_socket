const ChatModel = require('../models/ChatModel');
const UserModel = require('../models/UserModel');

exports.getMessages = async (user_id, messageWith) => {
    try {
        const user = await ChatModel.findOne({ owner: user_id })
        .populate('chats.messageWith');
        const chat = user.chats.find(chat => chat.messageWith._id.toString() === messageWith);

        if (!chat) {
            return { error: 'No chat found!' }
        }

        return { chat }

    } catch (error) {
        console.log(error);
        return { error }
    }
}


exports.sendNewMessage = async (user_id, toHim, msg) => {
    try {
        const sender = await ChatModel.findOne({ owner: user_id });
        const receiver = await ChatModel.findOne({ owner: toHim });


        const new_msg = {
            sender: user_id,
            receiver: toHim,
            msg,
            date: Date.now()
        }
        const lastChatForSender = sender.chats.find(chat => chat.messageWith.toString() === toHim);

        if (lastChatForSender) {
            lastChatForSender.messages.push(new_msg)
            await sender.save()
        } else {
            const newChat = { messageWith: toHim, messages: [new_msg] }
            sender.chats.unshift(newChat)
            await sender.save()
        }


        const lastChatForReceiver = receiver.chats.find(chat => chat.messageWith.toString() === user_id);

        if (lastChatForReceiver) {
            lastChatForReceiver.messages.push(new_msg)
            await receiver.save()
        } else {
            const newChat = { messageWith: user_id, messages: [new_msg] }
            receiver.chats.unshift(newChat)
            await receiver.save()
        }

        return { new_msg }

    } catch (error) {
        console.log(error)
        return { error }
    }
}

exports.setMsgToRead = async (user_id) => {
    try {
        const user = await UserModel.findById(user_id);
        if (!user.unreadMessage) {
            user.unreadMessage = true;
            await user.save();
        }
        return;
    } catch (error) {
        console.error(error);
    }
}