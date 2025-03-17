import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedQuestion: null,
  score: 0, // Initial score
};

const jeopardySlice = createSlice({
  name: "jeopardy",
  initialState,
  reducers: {
    selectQuestion: (state, action) => {
      state.selectedQuestion = `You selected $${action.payload}`;
    },
    resetQuestion: (state) => {
      state.selectedQuestion = null;
    },
    updateScore: (state, action) => {
      state.score += action.payload; // Add question value to score
    },
  },
});

export const { selectQuestion, resetQuestion, updateScore } = jeopardySlice.actions;
export default jeopardySlice.reducer;
