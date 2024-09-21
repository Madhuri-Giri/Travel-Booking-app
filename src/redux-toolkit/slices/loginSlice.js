// redux/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loginId: null,
    loginData: null,
    transactionDetails: null,
};
console.log('logidataaaaa', initialState);

const loginSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginData: (state, action) => {
            state.loginId = action.payload.loginId;
            state.loginData = action.payload.loginData;
            state.transactionDetails = action.payload.transactionDetails;
        },
        setTransactionDetails: (state, action) => {
            state.transactionDetails = action.payload;
        },
        logout: (state) => {
            state.loginId = null;
            state.loginData = null;
            state.transactionDetails = null;
        },
    },
});

export const { setLoginData, setTransactionDetails, logout } = loginSlice.actions;
export default loginSlice.reducer;
