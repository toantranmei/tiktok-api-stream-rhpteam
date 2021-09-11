const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Video = require("./models/Videos");

const { isExists } = require("./utils/array");

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:admin@tictocdb.2yymu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected db"))
  .catch((err) => console.log("failed to connect db, error: ", err));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use("/", function (req, res) {
//   res.send("api worked!");
// });

app.post("/login", async function (req, res) {
  const { username, password } = req.body;

  // find username in db of user collection
  const user = await User.findOne({ username });

  // if user does not exist in db then immediate create a new account by username & password
  if (!user) {
    // create new user
    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    return res.status(200).json({ token: newUser.username });
  } else if (user && password !== user.password) {
    return res.status(401).json({ message: "wrong password." });
  }

  return res.status(200).json({ token: user.username });
});

app.post("/videos/:id/like", async function (req, res) {
  // find video by id from params
  const { id } = req.params;
  const { token } = req.body;

  const user = await User.findOne({ username: token });
  const video = await Video.findOne({ _id: id });

  if (!video) return res.status(422).json({ message: "not found video" });

  // check current user which like this video,
  //  if not increase like by 1 and push user in to likes[],
  // if liked before decrease by 1 and remove user out to likes[]
  console.log(video.likes);
  if (video.likes.includes(user._id)) {
    video.likeCounter -= 1;
    video.likes.pull(user._id);
  } else {
    video.likeCounter += 1;
    video.likes.push(user._id);
  }
  console.log("video, ", video);
  await video.save();

  return res.status(200).json({ success: true });
});

app.post("/videos", async function (req, res) {
  const { title, description, source, owner } = req.body;

  const newVideo = new Video({
    title,
    description,
    source,
    owner,
  });

  await newVideo.save();

  return res.status(200).json({ success: true });
});

app.get("/videos", async function (req, res) {
  const { token } = req.query;

  // find user if have token
  const user = await User.findOne({ username: token });

  // get videos from db
  const videos = await Video.find({})
    .populate({
      path: "owner",
      select: "username followerCounter",
    })
    .populate({
      path: "likes",
      select: "username",
    })
    .lean();

  const results = videos.map((video) => {
    console.log(video.likes);
    if (user && isExists(video.likes, "username", user.username))
      video.isLiked = true;
    else video.isLiked = false;

    return video;
  });

  return res.status(200).json(results);
});

app.listen(process.env.PORT || 3000, () => console.log("running port 3000"));
