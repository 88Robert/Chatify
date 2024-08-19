import React, { useState, useContext, useEffect } from "react";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Profile.css";

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
        <label className="label1">
          Username:
          <input
            className="input-profile"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <br />
      <div>
        <label className="label2">
          Email:
          <input
            className="input-profile1"
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
              className="profile-img"
              src={previewUrl}
              alt="Avatar Preview"
            />
            <br />
            <button className="profile-btn" onClick={handleAvatarSelect}>
              Select Avatar
            </button>
          </div>
        )}
        <br />
        <button className="profile-btn" onClick={handleAvatarPreview}>
          Preview Random Avatar
        </button>
      </div>
      <br />
      <button className="profile-btn" onClick={handleUpdate}>
        Update Profile
      </button>
      <br />
      <br />
      <button className="btn-delete" onClick={handleDelete}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
