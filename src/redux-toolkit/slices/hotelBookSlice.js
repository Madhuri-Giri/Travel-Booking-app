import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for posting hotel booking request
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

      const res = await response.json();
      if (!response.ok) {
        return rejectWithValue(res.Error?.ErrorMessage || 'Booking failed');
      }

      return res; // return booking data if successful
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookingData: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.bookingData = null;
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
        state.bookingData = action.payload; // Store booking data
      })
      .addCase(bookHotel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store error message
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
