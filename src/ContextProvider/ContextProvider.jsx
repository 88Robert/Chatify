import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState("");

  // Hanterar CSRF anrop och hämtar direkt när man startar sidan via en useEffect

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch CSRF token: ${errorText}`);
      }

      const data = await response.json();
      const token = data.csrfToken;
      console.log("CSRF token", token);
      setCsrfToken(token);
      localStorage.setItem("csrfToken", token);
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // ________________________________________________________________

  // Hanterar att man kan förhandgranska avatar, och att välja avatar.

  const handlePreview = () => {
    setAvatarUrl(
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    );
    console.log("Avatar preview URL:", setAvatarUrl);
  };

  const handleSelect = () => {
    setSelectedAvatar(avatarUrl);
    console.log("Avatar selected:", avatarUrl);
    alert("Avatar selected!");
  };

  //__________________________________________________________________

  // Tar ut information från en JWT Token, där man ser all nödvändigt info om en användare.

  const decodeJwt = (token) => {
    try {
      const decoded = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return decoded;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  // _______________________________________________________________

  // Registrerar nya användare via API anrop.

  const registerUser = async (username, password, email) => {
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            avatar: selectedAvatar,
            csrfToken: csrfToken,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  // ____________________________________________________

  /* Hanterar att logga in med sin CSRF token, och tar emot samt lagrar och decodar JWT Token i session storage. 
  Och även ser till att man håller sig inloggad efter att man har uppdaterat. */

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, csrfToken }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }

      const data = await response.json();
      const token = data.token;
      sessionStorage.setItem("jwtToken", token);
      const decodedJwt = decodeJwt(token);
      setDecodedToken(decodedJwt);
      sessionStorage.setItem("decodedToken", JSON.stringify(decodedJwt));
      getConversations(decodedJwt);
      console.log(decodedJwt);
      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", true);
      setUsername(username);
      return { success: true, data };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  //_____________________________________________________

  // Logga ut function som hanterar att känslig data såsom anvädnarinfo samt token försvinner

  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUsername("");
    setSelectedAvatar("");
    setDecodedToken(null);
    fetchCsrfToken();
  };

  //______________________________________________________

  // HAnterar att ha möjligheten till att kunna uppdatera användarinfo. 

  const updateProfile = async (newUsername, newEmail, newAvatar, userId) => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          updatedData: {
            username: newUsername,
            email: newEmail,
            avatar: newAvatar,
          },
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {}
        throw new Error(`Failed to update profile: ${errorData}`);
      }

      const data = await response.json();

      setUsername(newUsername);
      setEmail(newEmail);
      setSelectedAvatar(newAvatar);

      return { success: true, data };
    } catch (error) {
      console.error("Update profile failed:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  //_______________________________________________________

  //Möjligör att kunna radera inloggad user, och blir då utloggad och din profil försvinner. 

  const deleteProfile = async (userId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }

      handleLogout();
      return { success: true };
    } catch (error) {
      console.error("Failed to delete profile:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  //______________________________________________________________

  // Hanterar att kunna hämta ut meddelande som både är lokala samt i en conversation. 

  const fetchMessages = async (conversationId) => {
    try {
      const url = conversationId
        ? `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`
        : "https://chatify-api.up.railway.app/messages";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch messages.");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getConversations = async (decodedJwt) => {
    try {
      const conversations = decodedJwt.invite;
      if (conversations) {
        const parsedConvos = JSON.parse(conversations);
        setConversations(parsedConvos);
      }
    } catch (error) {
      console.error("Error getting conversations:", error);
    }
  };

  const switchConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    fetchMessages(conversationId);
  };

  const sendMessage = async (messageContent) => {
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({
            text: messageContent,
            conversationId: currentConversationId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send message:", errorData);
        return { success: false, errors: errorData };
      }

      const res = await response.json();
      return { success: true, latestMessage: res.latestMessage };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${msgId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== msgId)
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to delete message:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const sendInvitation = async (userId) => {
    const conversationId = generateUUID();

    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/invite/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ conversationId: conversationId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      const data = await response.json();
      console.log("Invitation sent successfully:", data.message);
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  return (
    <Context.Provider
      value={{
        avatarUrl,
        selectedAvatar,
        fetchAllUsers,
        getConversations,
        handlePreview,
        handleSelect,
        registerUser,
        loginUser,
        isAuthenticated,
        handleLogout,
        username,
        decodedToken,
        updateProfile,
        deleteProfile,
        messages,
        setMessages,
        fetchMessages,
        sendMessage,
        deleteMessage,
        users,
        sendInvitation,
        generateUUID,
        switchConversation,
        conversations,
        currentConversationId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
