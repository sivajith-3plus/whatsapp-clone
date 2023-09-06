import React, { useEffect } from "react";
import "./ChatList.css";
import { useSelector, useDispatch } from "react-redux";
import { setChatMate } from "../../Redux/features/chatMate/chatMateSLice";
import {
  setMessages,
  updateIsSeen,
} from "../../Redux/features/messages/messagesSlice";
import axios, { all } from "axios";
import { setAllMessages } from "../../Redux/features/allMessages/allMessages";
import { setChatFriends } from "../../Redux/features/chatFriends/chatFriendsSlice";
const constant = require('../Constant/ApiConstant');

const ChatListItems = ({isAllusers}) => {
  const data = useSelector((state) => state.allUsers.data);
  const user = useSelector((state) => state.user.data.user);
  const chatFriends = useSelector((state)=> state.chatFriends.data)
  const messages = useSelector((state) => state.messages.data);


  const dispatch = useDispatch();

  useEffect(() => {
    const {apiUrl} = constant;
    axios
      .get(apiUrl)
      .then((response) => {
        const messages = response.data;
        dispatch(setAllMessages(messages));

        // Filter chatFriends based on messages only if data is not empty
        if (data.length > 0 && user._id ) {
          const updatedChatFriends = data.filter((allUsers) => {
            return messages.some(
              (message) =>
                (message.senderId === user._id && message.receiverId === allUsers._id) ||
                (message.senderId === allUsers._id && message.receiverId === user._id)
            );
          });
          dispatch(setChatFriends(updatedChatFriends));
        }
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [data, user, dispatch,messages]);

  let allUsers = data.map((obj) => ({ ...obj })); 

  let usersToDisplay = isAllusers ? data : chatFriends

  const handleChatMateClick = (obj) => {
    console.log("chatmate", obj);
    dispatch(setChatMate(obj));
    dispatch(updateIsSeen({ userId: user._id, chatMateId: obj._id }));
    
  };

  return (
    <>
      {usersToDisplay.map((obj) => (
        <div
          key={obj._id} // Use a unique key
          className="chat__list__items"
          onClick={() => handleChatMateClick(obj)}
        >
          <div className="chat__list__items__profile__img">
            <img src={obj.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="profile" />
          </div>
          <div className="chat__list__items__details">
            <div className="chat__list__items__title">
              <h5>{obj.userName}</h5>
              <h6>{obj.date}</h6>
            </div>
            <div>
              <p>{obj.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatListItems;
