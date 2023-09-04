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
    setPlaceKeywordReducer: (state, action) => {
      state.placeKeyword = action.payload;
    },
  },
});

export const { setPlaceKeywordReducer } = placeKeywordSlice.actions;
export default placeKeywordSlice.reducer;
