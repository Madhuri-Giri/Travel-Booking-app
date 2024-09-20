import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for posting hotel block request
export const blockHotelRooms = createAsyncThunk(
  'hotelBlock/blockHotelRooms',
  async (hotelRoomsDetails, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelRoomsDetails),
      });

      const res = await response.json();
      console.log('API Response:', res); // Log the entire response

      // Check for success
      if (!response.ok || res.result !== true) {
        return rejectWithValue(res.data.Error.ErrorMessage || 'Something went wrong');
      }

      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const hotelBlockSlice = createSlice({
  name: 'hotelBlock',
  initialState: {
    rooms: null,
    bookingId: null,
    igst: null,
    discount: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearBlockState: (state) => {
      state.rooms = null;
      state.bookingId = null;
      state.igst = null;
      state.discount = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(blockHotelRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(blockHotelRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rooms = action.payload.data?.BlockRoomResult || null;

        if (!action.payload.booking_status) {
          console.error('booking_status is missing from the response');
          state.bookingId = null;
          state.igst = null;
          state.discount = null;
        } else {
          state.bookingId = action.payload.booking_status.id || null;
          state.igst = action.payload.booking_status.igst || null;
          state.discount = action.payload.booking_status.discount || null;
        }
      })
      .addCase(blockHotelRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
        console.error('Error blocking hotel rooms:', action.payload);
      });
  },
});

export const { clearBlockState } = hotelBlockSlice.actions;
export default hotelBlockSlice.reducer;
