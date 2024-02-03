import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import toast from "react-hot-toast";

export const getMyInfo = createAsyncThunk(
  "/user/getMyInfo",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.get("/user/myInfo");

      return response.result;
    } catch (e) {
      console.log("From slice error ", e);
    }
  }
);

export const getPostOfFollowing = createAsyncThunk(
  "/user/followingPosts",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.get("/user/followingPosts");

      return response.result;
    } catch (e) {
      console.log("From slice error get Post ", e);
    }
  }
);

export const userPosts = createAsyncThunk(
  "/user/userPosts",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/user/userPosts", body);

      return response.result;
    } catch (e) {
      console.log("From slice error get user Post ", e);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "/user/userProfile",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/user/userProfile", body);

      return response.result;
    } catch (e) {
      console.log("From slice error get user profile Post ", e);
    }
  }
);

export const likeHandle = createAsyncThunk(
  "/post/like",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/post/like", body);

      toast.success(response.result.message);
      return response.result;
    } catch (e) {
      console.log("Like handle error ", e);
    }
  }
);

export const searchUser = createAsyncThunk(
  "/user/search",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/user/search", body);

      return response.result;
    } catch (e) {
      console.log("Search handle error ", e);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "/post/deleteComment",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/post/deleteComment", body);

      toast.success("Comment Deleted Successfully");
      return body.postId;
    } catch (e) {
      console.log("Delete comment error ", e);
    }
  }
);

export const addComment = createAsyncThunk(
  "/post/comment",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/post/comment", body);

      toast.success(response.result.msg);
      return response.result;
    } catch (e) {
      console.log("Add comment error ", e);
    }
  }
);

export const createPost = createAsyncThunk(
  "/post/newPost",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/post/newPost", body);

      toast.success("Post Created Successfully");
      return response.result;
    } catch (e) {
      console.log(" Post created error ", e);
    }
  }
);

export const deletePost = createAsyncThunk(
  "/post/delete",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/post/delete", body);

      toast.success("Post Deleted Successfully");
      return response.result;
    } catch (e) {
      console.log(" Post deleted error ", e);
    }
  }
);

export const followUser = createAsyncThunk(
  "/user/follow",
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post("/user/follow", body);

      toast.success(response.result);
      return response.result;
    } catch (e) {
      console.log(" Follow User error ", e);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",

  initialState: {
    myProfile: null,
    userPosts: null,
    particularUserPosts: null,
    userProfile: null,
    searchItem: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      })
      .addCase(getPostOfFollowing.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(userPosts.fulfilled, (state, action) => {
        state.particularUserPosts = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.searchItem = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.myProfile.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload.postId;
        const index = state.myProfile.posts.findIndex(
          (item) => item.Id === postId
        );
        if (index != -1) state.myProfile.posts.splice(index, 1);
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (action.payload === "User followed") {
          console.log("If block m aaya");
          //update user profile
          const { avatarUrl, name, Id } = state.myProfile;
          state.userProfile.followers.push({
            url: avatarUrl,
            name,
            Id,
          });
          //update myProfile
          const { name: userName, userImage, userId } = state.userProfile;
          state.myProfile.followings.push({
            name: userName,
            url: userImage,
            Id: userId,
          });
          //update post of followings
          state.particularUserPosts.forEach((item) =>
            state.userPosts.unshift(item)
          );
        } else {
          //update user profile
          const myId = state.myProfile.Id;

          const index = state.userProfile.followers.findIndex((item) => {
            return item.Id === myId;
          });

          state.userProfile.followers.splice(index, 1);

          //update myProfile
          const { userId } = state.userProfile;

          const index1 = state.myProfile.followings.findIndex((item) => {
            return item.Id === userId;
          });

          state.myProfile.followings.splice(index1, 1);

          //update post of followings
          const user_Id = state.userProfile.userId;

          const index2 = state.userPosts.findIndex((item) => {
            return item.owner === user_Id;
          });

          const postCount = state.userProfile.postCount;

          state.userPosts.splice(index2, postCount);
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { comment, Id, url, postId, msg } = action.payload;
        const userId = state.myProfile.Id;

        //MyProfile

        const post = state.myProfile.posts.find((item) => {
          return item.Id === postId;
        });

        if (post) {
          const index = post.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index == -1) {
            post.comments.push({ comment, Id, url });
          } else post.comments[index].comment = comment;
        }
        //Following post
        const post1 = state.userPosts.find((item) => {
          return item.Id === postId;
        });

        if (post1) {
          const index = post1.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index == -1) {
            post1.comments.push({ comment, Id, url });
          } else post1.comments[index].comment = comment;
        }

        //particular user post
        const post2 = state.particularUserPosts?.find((item) => {
          return item.Id === postId;
        });

        if (post2) {
          const index = post2.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index == -1) {
            post2.comments.push({ comment, Id, url });
          } else post2.comments[index].comment = comment;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const userId = state.myProfile.Id;
        const postId = action.payload;

        console.log("Post Id is ", postId);
        console.log("User Id is ", userId);

        // myProfile
        const post = state.myProfile.posts.find((item) => {
          return item.Id === postId;
        });

        if (post) {
          const index = post.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index != -1) post.comments.splice(index, 1);
        }

        //Following Post
        const postIndex1 = state.userPosts.findIndex((item) => {
          return item.Id === postId;
        });

        if (postIndex1 != -1) {
          const post1 = state.userPosts[postIndex1];
          const index = post1.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index != -1) post1.comments.splice(index, 1);

          state.userPosts[postIndex1] = post1;
        }

        //particular user
        const postIndex2 = state.particularUserPosts.findIndex((item) => {
          return item.Id === postId;
        });

        if (postIndex2 != -1 ) {
          const post2 = state.particularUserPosts[postIndex2];
          const index = post2.comments.findIndex((item) => {
            return item.Id === userId;
          });

          if (index != -1) post2.comments.splice(index, 1);

          state.particularUserPosts[postIndex2] = post2;
        }
      })
      .addCase(likeHandle.fulfilled, (state, action) => {
        const postId = action.payload.postId;
        const message = action.payload.message;
        const userName = action.payload.name;
        const userId = action.payload.userId;
        const userImage = action.payload.userImage;

        if (message === "Post Liked") {
          //myprofile
          const post = state.myProfile.posts.find((item) => item.Id === postId);
          if (post) {
            post.likes.push({ name: userName, url: userImage, Id: userId });
          }
          //following post
          const post1 = state.userPosts.find((item) => item.Id === postId);
          if (post1) {
            post1.likes.push({ name: userName, url: userImage, Id: userId });
          }
          //particular user post
          const post2 = state.particularUserPosts?.find(
            (item) => item.Id === postId
          );
          if (post2) {
            post2.likes.push({ name: userName, url: userImage, Id: userId });
          }
        } else {
          //myprofile
          const post = state.myProfile.posts.find((item) => item.Id === postId);
          if (post) {
            const index = post.likes.findIndex((item) => item.Id === userId);
            post.likes.splice(index, 1);
          }
          //following
          const post1 = state.userPosts.find((item) => item.Id === postId);
          if (post1) {
            const index = post1.likes.findIndex((item) => item.Id === userId);
            post1.likes.splice(index, 1);
          }
          //particular user post
          const post2 = state.particularUserPosts?.find(
            (item) => item.Id === postId
          );
          if (post2) {
            const index = post2.likes.findIndex((item) => item.Id === userId);
            post2.likes.splice(index, 1);
          }
        }
      });
  },
});

export default appConfigSlice.reducer;
