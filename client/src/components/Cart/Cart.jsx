import React, { useState } from "react";
import "./Cart.css";

import Avatar from "../Avatar/Avatar";

import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteComment } from "../../redux/slices/appConfigSlice";
import { NavLink } from "react-router-dom";

import { MdDeleteOutline } from "react-icons/md";

function Cart({ onClos, post, postId }) {
  const [comment, setComment] = useState();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.appConfigReducer.myProfile);

  async function handleSubmit(e) {
    e.preventDefault();

    
    dispatch(
      addComment({
        commented: comment,
        postId,
      })
    );

    setComment("");
  }

  const handleCommentDelete = async () => {
    dispatch(
      deleteComment({
        postId,
      })
    );
  };

  return (
    <div className="Cart">
      <div className="overlay" onClick={onClos}></div>
      <div className="cart-content">
        <div className="btn-primary" onClick={onClos}>
          Close
        </div>
        <div className="comment-info">
          <h1>Comments</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="child1"
              placeholder="Comment Here..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <input type="submit" disabled={!comment && true} className="child2" value="ADD" />
          </form>

          {post?.comments.map((comm) => {
            return (
              <div className="comment-section">
                <div>
                  <NavLink to={`/profile/${comm.Id}`} onClick={onClos}>
                    <Avatar source={comm.url} />
                  </NavLink>

                  <p>{comm.comment}</p>
                </div>
                {comm.Id === profile.Id && (
                  <MdDeleteOutline
                    onClick={handleCommentDelete}
                    className="comment-delete"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Cart;
