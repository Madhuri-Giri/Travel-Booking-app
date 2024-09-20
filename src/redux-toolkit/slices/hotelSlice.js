// src/features/hotelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for searching hotels
export const searchHotels = createAsyncThunk('hotels/searchHotels', async (requestData) => {
    const response = await axios.post('https://sajyatra.sajpe.in/admin/api/search-hotel', requestData, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
    return response.data;
});

// Create a slice
const hotelSlice = createSlice({
    name: 'hotelsdata',
    initialState: {
        hotels: [],
        loading: false,
        error: null,
        traceId: null,
        srdvType: null,
        resultIndexes: [],
        srdvIndexes: [],
        hotelCodes: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchHotels.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Search Hotels Response:', action.payload);
                state.hotels = action.payload.Results || []; // Store hotel results

                // Extract information from the results
                state.traceId = action.payload.TraceId || null;
                state.srdvType = action.payload.SrdvType || null;

                // Populate the arrays with the respective values
                state.resultIndexes = action.payload.Results.map(result => result.ResultIndex);
                state.srdvIndexes = action.payload.Results.map(result => result.SrdvIndex);
                state.hotelCodes = action.payload.Results.map(result => result.HotelCode);

                console.log('Result Indexes:', state.resultIndexes);
                console.log('Srdv Indexes:', state.srdvIndexes);
                console.log('Hotel Codes:', state.hotelCodes);
            })
            .addCase(searchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export default hotelSlice.reducer;
