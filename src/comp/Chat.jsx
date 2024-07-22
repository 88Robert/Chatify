import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";

const Chat = () => {
  const navigate = useNavigate();
  const { handleLogout, username, selectedAvatar } = useContext(Context);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    console.log('Selected Avatar URL:', selectedAvatar); // Add a console log to debug
  }, [selectedAvatar]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div style={{ display: "flex" }}>
      <button
        onClick={toggleSidebar}
        style={{ position: "absolute", top: "10px", left: "10px" }}
      >
        {isSidebarVisible ? "Close Sidebar" : "Open Sidebar"}
      </button>
      {isSidebarVisible && (
        <nav style={{ width: "200px", background: "#f0f0f0", padding: "10px" }}>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            <li style={{ marginBottom: "10px" }}>
              <button onClick={goToProfile}>Profile</button>
            </li>
            <li>
              <button onClick={handleLogoutClick}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
      <div
        style={{
          marginLeft: isSidebarVisible ? "220px" : "0",
          padding: "10px",
        }}
      >
        <h2>
          Welcome, {username} to Chatify!
          {selectedAvatar && (
            <img
              src={selectedAvatar}
              alt="avatar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginLeft: "10px",
              }}
            />
          )}
        </h2>
      </div>
    </div>
  );
};

export default Chat;
