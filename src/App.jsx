import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'
import FlightSearch from './components/flight/FlightSearch'
import Footer from './pages/footer/Footer';
import CustomNavbar from './pages/navbar/CustomNavbar';
import BusLists from './components/bus/BusList';

const App = () => {
  return (
    <div>
      <Router>
        <CustomNavbar/>       
        <Routes>
          <Route path='/' element={<FlightSearch />} />
          <Route path='/bus-search' element={<BusSearch />} />
          <Route path='/bus-list' element={<BusLists />} />


          <Route path='/hotel-search' element={<HotelSearch />} />
        </Routes>
        <Footer/>        
      </Router>
    </div>
  )
}

export default App