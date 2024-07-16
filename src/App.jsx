import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'
import FlightSearch from './components/flight/FlightSearch'
import Footer from './pages/footer/Footer';
import CustomNavbar from './pages/navbar/CustomNavbar';
import BusLists from './components/bus/BusList';
import BusLayout from './components/bus/BusLayout';
import Home from './components/home/Home';
import FlightLists from './components/flight/FlightLists';


const App = () => {
  return (
    <div>
      <Router>
        <CustomNavbar/>       
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/flight-search' element={<FlightSearch />} />
          <Route path='/flight-list' element={<FlightLists />} />
          <Route path='/bus-search' element={<BusSearch />} />
          <Route path='/bus-list' element={<BusLists />} />
          <Route path='/bus-layout' element={<BusLayout />} />
          <Route path='/hotel-search' element={<HotelSearch />} />
          
        </Routes>
        <Footer/>        
      </Router>
    </div>
  )
}

export default App