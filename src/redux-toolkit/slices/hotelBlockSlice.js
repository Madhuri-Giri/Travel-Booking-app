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
        return response.data; // Return the full response
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
                state.loading = true; // Set loading to true
                state.error = null; // Clear any previous errors
            })
            .addCase(blockHotelRooms.fulfilled, (state, action) => {  
                state.loading = false; // Set loading to false on success
                // Store the BlockRoomResult and booking_status
                state.blockRoomResult = action.payload.data.BlockRoomResult; 
                state.bookingStatus = action.payload.booking_status; 

                // Log the entire response for debugging
                console.log('Full Response:', action.payload); 
            })
            .addCase(blockHotelRooms.rejected, (state, action) => { 
                state.loading = false; // Set loading to false on error
                state.error = action.error.message; // Store error message
                console.error('Error:', action.error.message); // Log error for debugging
            });
    },
});

// Export the reducer
export default hotelBlockSlice.reducer;
