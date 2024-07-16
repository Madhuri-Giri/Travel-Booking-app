import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchHotels = createAsyncThunk(
  'hotel/searchHotels',
  async (searchParams) => {
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/search-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });
    const data = await response.json();
    console.log('API Response:', data); // Log the API response
    return data;
  }
);

const hotelSearchSlice = createSlice({
  name: 'hotelSearch',
  initialState: {
    hotels: [],
    loading: false,
    error: null,
    resultIndex: null,
    traceId: null,
    srdvType: null,
    srdvIndex: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        console.log('Redux Fulfilled Action:', action.payload); // Log the payload
        state.loading = false;
        state.hotels = action.payload.Hotels || [];
        state.resultIndex = action.payload.ResultIndex;
        state.traceId = action.payload.TraceId;
        state.srdvType = action.payload.SrdvType;
        state.srdvIndex = action.payload.SrdvIndex;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default hotelSearchSlice.reducer;
