import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import "./Search.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/slices/appConfigSlice";

function Search() {
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      searchUser({
        query: item,
      })
    );
  }, [item]);

  const searchResult = useSelector(
    (state) => state.appConfigReducer.searchItem
  );

  return (
    <div className="search-wrapper">
      <div className="search">
        <IoArrowBack className="child1" onClick={() => navigate("/")} />
        <div className="search-items child2">
          <input
            type="text"
            placeholder="search..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          {searchResult &&
            searchResult.map((item) => (
              <NavLink
                to={`/profile/${item.userId}`}
                className="atom"
                key={item.userId}
              >
                {item.name}
              </NavLink>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
