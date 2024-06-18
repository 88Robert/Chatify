import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
        console.log("Fetched CSRF token:", token);
        setCsrfToken(token);
        localStorage.setItem("csrfToken", token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error.message);
        console.error("Response:", error.response || "No response");
      }
    };

    fetchCsrfToken();
  }, []);

  const handlePreview = () => {
    setAvatarUrl(
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    );
  };

  const handleSelect = () => {
    setSelectedAvatar(avatarUrl);
    alert("Avatar selected!");
  };

  const registerUser = async (username, password, email) => {
    const token = localStorage.getItem("csrfToken");
    if (!token) {
      console.error("CSRF token is missing");
      return { success: false, errors: { message: "CSRF token is missing" } };
    }

    console.log("Registering user with CSRF token:", token);

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token, // Include CSRF token in headers
          },
          body: JSON.stringify({
            username,
            password,
            email,
            avatar: selectedAvatar,
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
    const token = localStorage.getItem("csrfToken");
    if (!token) {
      console.error("CSRF token is missing");
      return { success: false, errors: { message: "CSRF token is missing" } };
    }

    console.log("Logging in user with CSRF token:", token);

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token, // Include CSRF token in headers
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }

      const data = await response.json();
      sessionStorage.setItem("jwtToken", data.token);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, errors: { message: error.message } };
    }
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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
