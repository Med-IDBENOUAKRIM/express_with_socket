const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const uuid = require("uuid").v4;
const FollowerModel = require("../models/FollowerModel");
const {
  newLikeNotification,
  newCommentNotification,
} = require("../utils/notificationActions");

exports.createPost = async (req, res) => {
  const { content, photoUrl } = req.body;

  if (content.length < 1) {
    return res.status(401).json({
      message: "The content must be at least 1 character",
    });
  }

  try {
    const new_post = {
      owner: req.user_id,
      content,
    };
    if (photoUrl) new_post.photoUrl = photoUrl;
    const post = await PostModel.create(new_post);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("owner")
      .populate("comments.owner")
      .populate("likes.user");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.getOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId)
      .populate("owner")
      .populate("comments.owner")
      .populate("likes.user");
    if (!post) {
      return res.status(401).json("This post not found!");
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.deleteOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(401).json("This post not found!");
    }

    const user = await UserModel.findById(req.user_id);
    if (post.owner.toString() !== req.user_id) {
      if (user.role === "admin") {
        await post.remove();
        return res.status(200).json({
          message: "Post deleted successfully",
        });
      } else {
        return res.status(401).send("You are not login!!!");
      }
    }

    await post.remove();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(401).json("This post not found!");
    }
    const isLiked = post.likes
      .map((like) => like.user.toString())
      .includes(req.user_id);

    if (isLiked) {
      return res.status(401).json("This post already liked!");
    }
    await post.likes.unshift({ user: req.user_id });
    await post.save();

    if (post.owner.toString() !== req.user_id) {
      await newLikeNotification(req.user_id, postId, post.owner.toString());
    }

    return res.status(200).send("Post liked");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(401).json("This post not found!");
    }
    const isLiked = post.likes
      .map((like) => like.user.toString())
      .includes(req.user_id);

    if (!isLiked) {
      return res.status(401).json("This post not liked before!");
    }

    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user_id);
    await post.likes.splice(index, 1);
    await post.save();
    return res.status(200).send("Post unliked");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.getAllLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) {
      return res.status(401).json("This post not found!");
    }
    return res.status(200).json(post.likes);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { user_id } = req;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(401).json("This post not found!");
    }

    if (content.length < 1) {
      return res.status(401).json({
        message: "The content must be at least 1 character",
      });
    }

    const newComment = {
      _id: uuid(),
      owner: user_id,
      content,
      date: Date.now(),
    };
    await post.comments.unshift(newComment);
    await post.save();

    if (post.owner.toString() !== user_id) {
      await newCommentNotification(
        user_id,
        postId,
        newComment._id,
        post.owner.toString(),
        content
      );
    }

    return res.status(200).send("comment created");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { user_id } = req;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(401).json("This post not found!");
    }

    const comment = await post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(401).json("This comment not found!");
    }

    const user = await UserModel.findById(user_id);

    if (comment.owner.toString() !== user_id) {
      if (user.role === "admin") {
        const index = await post.comments
          .map((comment) => comment._id.toString())
          .indexOf(commentId);
        await post.comments.splice(index, 1);
        await post.save();
        return res.status(200).json({
          message: "Comment deleted successfully",
        });
      } else {
        return res.status(401).send("You are not login!!!");
      }
    }

    const index = await post.comments
      .map((comment) => comment._id.toString())
      .indexOf(commentId);
    await post.comments.splice(index, 1);
    await post.save();
    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};
