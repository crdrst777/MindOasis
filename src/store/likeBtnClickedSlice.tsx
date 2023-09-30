import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  likeBtnClicked: boolean;
};

const initialState: initialState = {
  likeBtnClicked: false,
};

const likeBtnClickedSlice = createSlice({
  name: "likeBtnClicked",
  initialState,
  reducers: {
    setLikeBtnClickedReducer: (state, action) => {
      state.likeBtnClicked = action.payload;
    },
  },
});

export const { setLikeBtnClickedReducer } = likeBtnClickedSlice.actions;
export default likeBtnClickedSlice.reducer;
