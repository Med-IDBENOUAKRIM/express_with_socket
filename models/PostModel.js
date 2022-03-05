const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
    },

    photoUrl: {
      type: String,
    },

    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    comments: [
      {
        _id: {
          type: String,
          required: true,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", PostSchema);
