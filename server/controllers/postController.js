const { error, success } = require("../utils/response");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const ta = require("time-ago");

const createPost = async (req, res) => {
  try {
    const { caption, postImg } = req.body;

    if (!caption || !postImg) {
      return res.send(error(400, "PostImage and caption are required"));
    }
    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const owner = req._id;

    const newPost = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    const user = await User.findById(owner);
    user.posts.push(newPost._id);
    await user.save();

    const obj = {
      url: newPost.image.url,
      caption: newPost.caption,
      likes: [],
      comments: [],
      owner,
      timeAgo: ta.ago(newPost.createdAt),
      Id: newPost._id,
    };

    res.send(success(201, obj));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;

    const curUser = await User.findById(req._id);
    const post = await Post.findById(postId).populate("owner");
    if (!post) {
      return res.send(error(404, "Post Not Found"));
    }

    if (post.likes.includes(curUserId)) {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);
      await post.save();
      return res.send(
        success(200, {
          postId: post._id,
          message: "Not Liked",
          name: curUser.name,
          userImage: curUser.avatar.url,
          userId: req._id,
        })
      );
    } else {
      post.likes.push(curUserId);
      await post.save();
      return res.send(
        success(200, {
          postId: post._id,
          message: "Post Liked",
          name: curUser.name,
          userImage: curUser.avatar.url,
          userId: req._id,
        })
      );
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};



const deletePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const curUserId = req._id;

    if (!postId) {
      return res.send(error(500, "Post not found"));
    }

    const post = await Post.findById(postId);
   
    const curUser = await User.findById(curUserId);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can delete their posts"));
    }

    //delete post image
    await cloudinary.uploader.destroy(post.image.publicId);

    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);
    await curUser.save();

    await Post.deleteOne({ _id: postId });

    return res.send(success(200, { postId }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { postId, commented } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);
    const user = await User.findById(curUserId);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    let commentIndex = -1;

    post.comments.forEach((item, index) => {
      if (item.user.toString() == curUserId.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = commented;
      await post.save();

      return res.send(
        success(200, {
          url: user.avatar.url,
          comment: commented,
          Id: curUserId,
          msg: "Comment Updated Successfully",
          postId,
        })
      );
    } else {
      post.comments.push({
        user: curUserId,
        comment: commented,
      });

      await post.save();

      return res.send(
        success(200, {
          url: user.avatar.url,
          comment: commented,
          Id: curUserId,
          msg: "Comment Added Successfully",
          postId,
        })
      );
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    const index = post.comments.findIndex((item) => {
      return item.user.toString() === userId.toString();
    });

    if (index != -1) post.comments.splice(index, 1);

    await post.save();

    res.send(success(200, "Comment Deleted SuccessFully"));
  } catch (e) {
    res.send(error(400, e.message));
  }
};

module.exports = {
  createPost,
  likeAndUnlikePost,
  
  deletePost,
  commentOnPost,
  deleteComment,
};
