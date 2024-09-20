import { createSlice } from '@reduxjs/toolkit';

const borddropSlice = createSlice({
  name: 'borddrop',
  initialState: {
    boardingData: null,
    droppingData: null,
    selectedBoardingPoint: null,
    selectedDroppingPoint: null,
  },
  reducers: {
    setBoardingData(state, action) {
      state.boardingData = action.payload;
    },
    setDroppingData(state, action) {
      state.droppingData = action.payload;
    },
    setSelectedBoardingPoint(state, action) {
      state.selectedBoardingPoint = action.payload;
    },
    setSelectedDroppingPoint(state, action) {
      state.selectedDroppingPoint = action.payload;
    },
  },
});

export const { 
  setBoardingData, 
  setDroppingData, 
  setSelectedBoardingPoint, 
  setSelectedDroppingPoint 
} = borddropSlice.actions;

export default borddropSlice.reducer;