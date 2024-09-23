/* eslint-disable no-unused-vars */
// redux/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { userDetailsHandler, userLogin, userLogout } from '../../API/loginAction';

const initialState = {
    loginId: null,
    loginData: null,
    transactionDetails: null,
    isLogin: false,
    userDetails: null,
};

const loginSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIslogin: (state) => {
            if (localStorage.getItem("loginId")) {
                state.isLogin = true;
            }
        },
        setIsLogout: (state) => {
            if (localStorage.getItem("loginId")) {
                localStorage.removeItem("loginId")
                localStorage.removeItem("loginData")
            }
            state.isLogin = false;
            state.profileReducer = ""
        },
    },

    extraReducers: (builder) => {
        builder
        
            // Login
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loginData = payload.data;
                state.loading = false;
                state.isLogin = true;
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // User Details
            .addCase(userDetailsHandler.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userDetailsHandler.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.transactionDetails = payload.transaction;
                state.isUserLogin = true;
            })
            .addCase(userDetailsHandler.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // Logout
            .addCase(userLogout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogout.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.isLogin = false;
                if (localStorage.getItem("loginId")) {
                    localStorage.removeItem("loginId")
                    localStorage.removeItem("loginData")
                }
            })
            .addCase(userLogout.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
    },
});

export const { setLoginData, setTransactionDetails, logout, setIslogin, setIsLogout } = loginSlice.actions;
export default loginSlice.reducer;
