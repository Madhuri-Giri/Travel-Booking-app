import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import './ReviewBooking.css';
import "./PassangerInfo.css";
import copImg from "../../assets/images/Gift-rafiki.png"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PassangerInfo from './PassangerInfo';
import { useSelector } from 'react-redux';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
// import updateGif from "../../assets/images/payloader.gif"
// import Payloader from '../../pages/loading/Payloader';
import Loading from '../../pages/loading/Loading';
import PayloaderHotel from '../../pages/loading/PayloaderHotel';
import TimerBus from '../timmer/TimerBus';

const ReviewBooking = () => {

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const [payLoading, setPayLoading] = useState(false);
  const [loading, setLoading] = useState(false)



  const [paymentDetails, setPaymentDetails] = useState(null);
  // const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  const [totalFare, setTotalFare] = useState(0);
  const navigate = useNavigate();


  const [passengerData, setPassengerData] = useState([]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('passengerData'));
    if (storedData && Array.isArray(storedData) && storedData.length > 0) {
      setPassengerData(storedData);
    } else {
      setPassengerData([]);
    }
  }, []);




  const timerEndTime = localStorage.getItem('timerEndTime')
  // ---------------------------new payment ---------------------------
  const newContactInitialData = {
    name: '',
    email: '',
    contact: '',
  };

  const [newContactData, setNewContactData] = useState(newContactInitialData);

  const [isContactSubmitted, setIsContactSubmitted] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContactData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData) {
      setNewContactData((prevData) => ({
        ...prevData,
        name: loginData.name || '',
        email: loginData.email || '',
        contact: loginData.mobile || '' 
      }));
    }
  }, []);


  const newcontactHandler = (e) => {
    e.preventDefault();

    localStorage.setItem('newContactData', JSON.stringify(newContactData));

    setNewContactData(newContactInitialData);
    setIsContactSubmitted(true);
    // toast.success("Contact details submitted successfully!");
  }

  //  ------------------------------------------------------------------

  useEffect(() => {
    const savedTotalPrice = localStorage.getItem('totalPrice');
    if (savedTotalPrice) {
      setTotalFare(parseFloat(savedTotalPrice));
    }
  }, []);

  const back = () => {
    navigate('/bus-list');
  };


  const fetchPaymentDetails = async () => {
    try {
      const loginId = localStorage.getItem('loginId');
      const roundedAmount = Math.round(totalPayment);
      const transactionNoBus = localStorage.getItem('transactionNum');
      const busSavedId = localStorage.getItem('busSavedId');


      // console.log('Sending data to API:', { amount: roundedAmount, user_id: loginId });

      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-bus-payment', {
        amount: roundedAmount,
        user_id: loginId,
        transaction_num: transactionNoBus,
        bus_booking_id: [busSavedId],
      });

      console.log('API response:', response.data);

      if (response.data.status === 'success') {
        setPaymentDetails(response.data.payment_details);
        return response.data;
      } else {
        console.error('API returned an error:', response.data.message);
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error('Error during payment initiation:', error);
      alert('Failed to initiate payment. Please try again.');
      return null;
    }
  };




  // --------------------------------


  const handlePayment = async () => {


    if (!newContactData.name || !newContactData.email || !newContactData.contact) {
      alert('Please fill in your contact details before proceeding to payment.');
      return;
    }


    const loginId = localStorage.getItem('loginId');


    if (!loginId) {
      navigate('/enter-number', { state: { from: location } });
      return;
    }

    try {

      setLoading(true);

      const paymentData = await fetchPaymentDetails();

      if (!paymentData) return;

      const options = {
        key: paymentData.razorpay_key,
        amount: paymentData.payment_details.amount * 100,
        currency: 'INR',
        transaction_id: paymentData.payment_details.id,
        name: 'SRN Infotech',
        description: 'Test Transaction',
        image: 'https://your-logo-url.com/logo.png',
        handler: async function (response) {
          console.log('Payment successful', response);

          localStorage.setItem('payment_id', response.razorpay_payment_id
          );
          localStorage.setItem('transaction_id', options.transaction_id);

          setLoading(true);

          try {
            await updateHandlePayment();

            setLoading(true);

            await bookHandler();
            await busPaymentStatus();
            
          } catch (error) {
            console.error('Error during updateHandlePayment or bookHandler:', error.message);
            alert('An error occurred during processing. Please try again.');
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          username: 'pallavi',
          email: 'pallavi@gmail.com',
          mobile: '9999999999',
        },
        notes: {
          address: 'Indore',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (error) {
      console.error('Error during payment setup:', error.message);
      alert('An error occurred during payment setup. Please try again.');
    }
  };


  // ---------------------------update payment api------------------------------

  const updateHandlePayment = async () => {

    try {
      const payment_id = localStorage.getItem('payment_id');
      const transaction_id = localStorage.getItem('transaction_id');

      if (!payment_id || !transaction_id) {
        throw new Error('Missing payment details');
      }

      const url = 'https://sajyatra.sajpe.in/admin/api/update-bus-payment';
      const payload = {
        payment_id,
        transaction_id,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update payment details. Status:', response.status, 'Response:', errorText);
        throw new Error('Failed to update payment details');
      }

      const data = await response.json();
      console.log('Update successful:', data);
      const status = data.data.status;
      console.log('statusBus', status);


    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }
  };


  //  ----------------------------book api-----------------------------------

  const bookHandler = async () => {
    try {
      const transactionNoBus = localStorage.getItem('transactionNum');
      const busSavedId = localStorage.getItem('busSavedId');
      const transaction_id = localStorage.getItem('transaction_id');
      const selectedBusSeatData = JSON.parse(localStorage.getItem('selectedBusSeatData')) || [];
      const busPassengerData = JSON.parse(localStorage.getItem('busPassengerData')) || [];

      const seatDataMap = new Map();
      selectedBusSeatData.forEach(seat => {
        seatDataMap.set(seat.ColumnNo, seat);
      });

      const passengersData = busPassengerData.map(passenger => {
        const seat = seatDataMap.get(passenger.Seat.ColumnNo) || {};
        return {
          LeadPassenger: passenger.LeadPassenger,
          PassengerId: 0,
          Title: null,
          FirstName: passenger.FirstName,
          LastName: passenger.LastName,
          Email: passenger.Email,
          Phoneno: passenger.Phoneno,
          Gender: passenger.Gender,
          IdType: passenger.IdType,
          IdNumber: passenger.Idnumber,
          Address: passenger.Address,
          Age: passenger.Age,
          Seat: {
            ColumnNo: seat.ColumnNo,
            Height: seat.Height,
            IsLadiesSeat: seat.IsLadiesSeat,
            IsMalesSeat: seat.IsMalesSeat,
            IsUpper: seat.IsUpper,
            RowNo: seat.RowNo,
            SeatFare: seat.SeatFare,
            SeatIndex: seat.SeatIndex,
            SeatName: seat.SeatName,
            SeatStatus: seat.SeatStatus,
            SeatType: seat.SeatType,
            Width: seat.Width,
            Price: {
              CurrencyCode: seat.Price?.CurrencyCode,
              BasePrice: seat.Price?.BasePrice,
              Tax: seat.Price?.Tax,
              OtherCharges: seat.Price?.OtherCharges,
              Discount: seat.Price?.Discount,
              PublishedPrice: seat.Price?.PublishedPrice,
              PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff,
              OfferedPrice: seat.Price?.OfferedPrice,
              OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff,
              AgentCommission: seat.Price?.AgentCommission,
              AgentMarkUp: seat.Price?.AgentMarkUp,
              TDS: seat.Price?.TDS,
              GST: seat.Price?.GST || {
                CGSTAmount: 0,
                CGSTRate: 0,
                CessAmount: 0,
                CessRate: 0,
                IGSTAmount: 0,
                IGSTRate: 18,
                SGSTAmount: 0,
                SGSTRate: 0,
                TaxableAmount: 0
              }
            },
          },
        };
      });

      const requestData = {
        ResultIndex: "1",
        TraceId: "1",
        BoardingPointId: 1,
        DroppingPointId: 1,
        RefID: "1",
        transaction_num: transactionNoBus,
        bus_booking_id: [busSavedId],
        transaction_id: transaction_id,
        Passenger: passengersData,
      };

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseBody = await response.json();
      console.log('Bus Book Response:', responseBody);

      if (!response.ok) {
        console.error('Failed to book seats. Status:', response.status, 'Response:', responseBody);
        throw new Error(`Failed to book seats. Status: ${response.status}`);
      }

      if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
        console.error('Booking failed:', responseBody.Error.ErrorMessage);
        toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
      } else {
        toast.success('Booking successful!');
        localStorage.setItem('busTikitDetails', JSON.stringify(responseBody));

      }

    } catch (error) {
      console.error('Error during booking:', error.message);
      toast.error('An error occurred during booking. Please try again.');
    }
  };





  // ------------------------------status api--------------------------------------------------------

  const busPaymentStatus = async () => {
    try {
      const transaction_id = localStorage.getItem('transaction_id');
      if (!transaction_id) {
        throw new Error('Transaction ID is missing.');
      }

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/bus-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id }),
      });

      const responseBody = await response.json();
      console.log('Bus Payment Status Response:', responseBody);

      if (!response.ok) {
        console.error('Failed to fetch payment status. Status:', response.status, 'Response:', responseBody);
        throw new Error(`Failed to fetch payment status. Status: ${response.status}`);
      }

      // Save to localStorage
      localStorage.setItem("buspaymentStatusRes", JSON.stringify(responseBody));

      // Navigate with state
      navigate('/busBookTicket', { state: { buspaymentStatus: responseBody } });

      return responseBody;

    } catch (error) {
      console.error('Error during fetching payment status:', error.message);
      toast.error('An error occurred while checking payment status. Please try again.');
      return null;
    }
  };

  // -------------------------------------------------------------------------------------------------



  // --------------------------------------------------------------------------------------------------

  const [seatPrices, setSeatPrices] = useState([]);
  const [taxes, setTaxes] = useState(0);
  const [igst, setIgst] = useState(0);
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [discount, setDiscount] = useState(0)

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);


  useEffect(() => {
    const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    setSelectedSeats(seats);
  }, []);

  useEffect(() => {
    const storedBusDetails = localStorage.getItem('selectedBusDetails');
    // console.log('Stored Bus Details:', storedBusDetails);
    if (storedBusDetails) {
      setSelectedBusDetails(JSON.parse(storedBusDetails));
    }
  }, []);


  useEffect(() => {
    const busLayoutResponse = localStorage.getItem('BuslayoutResponse');
    if (busLayoutResponse) {
      const parsedResponse = JSON.parse(busLayoutResponse);
      const result = parsedResponse.Result;
      if (result && Array.isArray(result)) {
        const prices = result.flat().map(seat => ({
          offeredPrice: seat.Price.OfferedPrice,
          tax: seat.Price.Tax,
          igstRate: seat.Price.GST.IGSTRate,
          discount: seat.Price.Discount,
        }));
        setSeatPrices(prices);
      }
    }
  }, []);

  


  const totalPayment = Math.round(totalFare + taxes + (totalFare * 0.18) - discount);

  useEffect(() => {
    if (totalPayment) {
      localStorage.setItem('bus-totalPayment', totalPayment); // Store the value
    }
  }, [totalPayment]);



  // -------------------------------------------------------------------------------------------------

  // if (payLoading) {
  //   return <PayloaderHotel />;
  // }

  if (loading) {
    return <Loading />;
  }



  // ----------------------------------------------------------------------------------------------------

  return (
    <>

      <CustomNavbar />
      <TimerBus />

      <div className='ReviewBooking'>
        <div className="review-book">
          <h5><i onClick={back} className="ri-arrow-left-s-line"></i> Review Booking Details</h5>


          <div className="main-branch">

            <div className="r-left">
              <div className="left-main">


                <div className="l-top">
                  <div className="line">
                    <i className="ri-bus-line">{from} - {to}</i>
                  </div>

                  <div className="line-btm">
                    <p>Travel Name <br /> <span> {selectedBusDetails ? selectedBusDetails.busName : 'N/A'}</span></p>
                    <p>Selected Seats <br /> <span> ({selectedSeats})</span></p>

                    <div>
                      <p>Boarding Points <br /> <span>{selectedBusDetails && selectedBusDetails.boardingPoints.length > 0 ? (
                        selectedBusDetails.boardingPoints.map((point) => (
                          <span key={point.CityPointIndex}>{point.CityPointName}</span>
                        ))
                      ) : (
                        <p>No Boarding Points Available</p>
                      )}</span></p>

                    </div>

                    <div>
                      <p>Dropping Points <br /> <span>{selectedBusDetails && selectedBusDetails.droppingPoints.length > 0 ? (
                        selectedBusDetails.droppingPoints.map((point) => (
                          <span key={point.CityPointIndex}>{point.CityPointName}</span>
                        ))
                      ) : (
                        <p>No Dropping Points Available</p>
                      )}</span></p>

                    </div>
                  </div>

                </div>


                <div className="passnger-Info-page">
                  <PassangerInfo />
                </div>



                <div className="new-contact">
                  <h6><i className="ri-user-add-line"></i> Contact Details </h6>
                  <p>Your booking details will be sent to this email address and mobile number.</p>
                  <form onSubmit={newcontactHandler}>
                    <div className="c-detail">
                      <div className="cont">
                        <input
                          type="text"
                          name="name"
                          value={newContactData.name}
                          onChange={handleInputChange}
                          placeholder="Enter Your Name"
                          required
                        />
                      </div>
                      <div className="cont">
                        <input
                          type="email"
                          name="email"
                          value={newContactData.email}
                          onChange={handleInputChange}
                          placeholder="Enter Your Email"
                          required
                        />
                      </div>
                      <div className="cont">
                      <input
          type="text"
          name="contact"
          value={newContactData.contact}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 10) {
              handleInputChange(e);
            }
          }}
          placeholder="Enter Your Contact"
          maxLength="10"
          required
        />
                      </div>




                    </div>


                    <div className="last-pay">
                      <div className="fare">
                        <h6><i className="ri-price-tag-2-line"></i>Total Ticket Amount</h6>
                        <small >₹{totalPayment}</small>
                      </div>
                      <div className="review-pay">
                        <button
                          style={{ backgroundColor: (!newContactData.name || !newContactData.email || !newContactData.contact) ? '#ccc' : '' }}
                          onClick={handlePayment}
                          disabled={!newContactData.name || !newContactData.email || !newContactData.contact}
                        >
                          Proceed To Pay
                        </button>
                      </div>
                    </div>



                  </form>
                </div>





              </div>
            </div>

            <div className="r-right">
              <div className="price-page">
                <h6><i className="ri-price-tag-2-line"></i> <span>Price Details</span></h6>
                <div className="price">
                  <div className="p-line">
                    <span>Base Fare</span>
                    <small>{totalFare.toFixed(2)}</small>
                  </div>
                  <div className="p-line">
                    <span>Taxes</span>
                    <small>{taxes.toFixed(2)}</small>
                  </div>
                  <div className="total-fare">
                    <span>Total Price</span>
                    <small>{totalFare.toFixed(2)}</small>
                  </div>
                  <div className="p-line">
                    <span>Convenience Fee</span>
                    <small>0</small>
                  </div>
                  <div className="p-line">
                    <span>Discount</span>
                    <small>{discount.toFixed(2)}</small>
                  </div>
                  <div className="p-line">
                    <span>IGST (18%)</span>
                    <small>{(totalFare * 0.18).toFixed(2)}</small>
                  </div>
                  <div className="coupen">
                    <span>Offered Price</span>
                    <small>{offeredPrice.toFixed(2)}</small>
                  </div>
                  <div className="final-pay">
                    <span>Total Payment</span>
                    <small>₹{totalPayment}</small>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ------------------------------------------------------------------------------------------------------------------------------- */}













        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewBooking;