import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"
import profileReducer from "../slices/profileSlice"
import  hotelSearchReducer from "../slices/hotelSlice"
import timerReducer from "../slices/timerSlice"
const store = configureStore ({
          reducer:{
                    bus: busReducer,

                    profile: profileReducer,   
                    hotelSearch: hotelSearchReducer,
                    timer: timerReducer,


          }
})
export default store;