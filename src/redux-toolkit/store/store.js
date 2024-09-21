import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../bus/busSlice"
import profileReducer from "../slices/profileSlice"
import hotelSearchReducer from "../slices/hotelSlice"
import timerReducer from "../slices/timerSlice"
import busListReducer from "../bus/busListSlice"
import seatlayoutReducer from "../bus/seatLayoutSlice"
import selectedSeatsReducer from '../bus/selectedSeatsSlice';
import boardingReducer from "../bus/boardingSlice"
import busSelectionReducer from "../bus/busSelectionSlice"
import borddropReducer from "../../redux-toolkit/bus/borddropSlice"
import loginSlice from '../slices/loginSlice'

const store = configureStore({
    reducer: {
        bus: busReducer,
        busList: busListReducer,
        profile: profileReducer,
        hotelSearch: hotelSearchReducer,
        timer: timerReducer,
        seatLayout: seatlayoutReducer,
        selectedSeats: selectedSeatsReducer,
        boarding: boardingReducer,
        busSelection: busSelectionReducer,
        borddrop: borddropReducer,
        loginReducer: loginSlice,
    }
})
export default store;