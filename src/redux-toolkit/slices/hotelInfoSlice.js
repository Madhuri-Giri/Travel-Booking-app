// features/hotelDetails/hotelDetailsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching hotel details
export const fetchHotelDetails = createAsyncThunk(
  'hotelDetails/fetchHotelDetails',
  async (requestData) => {
    const response = await fetch("https://sajyatra.sajpe.in/admin/api/hotel-info", {
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
    return data.HotelInfoResult.HotelDetails;
  }
);

const hotelDetailsSlice = createSlice({
  name: 'hotelDetails',
  initialState: {
    details: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotelDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.details = action.payload;
        
        console.log('Fetched hotel details:', action.payload);
      })
      .addCase(fetchHotelDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearDetails } = hotelDetailsSlice.actions;
export default hotelDetailsSlice.reducer;
