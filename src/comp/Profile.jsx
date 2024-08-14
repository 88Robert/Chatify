import React, { useState, useContext, useEffect } from "react";
import { Context } from "../ContextProvider/ContextProvider";

const Profile = () => {
  const {
    decodedToken,
    updateProfile,
    deleteProfile,
    handlePreview,
    handleSelect,
  } = useContext(Context);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    if (decodedToken) {
      setUsername(decodedToken.user || "");
      setEmail(decodedToken.email || "");
      setAvatar(decodedToken.avatar || "");
      setUserId(decodedToken.id || "");
    }
  }, [decodedToken]);

  const handleAvatarPreview = () => {
    const previewUrl = `https://i.pravatar.cc/150?img=${Math.floor(
      Math.random() * 70
    )}`;
    setPreviewUrl(previewUrl);
    handlePreview(previewUrl);
  };

  const handleAvatarSelect = () => {
    setAvatar(previewUrl);
    handleSelect(previewUrl);
  };

  const handleUpdate = async () => {
    const result = await updateProfile(username, email, avatar, userId);
    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert(`Failed to update profile: ${result.errors.message}`);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const result = await deleteProfile(userId);
      if (result.success) {
        alert("Account deleted successfully.");
      } else {
        alert(`Failed to delete account: ${result.errors.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        {previewUrl && (
          <div>
            <h4>Preview:</h4>
            <img
              src={previewUrl}
              alt="Avatar Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "10px 0",
              }}
            />
            <button onClick={handleAvatarSelect}>Select Avatar</button>
          </div>
        )}
        <button onClick={handleAvatarPreview}>Preview Random Avatar</button>
      </div>
      <button onClick={handleUpdate}>Update Profile</button>
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
