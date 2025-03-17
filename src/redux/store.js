import { configureStore } from "@reduxjs/toolkit";
import jeopardyReducer from './jeapordySlice';

export const store = configureStore({
  reducer: {
    jeopardy: jeopardyReducer,
  },
});

export default store;
