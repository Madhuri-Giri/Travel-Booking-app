import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"
import profileReducer from "../slices/profileSlice"
import  hotelSearchReducer from "../slices/hotelSlice"
import timerReducer from "../slices/timerSlice"
import busListReducer from "../bus/busListSlice"


const store = configureStore ({
          reducer:{
                    bus: busReducer,
                    busList: busListReducer,
                    profile: profileReducer,   
                    hotelSearch: hotelSearchReducer,
                    timer: timerReducer,


          }
})
export default store;