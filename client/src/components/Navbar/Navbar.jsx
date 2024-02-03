import React from "react";
import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.appConfigReducer.myProfile);
  const Id = profile?.Id;

  return (
    <div>
      <div className="contain">
        <h2 className="child1">SOCIOGRAM</h2>
        <ul className="child2">
          <li>
            <MdHome
              onClick={() => {
                navigate("/");
              }}
            />
          </li>
          <li>
            <FaPlus
              onClick={() => {
                navigate("/newPost");
              }}
            />
          </li>
          <li>
            <FaSearch onClick={() => navigate("/search")} />
          </li>
          <li>
            <FaUserCircle
              onClick={() => {
                navigate(`/profile/${Id}`);
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
