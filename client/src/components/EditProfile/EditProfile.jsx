import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import "./EditProfile.css";
import { axiosClient } from "../../utils/axiosClient";
import { getMyInfo } from "../../redux/slices/appConfigSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function EditProfile() {
  const [userImg, setUserImg] = useState();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axiosClient.post("/user/updateProfile", {
        name,
        bio,
        userImg,
      });

      dispatch(getMyInfo());
      toast.success("Profile Updated Succesfully");
    } catch (e) {
      console.log("Error form update profile ", e);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
      }
    };
  };

  return (
    <div className="wrapper-update-profile">
      <div className="update-profile">
        <Avatar source={userImg ? userImg : ""} />
        <label htmlFor="updatedImage">
          <p className="buttons">Choose File</p>
        </label>
        <input
          type="file"
          id="updatedImage"
          accept="image/*"
          onChange={handleImageChange}
        />

        <form onSubmit={handleSubmit}>
          <label htmlFor="newName">Name</label>
          <input
            type="text"
            id="newName"
            placeholder="Enter New Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label htmlFor="newBio">Bio</label>
          <input
            type="text"
            id="newBio"
            placeholder="Enter Your Description"
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />

          <input class="final" type="submit" value="Update Profile" />
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
