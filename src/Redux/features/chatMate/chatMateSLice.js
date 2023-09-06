import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const chatMateSlice = createSlice({
  name: "chatMate",
  initialState,
  reducers: {
    setChatMate: (state, action) => {
      state.data = action.payload;
    },
    addChatMateBlocker: (state, action) => {
      state.data.blockedUsers.push(action.payload);
    },
  },
});

export const { setChatMate, addChatMateBlocker } = chatMateSlice.actions;

export default chatMateSlice.reducer;
