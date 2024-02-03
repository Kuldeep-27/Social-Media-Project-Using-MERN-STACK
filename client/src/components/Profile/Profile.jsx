import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./Profile.css";
import Avatar from "../Avatar/Avatar";
import CartFollow from "../Cart/CartFollow";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localManager";
import {
  followUser,
  getUserProfile,
  userPosts,
} from "../../redux/slices/appConfigSlice";
import toast from "react-hot-toast";

function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );

    dispatch(
      userPosts({
        userId: params.userId,
      })
    );
  }, [params.userId]);

  const specificPosts = useSelector(
    (state) => state.appConfigReducer.particularUserPosts
  );
  const userProfile = useSelector(
    (state) => state.appConfigReducer.userProfile
  );

  const [openFollow, setOpenFollow] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  const profile = useSelector((state) => state.appConfigReducer.myProfile);
  const Id = profile?.Id;

  const isMyProfile = Id === params.userId;

  async function handleLoggedOut() {
    try {
      await axiosClient.get("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");

      toast.success("Logged out successfully");
    } catch (e) {
      console.log("Error from logout ", e);
    }
  }

  const isFollowing = profile?.followings.find((user) => {
    return user.Id === params.userId;
  });

  async function handleFollow() {
    dispatch(
      followUser({
        userId: params.userId,
      })
    );
  }

  async function deleteUser() {
    try {
      const response = await axiosClient.get("/user/delete");

      removeItem(KEY_ACCESS_TOKEN);
      toast.success(response.result);
      navigate("/signup");
    } catch (e) {
      console.log("Deleting user error: ", e);
    }
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="left-part">
          {isMyProfile ? (
            profile?.posts?.length > 0 ? (
              profile.posts.map((post) => (
                <Post
                  key={post.caption}
                  post={post}
                  avatar={profile}
                  Id={post.Id}
                />
              ))
            ) : (
              <h2>Post Not Created</h2>
            )
          ) : specificPosts?.length > 0 ? (
            specificPosts?.map((post) => (
              <Post key={post.caption} post={post} Id={post.Id} />
            ))
          ) : (
            <h2>Post Not Created Yet</h2>
          )}
        </div>

        <div className="right-part">
          <div className="main-content">
            <div className="avatar">
              <Avatar
                source={
                  isMyProfile ? profile.avatarUrl : userProfile?.userImage
                }
              />
            </div>

            <h3 className="User-Name">
              {isMyProfile ? profile.name : userProfile?.name}
            </h3>
            <div className="followers common">
              <p class="special" onClick={() => setOpenFollow(!openFollow)}>
                Followers
              </p>
              <p>
                {isMyProfile
                  ? profile.followers.length
                  : userProfile?.followers.length}
              </p>
            </div>
            <div className="followings common">
              <p
                class="special"
                onClick={() => setOpenFollowing(!openFollowing)}
              >
                Followings
              </p>
              <p>
                {isMyProfile
                  ? profile.followings.length
                  : userProfile?.followings.length}
              </p>
            </div>
            <div className="posts common">
              <p>Posts</p>
              <p>
                {isMyProfile ? profile.posts.length : userProfile?.postCount}
              </p>
            </div>
            <div className="logout">
              {isMyProfile ? (
                <button onClick={handleLoggedOut}>LOGOUT</button>
              ) : isFollowing ? (
                <button onClick={handleFollow}>UnFollow</button>
              ) : (
                <button onClick={handleFollow}>Follow</button>
              )}
            </div>
            <div className="edit-profile">
              {isMyProfile ? (
                <button
                  onClick={() => {
                    navigate("/updateProfile");
                  }}
                >
                  Edit Profile
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="delete-account">
              {isMyProfile ? <button onClick={deleteUser}>DELETE</button> : ""}
            </div>
          </div>
        </div>
      </div>

      {openFollow && (
        <CartFollow
          onClos={() => setOpenFollow(false)}
          followers={isMyProfile ? profile?.followers : userProfile?.followers}
          msg="Followers"
        />
      )}

      {openFollowing && (
        <CartFollow
          onClos={() => setOpenFollowing(false)}
          followers={
            isMyProfile ? profile?.followings : userProfile?.followings
          }
          msg="Followings"
        />
      )}
    </div>
  );
}

export default Profile;
