import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../ContextProvider/ContextProvider';

const Sidebar = () => {
  const { handleLogout, username, selectedAvatar } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar}>{isOpen ? 'Close' : 'Open'} Sidebar</button>
      {isOpen && (
        <div>
          <div className="user-info">
            {selectedAvatar && <img src={selectedAvatar} alt="Avatar" style={{ width: '50px', height: '50px' }} />}
            <span>Logged in as, {username}!</span>
          </div>
          <ul>
            {location.pathname === '/chat' && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {location.pathname === '/profile' && (
              <li>
                <Link to="/chat">Chat</Link>
              </li>
            )}
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
