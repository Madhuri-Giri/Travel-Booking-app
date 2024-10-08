/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import ReviewBooking from './components/bus/ReviewBooking';
import HotelRoom from './components/hotelroom/HotelRoom';
import GuestDetails from './components/guestDetails/GuestDetails';
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
import SeatMealBaggageTabs from './components/flight/SeatMealBaggageTabs';
import Profile from './pages/Profile/Profile';
import Loading from './pages/loading/Loading';
import SajyatraLogin from './components/popUp/LoginPopUp';
import Sajyatra from './components/Sajyatra';
import EnterOtp from '../src/components/popUp/EnterOtp'
import RegisterModal from './components/popUp/RegisterPopup';
import LoginPopUp from './components/popUp/LoginPopUp';
import PaymentHistory from './components/paymentHistory/PaymentHistory';
import BookingHistory from './components/bookingHistory/BookingHistory';
import FlightTickect from './components/flight/DownloadTikit/FlightTickect';
import HotelTicket from './components/hotelBill/HotelTicket'
import TicketBookBus from './components/bus/DownloadTikit/TicketBookBus';
import Payloader from "./pages/loading/Payloader"
import Timer from './components/timmer/Timer'
import TimerBus from './components/timmer/TimerBus'
import TimerFlight from './components/timmer/TimerFlight'
import PayloaderHotel from "./pages/loading/PayloaderHotel";
import PayloaderBus from './pages/loading/PayloaderBus';
import FlightNewTicket from './components/flight/DownloadTikit/FlightNewTicket';
import PayloaderFlight from './pages/loading/PayloaderFlight';
import PassangerInfo from './components/bus/PassangerInfo';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setIslogin } from './redux-toolkit/slices/loginSlice';
import { userDetailsHandler } from './API/loginAction';
import Test from './components/bus/Test';

import Token from './Token';
import FlightSegments from './components/flight/FlightSegments';
import PriceModal from './components/flight/PriceModal';
import ApplicationUrl from './components/ApplicationUrl';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLogin } = useSelector((state) => state.loginReducer);

  useEffect(() => {
    dispatch(setIslogin());
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      dispatch(userDetailsHandler({}));
    }
  }, [isLogin]);

  return (
    <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/validate-token' element={<ApplicationUrl />} />
          <Route path='/flight-search' element={<FlightSearch />} />
          <Route path='/flight-list' element={<FlightLists />} />
          <Route path='/flight-segments' element={<FlightSegments />} />
          <Route path='/flightPrice-Modal' element={<PriceModal />} />
          <Route path='/flight-details' element={<FlightDetails />} />
          <Route path='/flight-Farequote' element={<FareQuote />} />
          <Route path='/flight-review' element={<FlightReview />} />
          <Route path='seat-meal-baggage' element={<SeatMealBaggageTabs />} />
          <Route path='/flightNewTicket' element={<FlightNewTicket />} />
          <Route path='/flight-ticket' element={<FlightTickect />} />

          <Route path='/bus-search' element={<BusSearch />} />
          <Route path='/bus-list' element={<BusLists />} />
          <Route path='/bus-layout' element={<BusLayout />} />
          <Route path='/bord-drop' element={<BoardAndDrop />} />
          <Route path='/layout' element={<BusLayout />} />
          <Route path='/bus-tikit-download' element={<BusTikit />} />
          <Route path='busBookTicket' element={<TicketBookBus />} />
          <Route path='/review-booking' element={<ReviewBooking />} />
          <Route path='/passenger' element={<PassangerInfo />} />


          <Route path='/hotel-search' element={<HotelSearch />} />
          <Route path='/hotel-list' element={<HotelList />} />
          <Route path='/hotel-description' element={<HotelDescription />} />
          <Route path='/hotel-room' element={<HotelRoom />} />
          <Route path='/hotel-guest' element={<GuestDetails />} />
          <Route path='/hotel-ticket' element={<HotelTicket />} />
          <Route path='/hotel-bill' element={<HotelBillReceipt />} />

          <Route path='/help' element={<Help />} />
          <Route path='/review' element={<Reviews />} />


          <Route path='/faq' element={<Faq />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='profile' element={<Profile />} />

          <Route path='/enter-number' element={<EnterNumber />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />

          <Route path='/sajyatra-login' element={<SajyatraLogin />} />
          <Route path='/sajpe-login' element={<Sajyatra />} />
          <Route path='/enterOtp' element={<EnterOtp />} />
          <Route path='/login-popup' element={<LoginPopUp />} />
          <Route path='/register' element={<RegisterModal />} />

          <Route path='/payment-history' element={<PaymentHistory />} />
          <Route path='/booking-history' element={<BookingHistory />} />

          <Route path='/timer' from element={<Timer />} />
          <Route path='/timerbus' from element={<TimerBus />} />
          <Route path='/timerflight' from element={<TimerFlight />} />

          <Route path='load' element={<Loading />} />
          <Route path='/payload' element={<Payloader />} />
          <Route path='/hotel-payload' element={<PayloaderHotel />} />
          <Route path='/bus-payload' element={<PayloaderBus />} />

          <Route path='/flight-payload' element={<PayloaderFlight />} />
          {/* <Route path='flightBookTicket' element={<TicketBookFlight/>}/> */}
          {/* <Route path='flightBookTicket' element={<TicketBookFlight/>}/> */}


          <Route path='/token' element={<Token />} />



        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
    </div>
  );
};

export default App;
