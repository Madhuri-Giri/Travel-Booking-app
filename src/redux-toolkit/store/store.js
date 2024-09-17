import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"
import profileReducer from "../slices/profileSlice"
import timerReducer from "../slices/timerSlice"

import  hotelSearchReducer from "../slices/hotelSlice"
import hotelDetailsReducer from "../slices/hotelInfoSlice"
import hotelRoomsReducer from "../slices/hotelRoomSlice"
import hotelBlockReducer from '../slices/hotelBlockSlice'
import bookingReducer from "../slices/hotelBookSlice"

const store = configureStore ({

          reducer:{

                    bus: busReducer,
                    profile: profileReducer,   
                    timer: timerReducer,

                    hotelSearch: hotelSearchReducer,
                    hotelDetails: hotelDetailsReducer,
                    hotelRooms: hotelRoomsReducer,
                    hotelBlock: hotelBlockReducer,
                    booking: bookingReducer,

          }
})
export default store;