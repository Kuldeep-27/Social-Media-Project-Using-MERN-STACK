import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localManager";

import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      toast.success("Login Successfully");

      setItem(KEY_ACCESS_TOKEN, response.result.token);
      navigate("/");
    } catch (e) {
      console.log("Error is ", e);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="container-login">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="box-login"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="box-login"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="box-login btn-login">LOGIN</button>
        </form>
        <p>Don't have account? {<NavLink to="/signup">Signup</NavLink>}</p>
      </div>
    </div>
  );
}

export default Login;
