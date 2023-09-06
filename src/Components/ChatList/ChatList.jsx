import React, { useState } from "react";
import "./ChatList.css";
import ChatNav from "../ChatNav/ChatNav";
import ChatListItems from "./ChatListItems";
import { useSelector } from "react-redux";

const ChatList = () => {
  const user = useSelector((state) => state.user.data.user);
  const [isAllusers,setIsAllUsers] = useState(false)

  return (
    <div className="chat__list__main">
      <ChatNav profilePic={user && user.profilePic} setIsAllUsers={setIsAllUsers} isAllusers={isAllusers}/>
      <div className="chat__list__items__area">
        <ChatListItems isAllusers={isAllusers}/>
      </div>
    </div>
  );
};

export default ChatList;
