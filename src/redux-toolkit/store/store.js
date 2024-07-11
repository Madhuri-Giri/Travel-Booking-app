import { configureStore } from '@reduxjs/toolkit'
import busReducer from "../slices/busSlice"

const store = configureStore ({
          reducer:{
                    bus: busReducer,
          }
})
export default store;