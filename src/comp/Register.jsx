import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../ContextProvider/ContextProvider';

const Register = () => {
  const navigate = useNavigate();
  const { avatarUrl, handlePreview, handleSelect, registerUser } = useContext(Context);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const goToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const result = await registerUser(username, password, email);
      console.log(result);
      goToLogin();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2>Registrerar dig</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Användare</label>
          <br />
          <input
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
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div className="avatar-container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Välj din Avatar</h3>
          <button type="button" onClick={(event) => { event.preventDefault(); handlePreview(); }}>
            Förhandsgranska Avatar
          </button>
          {avatarUrl && (
            <div className="avatar-preview" style={{ marginTop: '10px' }}>
              <img src={avatarUrl} alt="Avatar Preview" />
              <br />
              <button type="button" onClick={(event) => { event.preventDefault(); handleSelect(); }} style={{ marginTop: '10px' }}>
                Välj Avatar
              </button>
            </div>
          )}
        </div>
        <br />
        <button type="submit">Registrera</button>
        <br />
        <br />
        <h5>Redan registrerad? Logga in</h5>
        <button type="button" onClick={goToLogin}>Till Login</button>
      </form>
    </div>
  );
};

export default Register;
