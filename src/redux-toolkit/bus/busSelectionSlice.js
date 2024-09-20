import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBusIndex: null,
};

const busSelectionSlice = createSlice({
  name: 'busSelection',
  initialState,
  reducers: {
    setSelectedBusIndex: (state, action) => {
      console.log('Setting Selected Bus Index:', action.payload); 
      state.selectedBusIndex = action.payload;
    },
    clearSelectedBusIndex: (state) => {
      console.log('Clearing Selected Bus Index'); 
      state.selectedBusIndex = null;
    },
  },
});

export const { setSelectedBusIndex, clearSelectedBusIndex } = busSelectionSlice.actions;
export default busSelectionSlice.reducer;
