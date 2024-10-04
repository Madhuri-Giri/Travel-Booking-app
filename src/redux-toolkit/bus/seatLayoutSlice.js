import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSeatLayout = createAsyncThunk(
  'seatLayout/fetchSeatLayout',
  async ({ traceId, selectedBusIndex }) => {
    // console.log('Fetching seat layout with:', { traceId, selectedBusIndex });
    
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/add-seat-layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResultIndex: selectedBusIndex ,
        TraceId: traceId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch seat layout:', response.statusText);
      throw new Error('Failed to add seat layout');
    }

    const data = await response.json();
    console.log('Fetched seat layout data:', data);

    return data;
  }
);

const seatLayoutSlice = createSlice({
  name: 'seatLayout',
  initialState: {
    layout: null,
    status: 'idle',
    error: null,
    loadingg: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatLayout.pending, (state) => {
        console.log('Fetching seat layout: loading');
        state.status = 'loading';
        state.loadingg = true; // Start loading
      })
      .addCase(fetchSeatLayout.fulfilled, (state, action) => {
        // console.log('Fetching seat layout: succeeded', action.payload);
        state.status = 'succeeded';
        state.layout = action.payload;
        state.loadingg = false; // Stop loading
      })
      .addCase(fetchSeatLayout.rejected, (state, action) => {
        console.error('Fetching seat layout: failed', action.error.message);
        state.status = 'failed';
        state.loadingg = false; // Stop loading
        state.error = action.error.message;
      });
  },
});

export default seatLayoutSlice.reducer;

