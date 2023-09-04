import React, { useState } from 'react';
import './LoginSignUpPage.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'; // Import Axios for making API requests

const SignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setprofilePic] = useState('');
  const [about, setAbout] = useState('');
  const [userName, setUsername] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log('hi');
    try {
      const response = await Axios.post('/auth/signup', {
        credentials: {
          phoneNumber,
          password,
          profilePic,
          about,
          userName,
        },
      });

      const newUser = response.data.newUser;

      console.log('newUser',newUser);
      navigate('/login');
    } catch (err) {
      // Handle sign-up error
      setError('Failed to sign up. Please try again.');
    }
  };
  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text" // Change type to "text" for the "Username" input
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)} // Update "username" state
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="url"
            placeholder="Image URL"
            value={profilePic}
            onChange={(e) => setprofilePic(e.target.value)}
          />
          <input
            type="text"
            placeholder="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className='toggle-link' onClick={()=>navigate('/login')}>Already have an account? Log In</p>
      </div>
    </div>
  );
};

export default SignUp;