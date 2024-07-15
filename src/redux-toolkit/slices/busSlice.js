import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchBuses = createAsyncThunk('bus/searchBuses',async ({ from, to, departDate }) => {
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/searchBus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source_city: from, destination_city: to, depart_date: departDate }),
    });
    const data = await response.json();
    return data;
  }
);

const busSlice = createSlice({
  name: 'bus',
  initialState: {
    from: '',
    to: '',
    fromSuggestions: [],
    toSuggestions: [],
    selectedBusDate: null,
    searchResults: [],
    traceId: null,
    resultIndex: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setFrom: (state, action) => {
      state.from = action.payload;
    },
    setTo: (state, action) => {
      state.to = action.payload;
    },
    setFromSuggestions: (state, action) => {
      state.fromSuggestions = action.payload;
    },
    setToSuggestions: (state, action) => {
      state.toSuggestions = action.payload;
    },
    setSelectedBusDate: (state, action) => {
      state.selectedBusDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBuses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data } = action.payload;
        if (data && data.Result && data.Result.length > 0) {
          state.traceId = data.TraceId;
          state.resultIndex = data.Result[0].ResultIndex;
          state.searchResults = data.Result;

          console.log('API Response:', data);
        }
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setFrom,
  setTo,
  setFromSuggestions,
  setToSuggestions,
  setSelectedBusDate,
} = busSlice.actions;

export default busSlice.reducer;
