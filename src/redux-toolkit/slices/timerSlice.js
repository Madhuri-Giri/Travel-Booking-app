// src/redux-toolkit/slices/timerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    time: 600000, // Initial time in milliseconds (10 minutes)
  },
  reducers: {
    setTime: (state, action) => {
      state.time = action.payload;
    },
    decrementTime: (state) => {
      state.time = Math.max(0, state.time - 1000);
    },
    resetTime: (state) => {
      state.time = 600000; // Reset to 10 minutes
    },
  },
});

export const { setTime, decrementTime, resetTime } = timerSlice.actions;
export default timerSlice.reducer;
