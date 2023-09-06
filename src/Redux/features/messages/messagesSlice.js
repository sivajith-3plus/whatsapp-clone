import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.data = action.payload;
    },
    updateIsSeen: (state, action) => {
      const { userId, chatMateId } = action.payload;
      console.log(userId, chatMateId);
      state.data = state.data.map((message) => {
        if (message.senderId === userId && message.receiverId === chatMateId) {
          return {
            ...message,
            isSeen: true,
          };
        }
        return message;
      });
    },
    deleteChat: (state, action) => {
      const { senderId, receiverId } = action.payload;
      state.data = state.data.filter(
        (message) =>
          !(
            (message.senderId === senderId && message.receiverId === receiverId) ||
            (message.senderId === receiverId && message.receiverId === senderId)
          )
      );
    },
  },
});

export const { setMessages, updateIsSeen, deleteChat } = messagesSlice.actions;

export default messagesSlice.reducer;
