import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const chatFriendsSlice = createSlice({
  name: "chatFriends",
  initialState,
  reducers: {
    setChatFriends: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {  setChatFriends } = chatFriendsSlice.actions;

export default chatFriendsSlice.reducer;
