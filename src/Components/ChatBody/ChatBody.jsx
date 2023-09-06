import React, { useEffect } from "react";
import "./ChatBody.css";
import ChatList from "../ChatList/ChatList";
import ChatContent from "../ChatContent/ChatContent";
// import UserDetails from '../UserDetails/UserDetails'
import { useDispatch, useSelector } from "react-redux";
import axios, { all } from "axios";
import { setAllUsers } from "../../Redux/features/allUsers/allUsersSlice";
import { useNavigate } from "react-router-dom";
import { setBlockedUsers } from "../../Redux/features/blockedUsers/blockedUsersSLice";
import api from "../../Api";

const ChatBody = () => {
  const chatMate = useSelector((state) => state.chatMate.data);
  const user = useSelector((state) => state.user.data.user);
  const allUsers = useSelector((state) => state.allUsers.data);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    api()
      .getALlUsers()
      .then((response) => {
        dispatch(setAllUsers(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (allUsers.length > 0 && user) {
      let blockedUsers = allUsers.filter((val) =>
        user.blockedUsers.includes(val._id)
      );
      dispatch(setBlockedUsers(blockedUsers));
    }
  }, [user, allUsers]);

  return (
    <div className="chatbody__main">
      <ChatList />
      {chatMate.userName && <ChatContent chatMate={chatMate} />}
    </div>
  );
};

export default ChatBody;
