import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          "https://chatify-api.up.railway.app/csrf",
          {
            method: "PATCH",
          }
        );

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

    fetchCsrfToken();
  }, []);

  const handlePreview = () => {
    setAvatarUrl(
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    );
    console.log('Avatar preview URL:', setAvatarUrl); // kolla på denna den skickar inte med url korrekt. 
  };

  const handleSelect = () => {
    setSelectedAvatar(avatarUrl);
    console.log('Avatar selected:', avatarUrl);
    alert("Avatar selected!");
  };

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
      sessionStorage.setItem("jwtToken", data.token);
      console.log(sessionStorage.getItem("jwtToken"));
      setIsAuthenticated(true);
      setUsername(username);
      return { success: true, data };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, errors: { message: error.message } };
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUsername("");
    setSelectedAvatar("");
  };

  return (
    <Context.Provider
      value={{
        avatarUrl,
        selectedAvatar,
        handlePreview,
        handleSelect,
        registerUser,
        loginUser,
        isAuthenticated,
        handleLogout,
        username
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
