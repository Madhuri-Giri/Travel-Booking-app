// features/booking/bookingSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const bookHotel = createAsyncThunk(
  'booking/bookHotel',
  async (bookingPayload, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookingDetails: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.bookingDetails = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookHotel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bookHotel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookingDetails = action.payload;
      })
      .addCase(bookHotel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
