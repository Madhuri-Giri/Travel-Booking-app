import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'

const App = () => {
  return (
    <div>
        <Routes>
         <Route path='/bus-search' element={<BusSearch/>} /> 
         <Route path='/hotel-search' element={<HotelSearch/>} /> 

        </Routes>
    </div>
  )
}

export default App