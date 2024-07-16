import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"
import profileReducer from "../slices/profileSlice"

const store = configureStore ({
          reducer:{
                    bus: busReducer,
                    profile: profileReducer, 
          }
})
export default store;