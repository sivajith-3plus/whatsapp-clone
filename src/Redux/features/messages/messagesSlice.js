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
  },
});

export const { setMessages, updateIsSeen } = messagesSlice.actions;

export default messagesSlice.reducer;
