import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate("/");
      };

  return (
    <>
      <div>
        <form action="">
        <h2>Login</h2>
        <br />
        <br />
        <input
          type="text"
          placeholder="username"
       
        />
        <br />
        <input
          type="password"
          placeholder="password"
     
        />
        <br />
        <br />
        <button>Login</button>
    
        <h5>Tillbaka till registrering</h5>
        <button onClick={goToRegister}>Tillbaka</button>
      </form>
      </div>
    
    </>
  );
};

export default Login;
