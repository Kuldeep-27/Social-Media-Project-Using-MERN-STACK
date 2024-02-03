import React from "react";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/localManager";
import { Navigate, Outlet } from "react-router-dom";

function OnlyIfNotLogIn() {
  const user = getItem(KEY_ACCESS_TOKEN);
  return user ? <Navigate to="/" /> : <Outlet />;
}

export default OnlyIfNotLogIn;
