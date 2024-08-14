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

  const handlePreview = () => {
    setAvatarUrl(
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    );
    console.log("Avatar preview URL:", setAvatarUrl); // kolla på denna den skickar inte med url korrekt.
  };

  const handleSelect = () => {
    setSelectedAvatar(avatarUrl);
    console.log("Avatar selected:", avatarUrl);
    alert("Avatar selected!"); // kolla på denna den skickar inte med url korrekt.
  };

  const decodeJwt = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
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
      const token = data.token;
      sessionStorage.setItem("jwtToken", token);
      const decodedJwt = decodeJwt(token);
      setDecodedToken(decodedJwt); 
      console.log(decodedJwt);
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
    setDecodedToken(null);
    fetchCsrfToken();
  };

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
        username,
        decodedToken,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
