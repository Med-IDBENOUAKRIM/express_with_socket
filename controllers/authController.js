const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');
const FollowerModel = require('../models/FollowerModel');
const jwt = require('jsonwebtoken');
const { hashedPassword } = require('../utils/hashPassword');
const { comparePassword } = require('../utils/comparePassword');
const NotificationModel = require('../models/NotificationModel');
const ChatModel = require('../models/ChatModel');

const userAvatar = 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_200x200.jpg';

exports.signup = async (req, res) => {
    const { name, email, username, password, avatar } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(404).json({
                error: 'User already registered!'
            });
        }
        const hashPassword = await hashedPassword(password);

        user = await UserModel.create({
            name,
            email,
            username,
            hash_Password: hashPassword,
            avatar: avatar || userAvatar
        });

        await ProfileModel.create({
            owner: user._id
        });

        await FollowerModel.create({
            owner: user._id,
            followers: [],
            following: []
        });

        await NotificationModel.create({
            owner: user._id,
            notifications: []
        });

        await ChatModel.create({
            owner: user._id,
            chats: []
        });

        return res.status(200).json({
            message: 'signup is success with no problem',
        })

    } catch (error) {
        return res.status(500).send(error)
    }
}


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'email is incorrect!!' });
        }

        const isPassword = await comparePassword(user.hash_Password, password);
        if (!isPassword) {
            return res.status(400).json({ error: 'your password is incorrect !' });
        }

        const chatModelExist = await ChatModel.findOne({ owner: user._id })
        if (!chatModelExist) {
            await new ChatModel({ owner: user._id, chats: [] }).save()
        }

        const token = jwt.sign({ user_id: user._id, username: user.username }, 'secret', { expiresIn: '24h' }, process.env.JWT_SECRET);
        res.cookie('token', token, { expire: new Date() + 9878540 });

        const { _id } = user;
        return res.status(200).json({
            token,
            user: { _id }
        });

    } catch (error) {
        return res.status(500).json({ error });
    }
}


exports.get__one = async (req, res) => {
    try {
        const { user_id } = req;
        const user = await UserModel.findById(user_id);

        const userFollowStats = await FollowerModel.findOne({ owner: user_id });

        return res.status(200).json({ user, userFollowStats })

    } catch (error) {
        return res.status(500).json({ error: error.details[0].message });
    }
}