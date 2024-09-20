import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchBuses = createAsyncThunk('bus/searchBuses', async ({ from, to, departDate, fromCode, toCode }) => {
  const currentDate = new Date();
  const departureDate = new Date(departDate);

  currentDate.setHours(0, 0, 0, 0);
  departureDate.setHours(0, 0, 0, 0);

  if (departureDate <= currentDate) {
    throw new Error('Date of journey should be greater than the current date');
  }

  const requestPayload = { 
    source_city: from,
    destination_city: to,
    depart_date: departDate,
    source_code: fromCode,
    destination_code: toCode, 
  };

  console.log('Request Payload:', requestPayload);

  const response = await fetch('https://sajyatra.sajpe.in/admin/api/search-bus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  });

  const data = await response.json();
  console.log('bus search', data);
  return data;
});

const busSlice = createSlice({
  name: 'bus',
  initialState: {
    from: '',
    to: '',
    fromCode: '',
    toCode: '',
    fromSuggestions: [],
    toSuggestions: [],
    selectedBusDate: null,
    searchResults: [],
    traceId: null,
    resultIndex: null,
    boardingPoints: [],
    droppingPoints: [],
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
    setFromCode: (state, action) => {
      state.fromCode = action.payload;
    },
    setToCode: (state, action) => {
      state.toCode = action.payload;
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

        if (data && data.Result && data.Result.BusResults && data.Result.BusResults.length > 0) {
          state.traceId = data.Result.TraceId;
          state.resultIndex = data.Result.BusResults[0]?.ResultIndex || null;
          state.searchResults = data.Result.BusResults;

           

          console.log('redux result ', state.resultIndex)

          // localStorage.setItem('traceId', data.Result.TraceId);
          // console.log('bus trace id',  data.Result.TraceId)
          // localStorage.setItem('resultIndex', data.Result.BusResults[0]?.ResultIndex || null);

          // const saveDataToLocalStorage = (data) => {
          //   const jsonData = JSON.stringify(data);
          //   localStorage.setItem('busSearchStore', jsonData);
          // };

          // saveDataToLocalStorage(data);

          const boardingPoints = data.Result.BusResults.flatMap(bus =>
            (bus.BoardingPoints || []).map(point => ({
              CityPointName: point?.CityPointName || 'Unknown',
              CityPointIndex: point?.CityPointIndex || 'Unknown',
              CityPointLocation: point?.CityPointLocation || 'Unknown',
              CityPointTime: point?.CityPointTime || 'Unknown',
            }))
          );
          // console.log('Boarding Points:', boardingPoints); 
          state.boardingPoints = boardingPoints;

          const droppingPoints = data.Result.BusResults.flatMap(bus =>
            (bus.DroppingPoints || []).map(point => ({
              CityPointName: point?.CityPointName || 'Unknown',
              CityPointIndex: point?.CityPointIndex || 'Unknown',
              CityPointLocation: point?.CityPointLocation || 'Unknown',
              CityPointTime: point?.CityPointTime || 'Unknown',
            }))
          );
          // console.log('Dropping Points:', droppingPoints); 
          state.droppingPoints = droppingPoints;
        }
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setFrom, setTo, setFromCode, setToCode, setFromSuggestions, setToSuggestions, setSelectedBusDate } = busSlice.actions;

export default busSlice.reducer;

