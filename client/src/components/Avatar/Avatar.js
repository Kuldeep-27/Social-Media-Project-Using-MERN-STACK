import React from "react";
import avatar from "../../resources/user.png";
import "./Avatar.css";

function Avatar(prop) {
  return (
    <div>
      <div className="avatar-container">
        <img src={prop.source ? prop.source : avatar} alt="user image" />
        {prop.name && <span>{prop.name}</span>}
      </div>
    </div>
  );
}

export default Avatar;
