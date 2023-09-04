import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  checkedList: string[];
  isChecked: boolean;
};

const initialState: initialState = {
  checkedList: [],
  isChecked: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCheckedListReducer: (state, action) => {
      state.checkedList = action.payload;
    },
    setIsCheckedReducer: (state, action) => {
      state.isChecked = action.payload;
    },
  },
});

export const { setCheckedListReducer, setIsCheckedReducer } =
  categorySlice.actions;
export default categorySlice.reducer;
