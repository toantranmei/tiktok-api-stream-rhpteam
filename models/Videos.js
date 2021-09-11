const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  likeCounter: {
    type: Number,
    default: 0,
  },
  shareCounter: {
    type: Number,
    default: 0,
  },
  commentCounter: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
