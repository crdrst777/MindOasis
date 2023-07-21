import { configureStore } from "@reduxjs/toolkit";
import placeInfoSlice from "./placeInfoSlice";
import counterSlice from "./counterSlice";

// configureStore는 여러 개의 slice들을 모아주는 역할
const store = configureStore({
  reducer: {
    placeInfo: placeInfoSlice,
    counter: counterSlice,
  },
});

// export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
