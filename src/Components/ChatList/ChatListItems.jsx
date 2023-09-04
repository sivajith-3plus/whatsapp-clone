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

const ChatListItems = () => {
  const data = useSelector((state) => state.allUsers.data);
  const user = useSelector((state) => state.user.data.user);

  let allUsers = data.map((obj) => ({ ...obj })); 

  const dispatch = useDispatch();

  useEffect(() => {
    const apiUrl = "/messages/getAllMessages";
    axios
      .get(apiUrl)
      .then((response) => {
        const messages = response.data;
        dispatch(setAllMessages(messages));

        // Find the last message sent by the user and set it as the lastMessage for each user in allUsers
        allUsers.forEach((obj) => {
          const lastMessage = messages
            .filter((message) => message.senderId === user._id && message.receiverId === obj._id)
            .sort((a, b) => b.createdAt - a.createdAt)[0]; // Get the latest message
          
          if (lastMessage) {
            obj.lastMessage = lastMessage.content;
          }
        });
        console.log(allUsers);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  const handleChatMateClick = (obj) => {
    console.log("chatmate", obj);
    dispatch(setChatMate(obj));
    dispatch(updateIsSeen({ userId: user._id, chatMateId: obj._id }));
  };

  return (
    <>
      {allUsers.map((obj) => (
        <div
          key={obj._id} // Use a unique key
          className="chat__list__items"
          onClick={() => handleChatMateClick(obj)}
        >
          <div className="chat__list__items__profile__img">
            <img src={obj.profilePic} alt="profile" />
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
