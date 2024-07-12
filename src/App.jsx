import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './components/bus/BusSearch'
import HotelSearch from './components/hotel/HotelSearch'
import FlightSearch from './components/flight/FlightSearch'
import Footer from './pages/footer/Footer';
import CustomNavbar from './pages/navbar/CustomNavbar';
import BusLists from './components/bus/BusList';
import BusLayout from './components/bus/BusLayout';
import BoardAndDrop from './components/bus/BoardAndDrop';
import Faq from './pages/Faq/Faq';
import Setting from './pages/setting/Setting ';
import SignUp from './pages/signup/SignUp';
import LogIn from './pages/login/LogIn';
import LoginOtp from './pages/login-otp/LoginOtp';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';


const App = () => {
  return (
    <div>
      <Router>
        <CustomNavbar/>       
        <Routes>
          <Route path='/' element={<FlightSearch />} />

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











          <Route path='/hotel-search' element={<HotelSearch />} />
          
        </Routes>
        <Footer/>        
      </Router>
    </div>
  )
}

export default App