import React, { useState } from "react";
import "./Signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import Avatar from "../../components/Avatar/Avatar";
import toast from "react-hot-toast";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userImg, setUserImg] = useState();

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        console.log("img data", fileReader.result);
      }
    };
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
        userImg,
      });

      toast.success("Register Successfully");
      navigate("/login");
    } catch (e) {
      console.log("Error is ", e);
    }
  }

  return (
    <div className="signup-wrapper">
      <div className="container">
        <h2>SIGN UP</h2>
        <div className="inp-img">
          <Avatar source={userImg} />
          <label htmlFor="img-input">
            <p className="button">Choose File</p>
          </label>
          <input
            type="file"
            id="img-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="box"
            id="username"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="box"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="box"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="box btn">SIGN UP</button>
        </form>
        <p>Already a user? {<NavLink to="/login">Login</NavLink>}</p>
      </div>
    </div>
  );
}

export default Signup;
