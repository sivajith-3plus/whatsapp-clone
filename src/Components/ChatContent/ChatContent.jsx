import React, { useEffect, useRef, useState } from "react";
import ChatNav from "../ChatNav/ChatNav";
import "./ChatContent.css";
// import data from "./chatData"; // Replace with your actual data from Redux
import UserDetails from "../UserDetails/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setMessages,
  updateIsSeen,
} from "../../Redux/features/messages/messagesSlice";
import socket from "../../socket";

const ChatContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const chatMate = useSelector((state) => state.chatMate.data);
  const user = useSelector((state) => state.user.data.user);
  const messages = useSelector((state) => state.messages.data);
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      dispatch(setMessages([...messages, data]));
      console.log(messages);
      // dispatch(updateIsSeen({ userId: user._id, chatMateId: chatMate._id }));
      console.log("socket received message", data);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatMate._id, dispatch, messages]);

  const [inputMessage, setInputMessage] = useState("");

  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };

  socket.emit("onChat", () => {
  });

  // Function to mark a message as seen
  const markMessageAsSeen = async (messageId) => {
    try {
      dispatch(updateIsSeen({ userId: user._id, chatMateId: chatMate._id }));
      console.log("called");
      await axios.patch(`/messages/updateSeen/${messageId}`);
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  };

  const handleSend = () => {
    socket.emit("send_message", {
      content: inputMessage,
      senderId: user._id,
      receiverId: chatMate._id,
      isDelivered: false,
      isSeen: false,
      createdAt: new Date(),
    });
    axios.post("/messages/send", {
      content: inputMessage,
      senderId: user._id,
      receiverId: chatMate._id,
      isDelivered: false,
      isSeen: false,
    });
    setInputMessage("");
  };

  useEffect(() => {
    // socket.on("msgSeen", () => {
    //   dispatch(updateIsSeen({ userId: user._id, chatMateId: chatMate._id }));
    // });

    // return () => {
    //   // Clean up the socket event listener
    //   socket.off("msgSeen");
    // };
  }, [messages, user._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  

  useEffect(() => {
    console.log("socket triggeres");
    axios
      .get("/messages/getMessages", {
        params: { senderId: user._id, receiverId: chatMate._id },
      })
      .then((response) => {
        dispatch(setMessages(response.data));
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [user._id, chatMate._id, dispatch]);

  return (
    <>
      <div className="chat__content__main">
        <div
          onClick={() => setIsVisible(!isVisible)}
          style={{ cursor: "pointer" }}
        >
          <ChatNav
            isContent={true}
            name={chatMate ? chatMate.userName : ""}
            profilePic={chatMate ? chatMate.profilePic : ""}
          />
        </div>
        <div className="chat__text__area" ref={chatContainerRef}>
          <div className="chat__text__container">
            {messages
              .filter(
                (message) =>
                  (message.senderId === user._id &&
                    message.receiverId === chatMate._id) ||
                  (message.senderId === chatMate._id &&
                    message.receiverId === user._id)
              )
              .map((message) => {
                const chatTextClass =
                  message.senderId === user._id ? "right" : "left";
                // Mark the message as seen when it is displayed

                  if (message.senderId === user._id && !message.isSeen) {
                    markMessageAsSeen(message._id);
                  }

                return (
                  <div
                    className={`chat__text ${chatTextClass}`}
                    key={message._id}
                  >
                    <p>{message.content}</p>
                    {message.isDelivered && !message.isSeen && (
                      <span className="delivery-indicator">Delivered</span>
                    )}
                    {message.isSeen && message.senderId === user._id && (
                      <span className="seen-indicator">Seen</span>
                    )}
                    <span className="timestamp">
                      {formatTimestamp(message.createdAt)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="chat__input">
          <i className="fas fa-smile"></i>
          <i className="fas fa-plus"></i>
          <div className="text__input__area">
            <input
              type="text"
              onChange={handleInput}
              value={inputMessage}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />{" "}
            <i className="fas fa-paper-plane" onClick={handleSend}></i>{" "}
            {/* Add the send icon */}
          </div>
          <i className="fas fa-microphone"></i>
        </div>
      </div>
      {isVisible && (
        <UserDetails
          chatMate={chatMate}
          setIsVisible={setIsVisible}
          isVisible={isVisible}
        />
      )}
    </>
  );
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

export default ChatContent;
