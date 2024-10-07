/* eslint-disable no-extra-semi */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import { toast } from "react-toastify";
import { setIsLogout } from "../redux-toolkit/slices/loginSlice";

// Login
export const userLogin = createAsyncThunk(
    "auth/login",
    async ({ formData, isNavigate, setError, navigate, onClose }, { rejectWithValue }) => {
        try {
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // console.log('login successful:', data);
                localStorage.setItem('loginId', data.data.id);
                localStorage.setItem('loginData', JSON.stringify(data.data));
                toast.success('LogIn successfully!');

                if (isNavigate == false) {
                    //do not navigate
                } else {
                    navigate("/");
                }

                if (onClose) {
                    onClose()
                }

                return data;
            } else {
                // console.log('login failed:', data);
                setError('Login failed. Please check your credentials.');
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again later.');
            toast.error('An error occurred. Please try again later.');
        }
    }
);

// Logout
export const userLogout = createAsyncThunk(
    "auth/logout",
    async ({ navigate }, { rejectWithValue, dispatch }) => {
        const loginData = JSON.parse(localStorage.getItem('loginData'));
        const token = loginData?.token;

        try {
            const response = await fetch('https://new.sajpe.in/api/v1/user/logout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'app-package': 'com.sajyatra',
                    'app-version': '1.0',
                },
            });

            // console.log('Logout response:', response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to log out');
            }
            // localStorage.removeItem('loginData');
            // localStorage.removeItem('loginId');
            // localStorage.removeItem('transactionNum');
            // localStorage.removeItem('transactionNum-Flight');
            // localStorage.removeItem('transactionNum-bus');
            // localStorage.removeItem('transactionNumHotel');

            toast.success('Logged out successfully.');
            dispatch(setIsLogout())
            navigate('/');
        } catch (error) {
            dispatch(setIsLogout())
            //   setMessage(`Error logging out: ${error.message}`);
            //   setMessageType('danger');
        }
    }
);

//user details
export const userDetailsHandler = createAsyncThunk(
    "auth/userDetailsHandler",
    async ({ }, { rejectWithValue, dispatch }) => {
        const loginId = localStorage.getItem('loginId');
        try {
            const requestBody = {
                user_id: loginId,
            };
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/user-detail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();


            if (data.status == 404) {
                // userLogout({})
                dispatch(setIsLogout())
            }

            if (!response.ok) {
                throw new Error(data);
            }

            // console.log('Main LOGIN User details:', data);
            // console.log('flight transcNo', data.transaction.transaction_num);

            // if (data.result && data.transaction) {
            //     // localStorage.setItem('transactionId', data.transaction.id);
            //     // localStorage.setItem('transactionNum', data.transaction.transaction_num);
            //     // // localStorage.setItem('transactionNum-Flight', data.transaction.transaction_num);
            //     // localStorage.setItem('transactionNum-bus', data.transaction.transaction_num);
            //     // localStorage.setItem('transactionNumHotel', data.transaction.transaction_num);
            //     // userdetails transaction data save on the redux
            // };

            return data;
        } catch (error) {
            // console.log("error", error.message);
            // console.error('Error fetching user details:', error.message);
        }
    }
);


//auth-check api 
export const sendPostRequest = createAsyncThunk(
    "auth/sendPostRequest",
    async ({ appname, module, token ,navigate ,setLoading}, { rejectWithValue, dispatch  }) => {
        try {
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/auth-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass token in the Authorization header
                },
                body: JSON.stringify({
                    app_name: appname,
                    module: module
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (response.result == true) {
                if(response.ok){
                    localStorage.setItem('loginId', data.data.id);
                    localStorage.setItem('loginData', JSON.stringify(data.data));
                }
            }
            if (data.result == false) {
                navigate('/signup');
            } else {
                if (data.module == 'bus') {
                    navigate('/bus-search');
                }else if (data.module == 'flight') {
                    navigate('/flight-search');
                }else if (data.module == 'hotel') {
                    navigate('/hotel-search');
                }else{
                    navigate('/signup');
                }
            }
        } catch (error) {
            console.error('Error in POST request:', error);
        }
        finally {
            setLoading(false);
        }
    }
);




