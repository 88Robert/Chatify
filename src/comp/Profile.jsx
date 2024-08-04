import React, { useContext } from 'react';
import { Context } from '../ContextProvider/ContextProvider';

const Profile = () => {
  const { username, selectedAvatar } = useContext(Context);

  return (
    <div>
      <h2>Profile</h2>
      <div>
        {selectedAvatar && <img src={selectedAvatar} alt="Avatar" style={{ width: '50px', height: '50px' }} />}
        <p>Username: {username}</p>
      </div>
    </div>
  );
};

export default Profile;