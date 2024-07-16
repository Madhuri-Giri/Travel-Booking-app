import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'
import FlightSearch from './components/flight/FlightSearch'
import Footer from './pages/footer/Footer';
import CustomNavbar from './pages/navbar/CustomNavbar';
import BusLists from './components/bus/BusList';
import HotelList from './components/hotelList/HotelList';
import BusLayout from './components/bus/BusLayout';
import Home from './components/home/Home';
import FlightLists from './components/flight/FlightLists';

import BoardAndDrop from './components/bus/BoardAndDrop';
import Faq from './pages/Faq/Faq';
import Setting from './pages/setting/Setting ';
import SignUp from './pages/signup/SignUp';
import LogIn from './pages/login/LogIn';
import LoginOtp from './pages/login-otp/LoginOtp';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import PassangerInfo from './components/bus/PassangerInfo';
import PassengerList from './components/bus/PassengerList';
import ReviewBooking from './components/bus/ReviewBooking';


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
          <Route path='/bord-drop' element={<BoardAndDrop />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/setting' element={< Setting/>} />
          <Route path='/signup' element={< SignUp/>} />
          <Route path='/login' element={<LogIn/>} />
          <Route path='/login-otp' element={<LoginOtp/>} />
          <Route path='/forgotpassword' element={<ForgotPassword/>} />
          <Route path='/passenger-info' element={<PassangerInfo/>} />
          <Route path='/passenger-list' element={<PassengerList/>} />
          <Route path='/review-booking' element={<ReviewBooking/>} />
          <Route path='/hotel-search' element={<HotelSearch />} />
          <Route path='/hotel-list' element={<HotelList />} />
          
        </Routes>
        <Footer/>        
      </Router>
    </div>
  )
}

export default App