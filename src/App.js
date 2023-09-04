import React from "react";
import "./App.css";
import ChatBody from "./Components/ChatBody/ChatBody";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/Signup";
import axios from "axios";
import EditUser from "./Components/EditUser/EditUser";

// axios settings
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.params = {};

const App = () => {
  return (
    <div className="__main">
      <Routes>
        <Route path="/" element={<ChatBody />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/editUser" element={<EditUser />} />
      </Routes>
    </div>
  );
};

export default App;
