import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const blockedUsersSLice = createSlice({
  name: "blockedUsers",
  initialState,
  reducers: {
    setBlockedUsers: (state, action) => {
      state.data = action.payload;
    },
    addBlockedUsers: (state, action) => {
      state.data = [...state.data, action.payload];
    },
  },
});

export const { setBlockedUsers, addBlockedUsers } = blockedUsersSLice.actions;

export default blockedUsersSLice.reducer;
