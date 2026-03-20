const User = require("../models/User");
const Post = require("../models/Post");

//  Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: req.params.id });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Update profile
const updateProfile = async (req, res) => {
  try {
    const { bio, gender } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = bio || user.bio;
    user.gender = gender || user.gender;

    await user.save();

    res.json({ message: "Profile updated", user });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  EXPORT CORRECTLY
module.exports = {
  getUserProfile,
  updateProfile,
};