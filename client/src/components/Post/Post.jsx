import React, { useState } from "react";

import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { TiHeartFullOutline } from "react-icons/ti";
import "./Post.css";
import Cart from "../Cart/Cart";
import Avatar from "../Avatar/Avatar";
import { NavLink, useNavigate } from "react-router-dom";

import {
  deletePost,
  
  likeHandle,
} from "../../redux/slices/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";

import CartFollow from "../Cart/CartFollow";

function Post({ avatar, post, Id }) {
  const [openCart, setOpenCart] = useState(false);
  const [followCart, setFollowCart] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.appConfigReducer.myProfile);

  const isLiked = post.likes.find((item) => {
    return item.Id === profile?.Id;
  });

  const userId = post?.owner;

  const isMyPost = profile?.Id === userId;

  async function handleLike() {
    dispatch(likeHandle({ postId: Id }));
  }

  async function handlePostDelete() {
    dispatch(
      deletePost({
        postId: Id,
      })
    );
  }

  return (
    <div>
      <div className="post-container">
        <div className="image-section">
          <img src={post?.url} alt="Nature image" />
        </div>

        <div className="info-section">
          <div className="avi">
            <NavLink to={`/profile/${post?.owner}`}>
              <Avatar source={avatar ? avatar.avatarUrl : post?.avatarUrl} />
            </NavLink>
          </div>

          <span>{avatar ? avatar.name : post?.name}</span>
        </div>

        <div className="caption">{post?.caption}</div>

        <div className="like-comment">
          <div>
            {isLiked ? (
              <TiHeartFullOutline id="full" onClick={handleLike} />
            ) : (
              <FaRegHeart id="full2" onClick={handleLike} />
            )}

            <span
              className="Post-Like"
              onClick={() => setFollowCart(!followCart)}
            >
              {post?.likes.length} likes
            </span>
          </div>

          <div>
            <FaRegCommentAlt id="cmt" onClick={() => setOpenCart(!openCart)} />
            <span>{post.comments?.length}</span>
          </div>
          {isMyPost && (
            <MdDeleteOutline id="post-delete" onClick={handlePostDelete} />
          )}
        </div>
        <div className="time-ago">{post?.timeAgo}</div>
      </div>
      {openCart && (
        <Cart post={post} postId={Id} onClos={() => setOpenCart(false)} />
      )}
      {followCart && (
        <CartFollow
          followers={post.likes}
          msg={"Likes"}
          onClos={() => setFollowCart(false)}
        />
      )}
    </div>
  );
}

export default Post;
