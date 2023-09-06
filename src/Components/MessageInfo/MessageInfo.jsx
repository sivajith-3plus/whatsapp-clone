import React, { useEffect } from "react";
import "./MessageInfo.css";

const MessageInfo = ({  setIsMessageDetails,  message,  setSelectedMessageId,}) => {
  console.log(message);

  useEffect(()=>{
   console.log('message',message);
  },[message])

  return (
    <div
      onClick={() => {
        setIsMessageDetails(false);
        setSelectedMessageId(null);
      }}
    >
      <div>{message.content} </div>
      <div>delivered</div>
      <div>seen - {formatTimestamp(message.timeOfSeen)}</div>
    </div>
  );
};
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  }
  
export default MessageInfo;
