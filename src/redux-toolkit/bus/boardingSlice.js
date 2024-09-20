import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to call the API using fetch
export const addBoardingPoint = createAsyncThunk(
  'boarding/addBoardingPoint',
  async ({ traceId, selectedBusIndex }, { rejectWithValue }) => {
    try {
      console.log('TraceId:', traceId);
      console.log('ResultIndex:', selectedBusIndex);

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/add-boarding-point', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ traceId, selectedBusIndex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response Status:', response.status);
        console.error('Response Body:', errorData);
        return rejectWithValue(errorData.message || 'Failed to fetch');
      }

      const data = await response.json();
      console.log('Boarding Dropping Response:', data);
      return data;
    } catch (error) {
      console.error('Fetch Error:', error.message);
      return rejectWithValue(error.message || 'Unknown Error');
    }
  }
);

const boardingSlice = createSlice({
  name: 'boarding',
  initialState: {
    boardingPoints: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBoardingPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBoardingPoint.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingPoints = action.payload;
        console.log('Boarding Points Fetched:', action.payload);
      })
      .addCase(addBoardingPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to fetch boarding points:', action.payload);
      });
  },
});

export default boardingSlice.reducer;
