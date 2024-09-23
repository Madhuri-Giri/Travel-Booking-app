import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../bus/busSlice"
import profileReducer from "../slices/profileSlice"
import timerReducer from "../slices/timerSlice"

import  hotelSearchReducer from "../slices/hotelSlice"
import hotelDetailsReducer from "../slices/hotelInfoSlice"
import hotelRoomsReducer from "../slices/hotelRoomSlice"
import  hotelBlockReducer from '../slices/hotelBlockSlice'
import bookingReducer from "../slices/hotelBookSlice"
import bookingHistoryReducer from '../slices/hotelBookHistSlice';

import busListReducer from "../bus/busListSlice"
import seatlayoutReducer from "../bus/seatLayoutSlice"
import selectedSeatsReducer from '../bus/selectedSeatsSlice';
import boardingReducer from "../bus/boardingSlice"
import busSelectionReducer from "../bus/busSelectionSlice"
import borddropReducer from "../../redux-toolkit/bus/borddropSlice"
import loginSlice from '../slices/loginSlice'


const store = configureStore ({

    reducer: {


                    bus: busReducer,
                    busList: busListReducer,

                    profile: profileReducer,   
                    timer: timerReducer,


                    hotelSearch: hotelSearchReducer,
                    hotelDetails: hotelDetailsReducer,
                    hotelRooms: hotelRoomsReducer,
                    hotelBlock:  hotelBlockReducer,
                    booking: bookingReducer,
                    bookingHistory: bookingHistoryReducer,
          

                    seatLayout: seatlayoutReducer,
                    selectedSeats: selectedSeatsReducer,
                    boarding: boardingReducer,
                    busSelection: busSelectionReducer,
                    borddrop: borddropReducer,
                    login: loginSlice,
                    }

      

})
export default store;