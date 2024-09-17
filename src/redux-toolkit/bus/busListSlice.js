import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  busOriginCodes: [],       
  busDestinationCodes: [], 
};

const busListSlice = createSlice({
  name: 'busList',
  initialState,
  reducers: {
    setBusOriginCodes: (state, action) => {
      state.busOriginCodes = action.payload; 
    },
    setBusDestinationCodes: (state, action) => {
      state.busDestinationCodes = action.payload; 
    },
  },
});

export const { setBusOriginCodes, setBusDestinationCodes } = busListSlice.actions;
export default busListSlice.reducer;

