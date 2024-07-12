import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addSeatLayout = createAsyncThunk(
  'seatLayout/addSeatLayout',
  async ({ traceId, resultIndex }) => {
    const response = await fetch('https://srninfotech.com/projects/travel-app/api/AddseatLayout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TraceId: traceId, ResultIndex: resultIndex }),
    });
    const data = await response.json();
    return data;
  }
);

const seatLayoutSlice = createSlice({
  name: 'seatLayout',
  initialState: {
    TraceId: '',
    ResultIndex: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSeatLayout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSeatLayout.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addSeatLayout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default seatLayoutSlice.reducer;
