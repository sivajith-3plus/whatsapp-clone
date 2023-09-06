import React, { useEffect, useState } from "react";
import "./ChatNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faComment, faL } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { deleteChat } from "../../Redux/features/messages/messagesSlice";
import socket from "../../socket";
import api from "../../Api";

const UserSettings = ({ setIsSettingsVisible }) => {
  const chatMate = useSelector((state) => state.chatMate.data);
  const user = useSelector((state) => state.user.data.user);
  const [isBlocked, setIsblocked] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("chat deleted", () => {
      console.log("Chat has been deleted.");
      dispatch(deleteChat({ senderId: user._id, receiverId: chatMate._id }));
    });

    return () => {
      socket.off("chat deleted");
    };
  }, []);

  useEffect(() => {
    if (user.blockedUsers.includes(chatMate._id)) {
      setIsblocked(true);
    } else {
      setIsblocked(false);
    }
  }, [chatMate]);

  const handleDelete = async () => {
    try {
      socket.emit("delete chat");
      api().deleteChats(user._id, chatMate._id)

      setIsSettingsVisible(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleBlock = async () => {
    try {
      if (!isBlocked) {
        await api().blockUser(user._id,chatMate._id)
        socket.emit('block',{blockedId:chatMate._id,blockerId:user._id})
      } else {
        await api().unBlockUser(user._id,chatMate._id)
        socket.emit('unblock',{blockedId:chatMate._id,blockerId:user._id})
      }
      setIsblocked(!isBlocked)
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <>
      <div className="user__setting__main">
        <div className="user__settings__item" onClick={handleDelete}>
          Delete chat
        </div>
        {user._id!=chatMate._id && <><div className="user__settings__item" onClick={handleBlock}>
          {isBlocked ? "Unblock" : "block"}
        </div>
        <div className="user__settings__item">Report</div></>}
        
      </div>
    </>
  );
};

const ChatNav = (props) => {
  const navigate = useNavigate();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  return (
    <>
      {isSettingsVisible && (
        <UserSettings setIsSettingsVisible={setIsSettingsVisible} />
      )}
      <div className="chat__nav__main">
        <div className="profile__img">
          <img
            src={
              props.profilePic
                ? props.profilePic
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
          />
        </div>
        {props.name && (
          <p onClick={() => props.setIsVisible(!props.isVisible)}>
            {props.name}
          </p>
        )}
        <div className="nav__menu">
          {props.isContent ? (
            ""
          ) : (
            <FontAwesomeIcon
              icon={faComment}
              onClick={() => props.setIsAllUsers(!props.isAllusers)}
            />
          )}
          <div onClick={handleSettingsClick}>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div></div>
        </div>
      </div>
      {props.isContent ? (
        ""
      ) : (
        <div className="nav__search__body">
          <input
            className="nav__search"
            placeholder="search or start new chat"
          />
        </div>
      )}
    </>
  );
};

export default ChatNav;
