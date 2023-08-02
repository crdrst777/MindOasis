import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  placeKeyword: string[];
};

const initialState: initialState = {
  placeKeyword: [],
};

const placeKeywordSlice = createSlice({
  name: "placeKeyword",
  initialState,
  reducers: {
    setPlaceKeyword: (state, action) => {
      state.placeKeyword = action.payload;
    },
  },
});

export const { setPlaceKeyword } = placeKeywordSlice.actions;
export default placeKeywordSlice.reducer;
