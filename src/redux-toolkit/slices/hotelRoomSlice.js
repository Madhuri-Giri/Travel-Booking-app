// features/hotelRooms/hotelRoomsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching hotel room details
export const fetchHotelRooms = createAsyncThunk(
  'hotelRooms/fetchHotelRooms',
  async (requestData) => {
    const response = await fetch("https://sajyatra.sajpe.in/admin/api/hotel-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.GetHotelRoomResult.HotelRoomsDetails;
  }
);

const hotelRoomsSlice = createSlice({
  name: 'hotelRooms',
  initialState: {
    rooms: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearRooms: (state) => {
      state.rooms = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotelRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rooms = action.payload;
      })
      .addCase(fetchHotelRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearRooms } = hotelRoomsSlice.actions;
export default hotelRoomsSlice.reducer;
