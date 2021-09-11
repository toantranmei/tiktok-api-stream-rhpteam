const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  followerCounter: {
    type: Number,
    default: 0,
  },
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
