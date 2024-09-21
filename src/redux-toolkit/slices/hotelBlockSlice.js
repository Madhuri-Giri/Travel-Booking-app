// features/hotelBlockSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    blockRoomResult: null,
    bookingStatus: null,
    loading: false,
    error: null,
};

// Create an async thunk for the API call
export const blockHotelRooms = createAsyncThunk( 
    'hotelBlock/blockRoom',
    async (requestData) => {
        const response = await axios.post('https://sajyatra.sajpe.in/admin/api/hotel-block', requestData);
        return response.data;
    }
);

// Create the slice
const hotelBlockSlice = createSlice({
    name: 'hotelBlock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(blockHotelRooms.pending, (state) => {  
                state.loading = true;
                state.error = null;
            })
            .addCase(blockHotelRooms.fulfilled, (state, action) => {  
                state.loading = false;
                state.blockRoomResult = action.payload.data.BlockRoomResult; // Store BlockRoomResult
                state.bookingStatus = action.payload.booking_status; // Store booking_status
            })
            .addCase(blockHotelRooms.rejected, (state, action) => { 
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export default hotelBlockSlice.reducer;
