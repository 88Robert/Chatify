import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { handleLogout, decodedToken } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [decodedUser, setDecodedUser] = useState(null);

  useEffect(() => {
    const decoded = sessionStorage.getItem("decodedToken");
    if (decoded) {
      setDecodedUser(JSON.parse(decoded));
    } else {
      setDecodedUser(decodedToken);
    }
  }, []);

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user-info">
          {decodedUser && (
            <img
              src={decodedUser.avatar}
              alt="Avatar"
              style={{ width: "50px", height: "50px" }}
            />
          )}
          <span className="loggedin">
            Logged in as, {decodedUser && decodedUser.user}!
          </span>
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
