import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { handleLogout, username, decodedToken } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [pic, setPic] = useState(null);
 
 
  useEffect(() => {
    if (decodedToken) {
      setPic(decodedToken.avatar || "default-avatar-url.png"); 
    }
  }, [decodedToken]);


  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user-info">
          {pic && (
            <img
              src={pic}
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
