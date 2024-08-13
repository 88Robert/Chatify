import { useContext, useState, useEffect } from "react";
import { Context } from "../ContextProvider/ContextProvider";

const Chat = () => {
  const { handleLogout, username, decodedToken } = useContext(Context);
  const [pic, setPic] = useState(null);
 
 
  useEffect(() => {
    if (decodedToken) {
      setPic(decodedToken.avatar || "default-avatar-url.png"); 
    }
  }, [decodedToken]);

  return (
    <div>
      <h2>
        Welcome, {username} to Chatify!
        {pic && (
          <img
            src={pic}
            alt="avatar"
            style={{
              width: "50px",
              height: "50px",
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
