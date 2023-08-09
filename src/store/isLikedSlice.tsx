import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  isLiked: boolean;
};

const initialState: initialState = {
  isLiked: false,
};

const isLikedSlice = createSlice({
  name: "isLiked",
  initialState,
  reducers: {
    setIsLiked: (state, action) => {
      state.isLiked = action.payload;
    },
  },
});

export const { setIsLiked } = isLikedSlice.actions;
export default isLikedSlice.reducer;
