import { useContext, useState, useEffect } from "react";
import { Context } from "../ContextProvider/ContextProvider";

const Chat = () => {
  const { handleLogout, username, selectedAvatar } = useContext(Context);

  useEffect(() => {
    console.log("Selected Avatar URL:", selectedAvatar); // Add a console log to debug
  }, [selectedAvatar]);

  return (
    <div>
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
  );
};

export default Chat;
