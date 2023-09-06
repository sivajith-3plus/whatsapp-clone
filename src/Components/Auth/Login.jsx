import React, { useState } from "react";
import "./LoginSignUpPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/features/user/userSlice";
import api from "../../Api";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      try {
        response = await api().signin(phoneNumber,password)
      } catch (err) {
        console.log("Unable to fetch the user phone Number and password.");
      }

      const userData = response.data;

      dispatch(setUser(userData));

      navigate("/");
    } catch (err) {
      // Handle login error
      setError("Invalid phone number or password");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="toggle-link" onClick={() => navigate("/signup")}>
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
};

export default Login;
