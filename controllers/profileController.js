const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const ProfileModel = require("../models/ProfileModel");
const { newFollowerNotification } = require("../utils/notificationActions");

exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send("This user not found!");
        }
        const profile = await ProfileModel.findOne({ owner: user._id }).populate(
            "owner"
        );

        const profileFollow = await FollowerModel.findOne({ owner: user._id })

        return res.status(200).json({
            profile,
            followersLength: profileFollow.followres.length > 0 ? profileFollow.followres.length : 0,
            followingLength: profileFollow.following.length > 0 ? profileFollow.following.length : 0
        });
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};

exports.getOwnPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send("This user not found!");
        }

        const posts = await PostModel.find({ owner: user._id })
            .sort({ createdAt: -1 })
            .populate("owner")
            .populate("comments.owner");

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await FollowerModel.findOne({ owner: userId }).populate(
            "followres.user"
        );
        if (!user) {
            return res.status(404).send("This user not found!");
        }

        return res.status(200).json(user.followres);
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await FollowerModel.findOne({ owner: userId }).populate(
            "following.user"
        );
        if (!user) {
            return res.status(404).send("This user not found!");
        }

        return res.status(200).json(user.following);
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};

exports.followSomeOne = async (req, res) => {
    try {
        const { userToFollowId } = req.params;
        const { user_id } = req;

        const me = await FollowerModel.findOne({ owner: user_id });
        const userToFollow = await FollowerModel.findOne({ owner: userToFollowId });

        if (!userToFollow || !me) {
            return res.status(404).send("This user not found!");
        }

        const isFollowing =
            me.following.length > 0 &&
            me.following.map((item) => item.user.toString()).includes(userToFollowId);

        if (isFollowing) {
            return res.status(401).send("This user already followed!");
        }

        await me.following.unshift({ user: userToFollowId });
        await me.save();

        await userToFollow.followres.unshift({ user: user_id });
        await userToFollow.save();

        await newFollowerNotification(user_id, userToFollowId);

        return res.status(200).json({
            message: "success",
        });
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};

exports.unFollowSomeOne = async (req, res) => {
    try {
        const { userToUnFollowId } = req.params;
        const { user_id } = req;

        const me = await FollowerModel.findOne({ owner: user_id });
        const userToUnFollow = await FollowerModel.findOne({
            owner: userToUnFollowId,
        });

        if (!userToUnFollow || !me) {
            return res.status(404).send("This user not found!");
        }

        const isFollow =
            (await me.following.length) > 0 &&
            me.following.map((per) => per.user.toString()).includes(userToUnFollowId);
        if (!isFollow) {
            return res.status(401).send("This user not follow before!");
        }

        const indexFollowing = await me.following
            .map((per) => per.user.toString())
            .indexOf(userToUnFollowId);
        await me.following.splice(indexFollowing, 1);
        await me.save();

        const indexFollower = await userToUnFollow.followres
            .map((per) => per.user.toString())
            .indexOf(user_id);
        await userToUnFollow.followres.splice(indexFollower, 1);
        await userToUnFollow.save();

        return res.status(200).json({
            message: "success",
        });
    } catch (error) {
        return res.status(500).send("Server Error");
    }
};
