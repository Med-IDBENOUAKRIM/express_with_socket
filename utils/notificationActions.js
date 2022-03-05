const UserModel = require('../models/UserModel');
const NotificationModel = require('../models/NotificationModel');

const setNotificationToRead = async user_id => {
    try {
        const user = await UserModel.findById(user_id);
        if(!user.unreadNotification) {
            user.unreadNotification = true;
            await user.save();
        }
        return;
    } catch (error) {
        return res.status(500).send('Server Error');
    }
}


exports.newLikeNotification = async (user_id, post_id, user_to_notify_id) => {
    try {

        const userToNotify = await NotificationModel.findOne({ owner: user_to_notify_id });

        const newNotification = {
            type: 'newLike',
            from_user: user_id,
            post: post_id,
            date: Date.now() 
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        await setNotificationToRead(user_to_notify_id);
        return;
        
    } catch (error) {
        console.error(error);
    }
}

exports.newCommentNotification = async (user_id, post_id, comment_id, user_to_notify_id, text) => {
    try {
        const userToNotify = await NotificationModel.findOne({ owner: user_to_notify_id });

        const newNotification = {
            type: 'newComment',
            from_user: user_id,
            post: post_id,
            commentId: comment_id,
            text,
            date: Date.now() 
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        await setNotificationToRead(user_to_notify_id);
        
        return;
        
    } catch (error) {
        console.error(error);
    }
}

exports.newFollowerNotification = async (user_id, user_to_notify_id) => {
    try {
        const userToNotify = await NotificationModel.findOne({ owner: user_to_notify_id });

        const newNotification = {
            type: 'newFollower',
            from_user: user_id,
            date: Date.now() 
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();

        await setNotificationToRead(user_to_notify_id);
        
        return;
        
    } catch (error) {
        console.error(error);
    }
}