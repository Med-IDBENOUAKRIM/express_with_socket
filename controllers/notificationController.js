const NotificationModel = require("../models/NotificationModel");
const UserModel = require("../models/UserModel");


exports.getNotifications = async (req, res) => {
    try {
        const user = await NotificationModel.findOne({ owner: req.user_id })
            .populate('notifications.from_user')
            .populate('notifications.post');

        return res.json(user.notifications)


    } catch (error) {
        console.log(error);
    }
}

exports.notificationToRead = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user_id);

        if (user.unreadNotification) {
            user.unreadNotification = false;
            await user.save();
        }

        return res.status(200).json({
            succes: true
        })

    } catch (error) {
        console.log(error);
    }
}