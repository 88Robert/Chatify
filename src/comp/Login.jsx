import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Login.css";

// Hämtar funktion från context som låter dig att logga in med en skapad användare. Och även ger relevant felmedelande.

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await loginUser(username, password);
    if (result.success) {
      setSuccessMessage("Login successful. Redirecting...");
      setErrors(null);
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } else {
      setErrors("Invalid username or password.");
      setSuccessMessage("");

      setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const goToRegister = () => {
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <br />
        <br />
        <input
          className="input"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <input
          className="input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button className="button" type="submit">
          Login
        </button>
        {successMessage && (
          <div style={{ color: "green", marginTop: "20px" }}>
            {successMessage}
          </div>
        )}

        {errors && (
          <div style={{ color: "red", marginTop: "20px" }}>{errors}</div>
        )}
        <h5>Tillbaka till registrering</h5>
        <button className="button" type="button" onClick={goToRegister}>
          Tillbaka
        </button>
      </form>
    </div>
  );
};

export default Login;
