// selectedSeatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedSeatsSlice = createSlice({
  name: 'selectedSeats',
  initialState: {
    seats: [], 
  },
  reducers: {
    addSeat: (state, action) => {
      const seatData = action.payload;
      state.seats.push(seatData);
    },
    removeSeat: (state, action) => {
      const seatName = action.payload;
      state.seats = state.seats.filter(seat => seat.SeatName !== seatName);
    },
    clearSeats: (state) => {
      state.seats = [];
    },
    setSelectedBusSeatData: (state, action) => {
      state.seats = action.payload;
    }
  }
});

export const { addSeat, removeSeat, clearSeats, setSelectedBusSeatData } = selectedSeatsSlice.actions;
export default selectedSeatsSlice.reducer;
