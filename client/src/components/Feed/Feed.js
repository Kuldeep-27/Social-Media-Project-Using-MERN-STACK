import React, { useEffect, useState } from "react";
import "./Feed.css";
import Post from "../Post/Post";
import Avatar from "../Avatar/Avatar";
import { axiosClient } from "../../utils/axiosClient";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Feed() {
  const [users, setUsers] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/user/allUser");
        setUsers(response.result.users);
       
      } catch (e) {
        console.log("Here is error ", e);
      }
    };
    fetchData();
  }, []);

  const userPosts = useSelector((state) => state.appConfigReducer.userPosts);

  return (
    <div className="feed-main-container">
      <div className="feed-container">
        <div className="left-part">
          {userPosts?.length > 0 ? (
            userPosts.map((item) => (
              <Post key={item.caption} post={item} Id={item.Id} />
            ))
          ) : (
            <h2 style={{ display: "flex", justifyContent: "center" }}>
              No Post of Followings finds
            </h2>
          )}
        </div>

        <div className="right-part">
          <h2>Users</h2>
          {users?.length > 0 ? (
            users.map((user) => (
              <NavLink to={`/profile/${user._id}`} className="Nav-Link">
                <Avatar
                  key={user._id}
                  source={user.avatar.url}
                  name={user.name}
                />
              </NavLink>
            ))
          ) : (
            <h3>No Users</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
