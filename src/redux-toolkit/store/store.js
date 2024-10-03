import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your reducers
import busReducer from "../bus/busSlice";
import profileReducer from "../slices/profileSlice";
import timerReducer from "../slices/timerSlice";
import hotelSearchReducer from "../slices/hotelSlice";
import hotelDetailsReducer from "../slices/hotelInfoSlice";
import hotelRoomsReducer from "../slices/hotelRoomSlice";
import hotelBlockReducer from '../slices/hotelBlockSlice';
import bookingReducer from "../slices/hotelBookSlice";
import bookingHistoryReducer from '../slices/hotelBookHistSlice';
import busListReducer from "../bus/busListSlice";
import seatlayoutReducer from "../bus/seatLayoutSlice";
import selectedSeatsReducer from '../bus/selectedSeatsSlice';
import boardingReducer from "../bus/boardingSlice";
import busSelectionReducer from "../bus/busSelectionSlice";
import borddropReducer from "../../redux-toolkit/bus/borddropSlice";
import loginSlice from '../slices/loginSlice';

// Persist configuration for hotel search
const hotelSearchPersistConfig = {
  key: 'hotelSearchData',
  storage,
};

// Persist the bus reducer
const persistConfig = {
  key: 'busData',
  storage,
};

const persistedBusReducer = persistReducer(persistConfig, busReducer);
const persistedHotelSearchReducer = persistReducer(hotelSearchPersistConfig, hotelSearchReducer);

const store = configureStore({
  reducer: {
    bus: persistedBusReducer,
    busList: busListReducer,
    profile: profileReducer,
    timer: timerReducer,
    hotelSearch: persistedHotelSearchReducer,
    hotelDetails: hotelDetailsReducer,
    hotelRooms: hotelRoomsReducer,
    hotelBlock: hotelBlockReducer,
    booking: bookingReducer,
    bookingHistory: bookingHistoryReducer,
    seatLayout: seatlayoutReducer,
    selectedSeats: selectedSeatsReducer,
    boarding: boardingReducer,
    busSelection: busSelectionReducer,
    borddrop: borddropReducer,
    loginReducer: loginSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
