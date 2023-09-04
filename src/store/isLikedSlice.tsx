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
    setIsLikedReducer: (state, action) => {
      state.isLiked = action.payload;
    },
  },
});

export const { setIsLikedReducer } = isLikedSlice.actions;
export default isLikedSlice.reducer;
