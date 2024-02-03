const ta = require("time-ago");

const getSearch = (results) => {
  const searchUsers = [];

  results.forEach((res) => {
    const name = res.name;
    const userId = res._id;

    searchUsers.push({ name, userId });
  });
  return searchUsers;
};

const userProfile = (user) => {
  const name = user.name;
  const userImage = user.avatar.url;
  const followers = [];
  const followings = [];
  const postCount = user.posts.length;

  user.followers.forEach((item) => {
    const url = item.avatar.url;
    const name = item.name;
    const Id = item._id;

    followers.push({
      url,
      name,
      Id,
    });
  });

  user.followings.forEach((item) => {
    const url = item.avatar.url;
    const name = item.name;
    const Id = item._id;

    followings.push({
      url,
      name,
      Id,
    });
  });

  const obj = {
    name,
    userImage,
    followers,
    followings,
    postCount,
    userId: user._id,
  };
  return obj;
};

const myInfo = (user) => {
  const Id = user._id;
  const name = user.name;
  const url = user.avatar.url;
  const followers = [];
  const followings = [];
  const posts = [];

  user.followers.forEach((follow) => {
    const obj = {
      name: follow.name,
      Id: follow._id,
      url: follow.avatar.url,
    };
    followers.push(obj);
  });

  user.followings.forEach((follow) => {
    const obj = {
      name: follow.name,
      Id: follow._id,
      url: follow.avatar.url,
    };
    followings.push(obj);
  });

  user.posts.forEach((post) => {
    const url = post.image.url;
    const caption = post.caption;
    const likes = [];
    const comments = [];

    post.likes.forEach((like) => {
      const name = like.name;
      const url = like.avatar.url;
      const Id = like._id;
      const obj = { url, Id, name };
      likes.push(obj);
    });

    post.comments.forEach((comm) => {
      const comment = comm.comment;
      const Id = comm.user._id;
      const url = comm.user.avatar.url;
      const obj = { comment, Id, url };
      comments.push(obj);
    });
    posts.unshift({
      url,
      caption,
      likes,
      comments,
      owner: post.owner,
      timeAgo: ta.ago(post.createdAt),
      Id: post._id,
    });
  });
  const obj = { avatarUrl: url, name, Id, followers, followings, posts };
  return obj;
};

const userPosts = (posts) => {
  const postData = [];

  posts.forEach((post) => {
    const postImage = post?.image.url;
    const caption = post?.caption;
    const ownerName = post?.owner?.name;
    const ownerImage = post?.owner?.avatar.url;
    const likes = [];
    const comments = [];
    const likesCount = post?.likes.length;
    const Id = post?._id;

    post.likes.forEach((user) => {
      const url = user?.avatar.url;
      const name = user?.name;
      const Id = user?._id;

      likes.push({
        url,
        name,
        Id,
      });
    });

    post.comments.forEach((item) => {
      const url = item?.user.avatar.url;
      const comment = item?.comment;
      const Id = item.user?._id;

      comments.push({
        url,
        comment,
        Id,
      });
    });

    postData.unshift({
      url: postImage,
      caption,
      avatarUrl: ownerImage,
      name: ownerName,
      likes,
      comments,
      likesCount,
      owner: post?.owner?._id,
      timeAgo: ta.ago(post.createdAt),
      Id,
    });
  });
  return postData;
};

module.exports = {
  getSearch,
  userProfile,
  myInfo,
  userPosts,
};
