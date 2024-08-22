import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Register.css";

// Hämtar relevanta funktioner från context, och låter en användare att registrerar sig. Samt får relevanta felmeddelande.  

const Register = () => {
  const navigate = useNavigate();
  const { avatarUrl, handlePreview, handleSelect, registerUser } =
    useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const goToLogin = () => {
    navigate("/login");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await registerUser(username, password, email);

      if (!result.success) {
        const errorMsg =
          result.errors?.message ||
          "Username or Email is already in use, pls try again. ";
        setErrorMessage(errorMsg);
      } else {
        setSuccessMessage("Registration successful, redirecting to login...");
        setTimeout(goToLogin, 2000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2 className="regTitle">Registrerar dig</h2>
      <form className="submitform" onSubmit={handleSubmit}>
        {successMessage && (
          <div style={{ color: "green", marginBottom: "15px" }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{ color: "red", marginBottom: "15px" }}>
            {errorMessage}
          </div>
        )}

        <div>
          <label>Användare</label>
          <br />
          <input
            className="label"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Lösenord</label>
          <br />
          <input
            className="label"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Email</label>
          <br />
          <input
            className="label"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div
          className="avatar-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <h3>Välj din Avatar</h3>
          <button
            className="btn"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              handlePreview();
            }}
          >
            Förhandsgranska Avatar
          </button>
          {avatarUrl && (
            <div className="avatar-preview" style={{ marginTop: "10px" }}>
              <img
                className="avatar-img"
                src={avatarUrl}
                alt="Avatar Preview"
              />
              <br />
              <button
                className="btn"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleSelect();
                }}
                style={{ marginTop: "10px" }}
              >
                Välj Avatar
              </button>
            </div>
          )}
        </div>
        <br />
        <button className="btn" type="submit">
          Registrera
        </button>
        <br />
        <br />
        <h5>Redan registrerad? Logga in</h5>
        <button className="btn" type="button" onClick={goToLogin}>
          Till Login
        </button>
      </form>
    </div>
  );
};

export default Register;
