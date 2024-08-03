import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BusSearch from './components/bus/BusSearch';
import HotelSearch from './components/hotel/HotelSearch';
import FlightSearch from './components/flight/FlightSearch';
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
import LogIn from './pages/NewOne/login/LogIn';
import LoginOtp from './pages/login-otp/LoginOtp';
import PassangerInfo from './components/bus/PassangerInfo';
import PassengerList from './components/bus/PassengerList';
import ReviewBooking from './components/bus/ReviewBooking';

import HotelRoom from './components/hotelroom/HotelRoom';
import GuestDetails from './components/guestDetails/GuestDetails';
import BookingDetails from './components/HotelBookingDetails/BookingDetails'
import HotelDescription from './components/hotelDescription/HotelDescription';
import Help from './components/help/Help';
import Reviews from './components/reviews/Review';
import FlightDetails from './components/flight/FlightDetails';
import BusTikit from './components/bus/DownloadTikit/BusTikit';
import FareQuote from './components/flight/FareQuote';
import EnterNumber from './pages/NewOne/MobileNumber/EnterNumber';
import SignUp from './pages/NewOne/signup/SignUp';

import HotelBillReceipt from './components/hotelBill/HotelBillReceipt';


import FlightReview from './components/flight/FlightReview';
import FlightPayHistory from './pages/History/FlightPayHistory';
import BusPayHistory from './pages/History/BusPayHistory';
import HotelPayHistory from './pages/History/HotelPayHistory';
import SeatMealBaggageTabs from './components/flight/SeatMealBaggageTabs';


const App = () => {
  const noNavbarFooterRoutes = ['/signup', '/login', '/login-otp', '/enter-number'];

  return (
    <div>
      <Router>
        {!noNavbarFooterRoutes.includes(window.location.pathname) && <CustomNavbar />}       
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/flight-search' element={<FlightSearch />} />
          <Route path='/flight-list' element={<FlightLists />} />
          <Route path='/flight-details' element={<FlightDetails />} />
          <Route path='/bus-search' element={<BusSearch />} />
          <Route path='/bus-list' element={<BusLists />} />
          <Route path='/bus-layout' element={<BusLayout />} />
          <Route path='/bord-drop' element={<BoardAndDrop />} />
          <Route path='/bus-tikit-download' element={<BusTikit />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/login-otp' element={<LoginOtp />} />
          <Route path='/enter-number' element={<EnterNumber />} />
          <Route path='/passenger-info' element={<PassangerInfo />} />
          <Route path='/passenger-list' element={<PassengerList />} />
          <Route path='/review-booking' element={<ReviewBooking />} />
          <Route path='/hotel-search' element={<HotelSearch />} />
          <Route path='/hotel-list' element={<HotelList />} />
          <Route path='/hotel-room' element={<HotelRoom />} />
          <Route path='/hotel-guest' element={<GuestDetails />} />
          <Route path='/booking-details' element={<BookingDetails />} />
          <Route path='/hotel-description' element={<HotelDescription />} />
          <Route path='/help' element={<Help />} />
          <Route path='/review' element={<Reviews />} />
          <Route path='/hotel-bill' element={<HotelBillReceipt />} />
          <Route path='/flight-Farequote' element={<FareQuote />} />
          <Route path='/flight-review' element={<FlightReview />} />

          <Route path='/flight-pay-history' element={<FlightPayHistory />} />
          <Route path='/bus-pay-history' element={<BusPayHistory />} />
          <Route path='/hotel-pay-history' element={<HotelPayHistory />} />
          <Route path='seat-meal-baggage'  element={<SeatMealBaggageTabs/>}/>
          {/* <Route path="/seat-meal-baggage" element={<SeatMealBaggageTabs />} /> */}



        </Routes>
        {!noNavbarFooterRoutes.includes(window.location.pathname) && <Footer />}  
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />      
      </Router>
    </div>
  );
};

export default App;
