import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, name, email, mobile }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://srninfotech.com/projects/travel-app/api/update-profile', {
        user_id: userId,
        name,
        email,
        mobile,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  name: '',
  email: '',
  mobile: '',
  status: 'idle',
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      const { name, email, mobile } = action.payload;
      state.name = name;
      state.email = email;
      state.mobile = mobile;
    },
    clearProfileData: (state) => {
      state.name = '';
      state.email = '';
      state.mobile = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { name, email, mobile } = action.payload;
        state.name = name;
        state.email = email;
        state.mobile = mobile;
        state.status = 'succeeded';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setProfileData, clearProfileData } = profileSlice.actions;

export default profileSlice.reducer;
