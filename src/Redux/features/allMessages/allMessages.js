import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const allMessagesSlice = createSlice({
  name: "allMessages",
  initialState,
  reducers: {
    setAllMessages: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setAllMessages } = allMessagesSlice.actions; 

export default allMessagesSlice.reducer;
