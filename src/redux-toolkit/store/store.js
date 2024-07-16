import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"
import profileReducer from "../slices/profileSlice"
import  hotelSearchReducer from "../slices/hotelSlice"

const store = configureStore ({
          reducer:{
                    bus: busReducer,

                    profile: profileReducer,   
                    hotelSearch: hotelSearchReducer,

                    profile: profileReducer, 

          }
})
export default store;