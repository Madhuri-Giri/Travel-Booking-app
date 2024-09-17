// features/hotelBlock/hotelBlockSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for posting hotel block request
export const blockHotelRooms = createAsyncThunk(
  'hotelBlock/blockHotelRooms',
  async (hotelRoomsDetails, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelRoomsDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const hotelBlockSlice = createSlice({
  name: 'hotelBlock',
  initialState: {
    rooms: null,
    bookingId: null,
    igst: null,
    discount: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearBlockState: (state) => {
      state.rooms = null;
      state.bookingId = null;
      state.igst = null;
      state.discount = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(blockHotelRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(blockHotelRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rooms = action.payload.data.BlockRoomResult;
        state.bookingId = action.payload.booking_status.id;
        state.igst = action.payload.booking_status.igst;
        state.discount = action.payload.booking_status.discount;
      })
      .addCase(blockHotelRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearBlockState } = hotelBlockSlice.actions;
export default hotelBlockSlice.reducer;
