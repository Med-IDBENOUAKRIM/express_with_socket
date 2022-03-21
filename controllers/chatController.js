const ChatModel = require("../models/ChatModel");


exports.getChats = async (req, res) => {
    try {
        const {user_id} = req;

        const {chats} = await ChatModel.findOne({owner: user_id}).populate('chats.messageWith')
        let chatSideBar = [];

        if (chats.length > 0) {
            chatSideBar = await chats.map(chat => (
                {
                    messageWith: chat.messageWith._id,
                    name: chat.messageWith.name,
                    avatar: chat.messageWith.avatar,
                    lastMessage: chat.messages[chat.messages.length - 1].msg,
                    date: chat.messages[chat.messages.length - 1].date
                }
            ))
        }

        return res.json(chatSideBar);

    } catch (error) {
        console.log(error);
    }
}