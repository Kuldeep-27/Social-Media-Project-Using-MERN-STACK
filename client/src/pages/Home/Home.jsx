import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import {
  getMyInfo,
  getPostOfFollowing,
} from "../../redux/slices/appConfigSlice";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyInfo());
    dispatch(getPostOfFollowing());
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Home;
