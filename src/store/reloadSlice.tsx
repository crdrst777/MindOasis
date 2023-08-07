import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  reload: boolean;
};

const initialState: initialState = {
  reload: false,
};

const reloadSlice = createSlice({
  name: "reload",
  initialState,
  reducers: {
    setReload: (state, action) => {
      state.reload = action.payload;
    },
  },
});

export const { setReload } = reloadSlice.actions;
export default reloadSlice.reducer;
