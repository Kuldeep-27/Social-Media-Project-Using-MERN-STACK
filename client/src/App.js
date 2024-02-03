import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./components/Profile/Profile";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import OnlyIfNotLogIn from "./components/OnlyIfNotLogIn";
import Feed from "./components/Feed/Feed";
import RequireUser from "./components/RequireUser";
import NewPost from "./components/NewPost/NewPost";
import EditProfile from "./components/EditProfile/EditProfile";
import { Toaster } from "react-hot-toast";
import Search from "./components/Search/Search";

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route element={<RequireUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="/updateProfile" element={<EditProfile />} />
          </Route>
          <Route path="/search" element={<Search />} />
        </Route>

        <Route element={<OnlyIfNotLogIn />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
