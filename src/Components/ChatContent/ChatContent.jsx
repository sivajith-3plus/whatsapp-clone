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
import { addChatMateBlocker } from "../../Redux/features/chatMate/chatMateSLice";
import MessageInfo from "../MessageInfo/MessageInfo";

const ChatContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const chatMate = useSelector((state) => state.chatMate.data);
  const user = useSelector((state) => state.user.data.user);
  const messages = useSelector((state) => state.messages.data);
  const [isBlocked, setIsblocked] = useState(false);
  const [isMessageDetails, setIsMessageDetails] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log("hii", chatMate);
    if (chatMate.blockedUsers.includes(user._id)) {
      setIsblocked(true);
    } else {
      setIsblocked(false);
    }
  }, [chatMate]);

  

  console.log(messages);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      dispatch(setMessages([...messages, data]));
      console.log(messages);
      // dispatch(updateIsSeen({ userId: user._id, chatMateId: chatMate._id }));
      console.log("socket received message", data);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("unblocked", ({ blockedId, blockerId }) => {
      console.log("unblocked");
      if (chatMate._id === blockerId && user._id == blockedId) {
        setIsblocked(false);
        chatMate.blockedUsers.filter((val) => val !== blockedId);
      }
    });

    socket.on("blocked", ({ blockedId, blockerId }) => {
      if (chatMate._id === blockerId && user._id == blockedId) {
        setIsblocked(true);
        dispatch(addChatMateBlocker(user._id));
      }
    });

    socket.on('chat deleted',()=>{
      console.log('chat deleted');
      dispatch(setMessages([]))
    })

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("unblocked");
    };
  }, [chatMate._id, dispatch, messages]);

  const [inputMessage, setInputMessage] = useState("");

  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };

  socket.emit("onChat", () => {});

  // Function to mark a message as seen
  const markMessageAsSeen = async (messageId) => {
    console.log('message id',messages);
    try {
      dispatch(updateIsSeen({ userId: user._id, chatMateId: chatMate._id }));
      console.log("called");
      await axios.patch(`/messages/updateSeen/${messageId}`);
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  };

  const handleSend = () => {
    if (isBlocked && inputMessage == null) {
      return 0;
    }
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
          // onClick={() => setIsVisible(!isVisible)}
          style={{ cursor: "pointer" }}
        >
          <ChatNav
            isContent={true}
            name={chatMate ? chatMate.userName : ""}
            profilePic={chatMate ? chatMate.profilePic : ""}
            setIsVisible={setIsVisible}
            isVisible={isVisible}
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

                if (message.senderId === user._id && !message.isSeen) {
                  markMessageAsSeen(message);
                }

                return (
                  <div
                    className={`chat__text ${chatTextClass}`}
                    key={message._id}
                  >
                    <i
                      className="fas fa-info-circle"
                      onClick={() => {
                        setIsMessageDetails(!isMessageDetails);
                        setSelectedMessageId(message._id);
                      }}
                    ></i>

                    {selectedMessageId === message._id ? (
                      <MessageInfo
                        setIsMessageDetails={setIsMessageDetails}
                        setSelectedMessageId={setSelectedMessageId}
                        message={message}
                      />
                    ) : (
                      <>
                        <p>{message.content}</p>
                        {message.isDelivered && !message.isSeen && (
                          <span className="delivery-indicator">✓✓</span>
                        )}
                        {message.isSeen===true && message.senderId === user._id && (
                          <span className="seen-indicator">✓✓</span>
                        )}
                        <span className="timestamp">
                          {formatTimestamp(message.createdAt)}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            {isBlocked && <div className="blocked">the user blocked you</div>}
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
              disabled={isBlocked}
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
