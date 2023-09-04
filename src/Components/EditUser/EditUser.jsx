import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {  updateUser } from "../../Redux/features/user/userSlice";

const EditUser = () => {
  const user = useSelector((state) => state.user.data.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState(user); // Create a separate state for the updated user
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.put("/users/updateUserData", { updatedUser });

      dispatch(updateUser(updatedUser));

      console.log("User data updated successfully:", response.data);
      navigate("/"); 
    } catch (err) {
      // Handle update error
      setError("Failed to update user data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit User</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={updatedUser.userName}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phoneNumber"
            value={updatedUser.phoneNumber}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Password" 
            name="password"
            value={updatedUser.password}
            onChange={handleInputChange}
          />
          <input
            type="url"
            placeholder="Image URL"
            name="profilePic"
            value={updatedUser.profilePic}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="About"
            name="about"
            value={updatedUser.about}
            onChange={handleInputChange}
          />
          <button type="submit">Save Changes</button>
        </form>
        <p className="toggle-link" onClick={() => navigate("/profile")}>
          Back to Profile
        </p>
      </div>
    </div>
  );
};

export default EditUser;
