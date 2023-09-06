import React, { useEffect } from "react";
import "./UserDetails.css";
import options from "./userAboutOptions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDetails = ({ chatMate, setIsVisible, isVisible }) => {
  const user = useSelector((state) => state.user.data.user);
const navigate = useNavigate()

  function handleEdit(){
    navigate('/editUser')
  }

  useEffect(() => {
    setIsVisible(true);
  }, [setIsVisible]);
  function handleClose() {
    setIsVisible(false);
  }

  if (!isVisible) {
    return null; 
  }

  return (
    <div className="user__details__main">
      <div className="user__details__nav">
        <i className="fas fa-times" onClick={handleClose}></i>
        Contact Info
      </div>
      <div className="user__profile__details">
        <div className="user__profile__image">
          <img src={chatMate.profilePic  || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="" />
        </div>
        <h3>{chatMate.userName}</h3>
        <h4>
          {chatMate.phoneNumber}{chatMate._id === user._id &&  <i className="fas fa-pencil-alt" onClick={handleEdit}></i>}
        </h4>
      </div>
      <div className="user__about">
        <h5>About</h5>
        <h4>{chatMate.about}</h4>
      </div>
      <div className="user__options">
        {options.map((option, index) => (
          <div className="user__option__type" key={index}>
            <div className="user__option__type__title">
              <i className={option.icon}></i>
              <div>
                <h4>{option.title}</h4>
                {option.subtitle && <p>{option.subtitle}</p>}
              </div>
            </div>
            {option.chevron && <i className="fas fa-chevron-right"></i>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
