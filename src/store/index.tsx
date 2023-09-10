import { configureStore } from "@reduxjs/toolkit";
import placeInfoSlice from "./placeInfoSlice";
import checkedListSlice from "./checkedListSlice";
import isLikedSlice from "./isLikedSlice";
import categorySlice from "./categorySlice";
import triggerRenderSlice from "./triggerRenderSlice";

// configureStore는 여러 개의 slice들을 모아주는 역할
const store = configureStore({
  reducer: {
    placeInfo: placeInfoSlice,
    placeKeyword: checkedListSlice,
    isLiked: isLikedSlice,
    category: categorySlice,
    triggerRender: triggerRenderSlice,
  },
});

// export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
