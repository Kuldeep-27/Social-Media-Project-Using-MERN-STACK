const Post = require("../models/Post");
const User = require("../models/User");
const ta = require("time-ago");
const { success, error } = require("../utils/response");
const { getSearch, userProfile, myInfo, userPosts } = require("../utils/structure");
const cloudinary = require("cloudinary").v2;

const followUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const userToFollow = await User.findById(userId);

    const loggedInUser = await User.findById(req._id);

    if (!userToFollow) {
      return res.send(error(404, "User not found"));
    }

    if (loggedInUser.followings.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.followings.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.followings.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      return res.send(success(200, "User Unfollowed"));
    } else {
      loggedInUser.followings.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      return res.send(success(200, "User followed"));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req._id);

    const posts = await Post.find({
      owner: {
        $in: user.followings,
      },
    }).populate("owner likes comments.user");

   

    return res.send(success(200, userPosts(posts)));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};



const getUserPosts = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.send(error(400, "User id is required"));
    }
    const posts = await Post.find({
      owner: userId,
    }).populate("owner likes comments.user");

    

    return res.send(success(200, userPosts(posts)));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId).populate("posts");
    console.log("Current user is ", curUser);

    // Delete user avatar
    await cloudinary.uploader.destroy(curUser.avatar.publicId);

    // Delete all posts and associated Cloudinary images
    for (const post of curUser.posts) {
      // Delete the Cloudinary image associated with the post
      await cloudinary.uploader.destroy(post.image.publicId);

      // Remove the post
      await Post.deleteOne({ _id: post._id });
    }

    // Remove myself from followers' followings
    for (const followerId of curUser.followers) {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(curUserId);
      follower.followings.splice(index, 1);
      await follower.save();
    }

    // Remove myself from my followings' followers
    for (const followingId of curUser.followings) {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(curUserId);
      following.followers.splice(index, 1);
      await following.save();
    }

    // Remove myself from all likes and comments
    const allPosts = await Post.find();
    for (const post of allPosts) {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);

      const comIndex = post.comments.findIndex((item) => item.user == curUserId);
      post.comments.splice(comIndex, 1);

      await post.save();
    }

    // Delete the user
    await User.deleteOne({ _id: curUserId });

    // Clear JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "Account Deleted Successfully"));
  } catch (e) {
    console.error(e);
    return res.send(error(500, e.message));
  }
};


const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id)
      .populate("followers followings posts")
      .populate({
        path: "posts",
        populate: {
          path: "likes comments.user",
          model: "user",
        },
      });

    

    return res.send(success(200,myInfo(user)));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;

    const user = await User.findById(req._id);

    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      await cloudinary.uploader.destroy(user.avatar.publicId);

      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }
    await user.save();
    return res.send(success(200, { user }));
  } catch (e) {
    console.log("put e", e);
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("followers followings");

    if (!user) {
      return res.send(error(404, "User not found"));
    }

    return res.send(success(200,userProfile(user)));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req._id } }).select(
      "name avatar.url"
    );

    return res.send(success(200, { users }));
  } catch (e) {
    return res.send(error(400, e.message));
  }
};

const searchUser = async (req, res) => {
  try {
    const { query } = req.body;
    if (query === "") {
      return res.send(success(200, []));
    }
    const results = await User.find({
      name: { $regex: new RegExp(query, "i") },
    });

   
    res.send(success(200, getSearch(results)));
  } catch (e) {
    return res.send(error(400, e.message));
  }
};

module.exports = {
  followUser,
  getPostOfFollowing,
  
  getUserPosts,
  deleteMyProfile,
  getMyInfo,
  updateUserProfile,
  getUserProfile,
  getAllUser,
  searchUser,
};
