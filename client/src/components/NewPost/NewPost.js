import React, { useState } from "react";
import "./NewPost.css";

import { BsCardImage } from "react-icons/bs";

import Avatar from "../Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/slices/appConfigSlice";

import { NavLink } from "react-router-dom";

function NewPost() {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.appConfigReducer.myProfile);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  };

  const hanldePostSubmit = async () => {
    dispatch(
      createPost({
        caption,
        postImg,
      })
     
    );
    setPostImg("");
    setCaption("");
  };

  return (
    <div>
      <h2 id="new">Create New Post</h2>

      <div className="CreatePost">
        <div className="left-part">
          <NavLink to={`/profile/${profile?.Id}`}>
            {" "}
            <Avatar source={profile?.avatarUrl} />{" "}
          </NavLink>
        </div>
        <div className="right-part">
          <input
            value={caption}
            type="text"
            className="captionInput"
            placeholder="What's on your mind?"
            onChange={(e) => setCaption(e.target.value)}
          />
          {postImg && (
            <div className="img-container">
              <img className="post-img" src={postImg} alt="post-img" />
            </div>
          )}

          <div className="bottom-part">
            <div className="input-post-img">
              <label htmlFor="inputImg" className="labelImg">
                <BsCardImage />
              </label>
              <input
                className="inputImg"
                id="inputImg"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button className="post-btn btn-primary" onClick={hanldePostSubmit}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPost;
