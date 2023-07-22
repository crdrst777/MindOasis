import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  placeInfo: {
    placeName: string;
    placeAddr: string;
  };
};

const initialState: initialState = {
  placeInfo: {
    placeName: "",
    placeAddr: "",
  },
};

const placeInfoSlice = createSlice({
  name: "placeInfo",
  initialState,
  reducers: {
    setPlaceInfo: (state, action) => {
      state.placeInfo = action.payload;
    },
  },
});

export const { setPlaceInfo } = placeInfoSlice.actions;
export default placeInfoSlice.reducer;
