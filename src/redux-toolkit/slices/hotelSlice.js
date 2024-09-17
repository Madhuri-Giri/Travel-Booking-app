import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHotelSearchResults = createAsyncThunk(
  'hotel/fetchHotelSearchResults',
  async (requestData) => {
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/search-hotel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    return data;
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: { results: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelSearchResults.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotelSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(fetchHotelSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default hotelSlice.reducer;


