import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { handleLogout, username, selectedAvatar } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user-info">
          {selectedAvatar && (
            <img
              src={selectedAvatar}
              alt="Avatar"
              style={{ width: "50px", height: "50px" }}
            />
          )}
          <span className="loggedin">Logged in as, {username}!</span>
        </div>
        <ul>
          {location.pathname === "/chat" && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {location.pathname === "/profile" && (
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          )}
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
