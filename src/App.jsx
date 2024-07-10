import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/bus-search' element={<BusSearch />} />
          <Route path='/hotel-search' element={<HotelSearch />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App