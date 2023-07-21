import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  placeName: string;
  placeAddr: string;
};

const initialState: initialState = {
  placeName: "오",
  placeAddr: "에",
};

const placeInfoSlice = createSlice({
  name: "placeInfoCounter",
  initialState,
  reducers: {
    up: (state, action) => {
      state.placeName = state.placeName + action.payload;
    },
  },
});

export default placeInfoSlice.reducer;
