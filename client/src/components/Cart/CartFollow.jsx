import React from "react";
import "./CartFollow.css";

import Avatar from "../Avatar/Avatar";
import { NavLink } from "react-router-dom";

function CartFollow({ onClos, followers, msg }) {
  return (
    <div className="Cart-Follow">
      <div className="overlay" onClick={onClos}></div>
      <div className="cart-content">
        <div className="btn-primary" onClick={onClos}>
          Close
        </div>
        <h2>{msg === "Followers" && "Followers"}</h2>
        <h2>{msg === "Likes" && "Likes"}</h2>
        <h2>{msg === "Followings" && "Followings"}</h2>

        {followers.map((follower) => {
          return (
            <div className="follow-wrapper">
              <NavLink to={`/profile/${follower.Id}`} onClick={onClos}>
                {" "}
                <Avatar source={follower.url} />
              </NavLink>

              <p>{follower.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartFollow;
