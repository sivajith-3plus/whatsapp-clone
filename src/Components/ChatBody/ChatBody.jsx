import React, { useEffect } from 'react'
import './ChatBody.css'
import ChatList from '../ChatList/ChatList'
import ChatContent from '../ChatContent/ChatContent'
// import UserDetails from '../UserDetails/UserDetails'
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { setAllUsers } from '../../Redux/features/allUsers/allUsersSlice';
import { useNavigate } from 'react-router-dom';

const ChatBody = () => {
  const chatMate = useSelector((state) => state.chatMate.data);
  const user = useSelector((state)=>state.user.data.user)
  const dispatch = useDispatch();


  const navigate = useNavigate() 

  useEffect(() => {
    if(!user){
      navigate('/login')
    }
    const apiUrl = "/users/getAll";

    axios.get(apiUrl)
      .then((response) => {
        dispatch(setAllUsers(response.data))
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, navigate, user]);

  return (
    <>
    <div className='chatbody__main'>
        <ChatList />
        {chatMate.userName && <ChatContent chatMate={chatMate}/>}        
    </div>
    </>
  )
}

export default ChatBody