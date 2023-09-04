import { configureStore } from '@reduxjs/toolkit'
import allUsersSlice from './features/allUsers/allUsersSlice'
import userSlice from './features/user/userSlice'
import chatMateSLice from './features/chatMate/chatMateSLice'
import messagesSlice from './features/messages/messagesSlice'
import allMessages from './features/allMessages/allMessages'

export const store = configureStore({
  reducer: {
    allUsers : allUsersSlice,
    user:userSlice,
    chatMate:chatMateSLice,
    messages:messagesSlice,
    allMessages:allMessages
  },
})