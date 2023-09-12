import { createSlice } from "@reduxjs/toolkit";
import { PostType } from "../types/types";

type initialState = {
  searchedPosts: PostType[];
};

const initialState: initialState = {
  searchedPosts: [],
};

const searchedPostsSlice = createSlice({
  name: "searchedPosts",
  initialState,
  reducers: {
    setSearchedPostsReducer: (state, action) => {
      state.searchedPosts = action.payload;
    },
  },
});

export const { setSearchedPostsReducer } = searchedPostsSlice.actions;
export default searchedPostsSlice.reducer;
