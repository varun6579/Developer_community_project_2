const User = require("../models/User");
const Post = require("../models/Post");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ user, posts });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};