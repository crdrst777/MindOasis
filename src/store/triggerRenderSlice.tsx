import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  triggerRender: boolean;
};

const initialState: initialState = {
  triggerRender: false,
};

const triggerRenderSlice = createSlice({
  name: "triggerRender",
  initialState,
  reducers: {
    setTriggerRenderReducer: (state, action) => {
      state.triggerRender = action.payload;
    },
  },
});

export const { setTriggerRenderReducer } = triggerRenderSlice.actions;
export default triggerRenderSlice.reducer;
