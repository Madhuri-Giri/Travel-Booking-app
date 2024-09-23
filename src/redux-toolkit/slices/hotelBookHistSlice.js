// src/features/bookingHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch booking history
export const fetchBookingHistory = createAsyncThunk(
  'bookingHistory/fetchBookingHistory',
  async () => {
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/booking-history');
    const data = await response.json();
    return data.data; // Adjust based on your API response structure
  }
);

const bookingHistorySlice = createSlice({
  name: 'bookingHistory',
  initialState: {
    bookings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload; // Add fetched bookings to the state
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default bookingHistorySlice.reducer;
