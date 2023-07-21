import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  placeName: string;
  placeAddr: string;
};

const initialState: initialState = {
  placeName: "1",
  placeAddr: "2",
};

const counterSlice = createSlice({
  name: "Counter",
  initialState,
  reducers: {
    up: (state, action) => {
      state.placeName = state.placeName + action.payload;
    },
  },
});

export default counterSlice.reducer;
