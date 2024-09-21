// const bookHandler = async () => {
  //   try {
  //     const transactionNoBus = localStorage.getItem('transactionNum');
  //     const busSavedId = localStorage.getItem('busSavedId');
  //     const transaction_id = localStorage.getItem('transaction_id');
  //     const selectedBusSeatData = JSON.parse(localStorage.getItem('selectedBusSeatData')) || [];
  //     const busPassengerData = JSON.parse(localStorage.getItem('busPassengerData')) || [];


  //     const seatDataMap = new Map();
  //     selectedBusSeatData.forEach(seat => {
  //       seatDataMap.set(seat.ColumnNo, seat);
  //     });

  //     const passengersData = busPassengerData.map(passenger => {
  //       const seat = seatDataMap.get(passenger.Seat.ColumnNo) || {};
  //       return {
  //         LeadPassenger: passenger.LeadPassenger,
  //         PassengerId: 0,
  //         Title: "null",
  //         FirstName: passenger.FirstName,
  //         LastName: passenger.LastName,
  //         Email: passenger.Email,
  //         Phoneno: passenger.Phoneno,
  //         Gender: passenger.Gender,
  //         IdType: passenger.IdType,
  //         IdNumber: passenger.Idnumber,
  //         Address: passenger.Address,
  //         Age: passenger.Age,
  //         Seat: {
  //           ColumnNo: seat.ColumnNo,
  //           Height: seat.Height,
  //           IsLadiesSeat: seat.IsLadiesSeat,
  //           IsMalesSeat: seat.IsMalesSeat,
  //           IsUpper: seat.IsUpper,
  //           RowNo: seat.RowNo,
  //           SeatFare: seat.SeatFare,
  //           SeatIndex: seat.SeatIndex,
  //           SeatName: seat.SeatName,
  //           SeatStatus: seat.SeatStatus,
  //           SeatType: seat.SeatType,
  //           Width: seat.Width,
  //           Price: {
  //             CurrencyCode: seat.Price?.CurrencyCode,
  //             BasePrice: seat.Price?.BasePrice,
  //             Tax: seat.Price?.Tax,
  //             OtherCharges: seat.Price?.OtherCharges,
  //             Discount: seat.Price?.Discount,
  //             PublishedPrice: seat.Price?.PublishedPrice,
  //             PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff,
  //             OfferedPrice: seat.Price?.OfferedPrice,
  //             OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff,
  //             AgentCommission: seat.Price?.AgentCommission,
  //             AgentMarkUp: seat.Price?.AgentMarkUp,
  //             TDS: seat.Price?.TDS,
  //             GST: seat.Price?.GST || {
  //               CGSTAmount: 0,
  //               CGSTRate: 0,
  //               CessAmount: 0,
  //               CessRate: 0,
  //               IGSTAmount: 0,
  //               IGSTRate: 18,
  //               SGSTAmount: 0,
  //               SGSTRate: 0,
  //               TaxableAmount: 0
  //             }
  //           },
  //         },
  //       };
  //     });


  //     const traceId = localStorage.getItem('traceId');
  //     const storedBusDetails = localStorage.getItem('selectedBusDetails');
  //     const BoardingPointId = localStorage.getItem('selectedBoardingPointIndex')
  //     const DroppingPointId = localStorage.getItem('selectedDroppingPointIndex')
  //     // console.log('BoardingPointId', BoardingPointId)


  //     if (!traceId) {
  //       throw new Error('TraceId not found in localStorage');
  //     }

  //     let selectedBusResult = null;

  //     if (storedBusDetails) {
  //       const parsedBusDetails = JSON.parse(storedBusDetails);
  //       selectedBusResult = parsedBusDetails.selctedBusResult;

  //       console.log('Selected Bus Result:', selectedBusResult);
  //     } else {
  //       throw new Error('No bus details found in localStorage');
  //     }

  //     if (!selectedBusResult) {
  //       throw new Error('SelectedBusResult not found in bus details');
  //     }




  //     const requestData = {
  //       ResultIndex: selectedBusResult,
  //       TraceId: traceId,
  //       BoardingPointId: BoardingPointId,
  //       DroppingPointId: DroppingPointId,
  //       RefID: "1",
  //       transaction_num: transactionNoBus,
  //       bus_booking_id: [busSavedId],
  //       transaction_id: transaction_id,
  //       Passenger: passengersData,
  //     };

  //     const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-book', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const responseBody = await response.json();
  //     console.log('Bus Book Response:', responseBody);

  //     if (!response.ok) {
  //       console.error('Failed to book seats. Status:', response.status, 'Response:', responseBody);
  //       throw new Error(`Failed to book seats. Status: ${response.status}`);
  //     }

  //     if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
  //       console.error('Booking failed:', responseBody.Error.ErrorMessage);
  //       toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
  //     } else {
  //       toast.success('Booking successful!');
  //       localStorage.setItem('busTikitDetails', JSON.stringify(responseBody));

  //     }

  //   } catch (error) {
  //     console.error('Error during booking:', error.message);
  //     toast.error('An error occurred during booking. Please try again.');
  //   }
  // };









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
import PayloaderBus from '../../pages/loading/PayloaderBus'
import TimerBus from '../timmer/TimerBus';
import { useLocation } from 'react-router-dom';

import './PassangerInfo.css';

const ReviewBooking = () => {


  const selectedSeatCount = localStorage.getItem('selectedSeatCount') || 0;

  const travelName = localStorage.getItem('selectedTravelName')

  const traceId = useSelector((state) => state.bus.traceId);
  // const resultIndex = useSelector((state) => state.bus.resultIndex);

  const selectedBusIndex = localStorage.getItem('selectedBusIndex')


  const location = useLocation();
  const { selectedBoardingPoint, selectedDroppingPoint, selectedBusSeatData, totalPrice } = location.state || {};

  const igstRate = selectedBusSeatData[0]?.Price?.GST?.IGSTRate || 0;

  const igstAmount = Math.round((totalPrice * igstRate) / 100);
  const priceWithIGST = totalPrice + igstAmount;


  console.log("Price with IGST:", priceWithIGST);


  // ---------------------------------------------------------------------------------------------------------

  const boardingPointIndex = selectedBoardingPoint || null;
  const droppingPointIndex = selectedDroppingPoint || null;
  // console.log('boardingPointIndex', boardingPointIndex)
  // console.log('droppingPointIndex', droppingPointIndex)
  // console.log('selectedBusSeatData review', selectedBusSeatData)
  // console.log("IGST Rate:", selectedBusSeatData[0].Price.GST.IGSTRate);
  const seatNames = selectedBusSeatData?.map(seat => seat.SeatName).join(', ') || 'No seats selected';


  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const [payLoading, setPayLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  //  -------------------------------------------get seat and passenger counts ---------------------------------------------------------------

  const initialFormData = {
    firstName: '',
    lastName: '',
    address: '',
    age: '',
    gender: '1',
  };

  const [formData, setFormData] = useState(initialFormData);
  // const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [passengerCount, setPassengerCount] = useState(0);


  const passInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const blockHandler = async (e) => {
    e.preventDefault();

    const passengers = (selectedBusSeatData || []).map((seat, index) => ({
      LeadPassenger: index === 0,
      PassengerId: index,
      Title: "null",
      FirstName: formData.firstName || '',
      LastName: formData.lastName || '',
      Email: "example@example.com",
      Phoneno: "9643737502",
      Gender: formData.gender || '',
      IdType: null,
      IdNumber: null,
      Address: formData.address || '',
      Age: formData.age || '',
      Seat: {
        ColumnNo: seat.ColumnNo,
        RowNo: seat.RowNo,
        SeatName: seat.SeatName,
        Height: seat.Height,
        IsLadiesSeat: seat.IsLadiesSeat,
        IsMalesSeat: seat.IsMalesSeat,
        IsUpper: seat.IsUpper,
        SeatFare: seat.SeatFare,
        SeatIndex: seat.SeatIndex,
        SeatStatus: seat.SeatStatus,
        SeatType: seat.SeatType,
        Width: seat.Width,
        Price: {
          CurrencyCode: seat.Price.CurrencyCode,
          BasePrice: seat.Price.BasePrice,
          Tax: seat.Price.Tax,
          OtherCharges: seat.Price.OtherCharges,
          Discount: seat.Price.Discount,
          PublishedPrice: seat.Price.PublishedPrice,
          PublishedPriceRoundedOff: seat.Price.PublishedPriceRoundedOff,
          OfferedPrice: seat.Price.OfferedPrice,
          OfferedPriceRoundedOff: seat.Price.OfferedPriceRoundedOff,
          AgentCommission: seat.Price.AgentCommission,
          AgentMarkUp: seat.Price.AgentMarkUp,
          TDS: seat.Price.TDS,
          GST: {
            CGSTAmount: seat.Price.GST.CGSTAmount,
            CGSTRate: seat.Price.GST.CGSTRate,
            CessAmount: seat.Price.GST.CessAmount,
            CessRate: seat.Price.GST.CessRate,
            IGSTAmount: seat.Price.GST.IGSTAmount,
            IGSTRate: seat.Price.GST.IGSTRate,
            SGSTAmount: seat.Price.GST.SGSTAmount,
            SGSTRate: seat.Price.GST.SGSTRate,
            TaxableAmount: seat.Price.GST.TaxableAmount,
          },
        },
      },
    }));

    const requestData = {
      TraceId: traceId,
      ResultIndex: selectedBusIndex,
      BoardingPointId: selectedBoardingPoint.index,
      DroppingPointId: selectedDroppingPoint.index,
      RefID: "1",
      Passenger: passengers,
    };

    console.log("Payload to be sent:", JSON.stringify(requestData, null, 2));

    try {
      console.log("Sending request to API with payload:", JSON.stringify(requestData, null, 2));

      const response = await fetch("https://sajyatra.sajpe.in/admin/api/seat-block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorMessage = result.result.api_response.Error.ErrorMessage;
        console.error("Booking error:", errorMessage);
        alert(errorMessage);
        return;
      }


      const result = await response.json();
      console.log("Block Response:", result);

      setPassengers((prev) => [...prev, ...passengers]);
      setFormData(initialFormData);
      setPassengerCount((prev) => prev + passengers.length);
    } catch (error) {
      console.error("Error adding passengers:", error);
    }
  };






  // -----------------------------------------------------------------------------------------------------------------------------------------

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [totalFare, setTotalFare] = useState(0);
  const navigate = useNavigate();

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
  }

  //  ------------------------------------------------------------------


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
    // Check if contact details are filled
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

          localStorage.setItem('payment_id', response.razorpay_payment_id);
          localStorage.setItem('transaction_id', options.transaction_id);

          setLoading(true);

          try {
            await updateHandlePayment();

            setPayLoading(true);

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
          username: newContactData.name || 'pallavi',
          email: newContactData.email || 'pallavi@gmail.com',
          mobile: newContactData.contact || '9999999999',
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




  // const bookHandler = async (e) => {
  //   e.preventDefault();

  //   const passengers = (selectedBusSeatData || []).map((seat, index) => ({
  //     LeadPassenger: index === 0,
  //     PassengerId: index,
  //     Title: "null",
  //     FirstName: ,
  //     LastName:,
  //     Email: "example@example.com",
  //     Phoneno: "9643737502",
  //     Gender:  ,
  //     IdType: null,
  //     IdNumber: null,
  //     Address: ,
  //     Age: ,
  //     Seat: {
  //       ColumnNo: seat.ColumnNo,
  //       RowNo: seat.RowNo,
  //       SeatName: seat.SeatName,
  //       Height: seat.Height,
  //       IsLadiesSeat: seat.IsLadiesSeat,
  //       IsMalesSeat: seat.IsMalesSeat,
  //       IsUpper: seat.IsUpper,
  //       SeatFare: seat.SeatFare,
  //       SeatIndex: seat.SeatIndex,
  //       SeatStatus: seat.SeatStatus,
  //       SeatType: seat.SeatType,
  //       Width: seat.Width,
  //       Price: {
  //         CurrencyCode: seat.Price.CurrencyCode,
  //         BasePrice: seat.Price.BasePrice,
  //         Tax: seat.Price.Tax,
  //         OtherCharges: seat.Price.OtherCharges,
  //         Discount: seat.Price.Discount,
  //         PublishedPrice: seat.Price.PublishedPrice,
  //         PublishedPriceRoundedOff: seat.Price.PublishedPriceRoundedOff,
  //         OfferedPrice: seat.Price.OfferedPrice,
  //         OfferedPriceRoundedOff: seat.Price.OfferedPriceRoundedOff,
  //         AgentCommission: seat.Price.AgentCommission,
  //         AgentMarkUp: seat.Price.AgentMarkUp,
  //         TDS: seat.Price.TDS,
  //         GST: {
  //           CGSTAmount: seat.Price.GST.CGSTAmount,
  //           CGSTRate: seat.Price.GST.CGSTRate,
  //           CessAmount: seat.Price.GST.CessAmount,
  //           CessRate: seat.Price.GST.CessRate,
  //           IGSTAmount: seat.Price.GST.IGSTAmount,
  //           IGSTRate: seat.Price.GST.IGSTRate,
  //           SGSTAmount: seat.Price.GST.SGSTAmount,
  //           SGSTRate: seat.Price.GST.SGSTRate,
  //           TaxableAmount: seat.Price.GST.TaxableAmount,
  //         },
  //       },
  //     },
  //   }));

  //   const requestData = {
  //     TraceId: traceId,
  //     // ResultIndex: selectedBusIndex,
  //     ResultIndex: '1',
  //     BoardingPointId: selectedBoardingPoint.index,
  //     DroppingPointId: selectedDroppingPoint.index,
  //     RefID: "1",
  //     transaction_num: transactionNoBus,
  //     bus_booking_id: [busSavedId],
  //     // transaction_id: transaction_id,
  //     transaction_id: "1",

  //     Passenger: passengers,
  //   };


  //   try {

  //     const response = await fetch("https://sajyatra.sajpe.in/admin/api/seat-book", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });


  //     const result = await response.json();
  //     console.log("Book Response:", result);

  //     if (!response.ok || (result.Error && result.Error.ErrorCode !== 0)) {
  //       const errorMessage = result.Error ? result.Error.ErrorMessage : 'Booking failed';
  //       console.error("Booking error:", errorMessage);
  //       toast.error(errorMessage);
  //       return;
  //     }

  //     toast.success('Booking successful!');
  //     localStorage.setItem('busTikitDetails', JSON.stringify(result));
  //   } catch (error) {
  //     console.error("Error during booking:", error.message);
  //     toast.error('An error occurred during booking. Please try again.');
  //   }
  // };


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
      // console.log('Bus Payment Status Response:', responseBody);

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

  if (payLoading) {
    return <PayloaderBus />;
  }

  if (loading) {
    return <Loading />;
  }


  const handleDeletePassenger = (index) => {
    // Remove the passenger at the specified index
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };


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
                    <p>Travel Name <br /> <span> {travelName}</span></p>
                    <p>Selected Seats <br /> <span> ({seatNames})</span></p>
                    <p>Boarding Point: <br /> <span> {selectedBoardingPoint.name}
                      {/* (Index: {selectedBoardingPoint.index}) */}
                    </span></p>
                    <p>Dropping Point: <br /> <span> {selectedDroppingPoint.name}
                      {/* (Index: {selectedDroppingPoint.index}) */}
                    </span> </p>

                  </div>

                </div>


                <div className="passnger-Info-page">
                  <>
                    <div className='PassangerInfo'>
                      <div className="p-upr">
                        <h6><i className="ri-user-add-line"></i>Traveller Details <br /></h6>
                        <p>
                          <span>Passenger Added: {passengers.length}   </span> / Seat Selected: {selectedSeatCount}
                        </p>
                      </div>

                      <div className='pbh'>It is compulsory to add passengers as per the number of seats.</div>

                      <div className="pessanger-main">
                        <form onSubmit={blockHandler}>
                          <div className="travelller">
                            <div className="p-top">
                              <div className="pas">
                                <div className="ipt">
                                  <label>Male</label>
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={formData.gender === '1'}
                                    onChange={passInputChange}
                                  />
                                </div>
                                <div className="ipt">
                                  <label>Female</label>
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="2"
                                    checked={formData.gender === '2'}
                                    onChange={passInputChange}
                                  />
                                </div>
                              </div>
                              <p className="p-mid">
                                <div className="p-form">
                                  <label htmlFor="firstName">First Name <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={passInputChange}
                                    placeholder="Enter First Name"
                                    className="form-control"
                                  />
                                </div>
                                <div className="p-form">
                                  <label htmlFor="lastName">Last Name <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={passInputChange}
                                    placeholder="Enter Last Name"
                                    className="form-control"
                                  />
                                </div>
                                <div className="p-form">
                                  <label htmlFor="address">Address <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={passInputChange}
                                    placeholder="Address"
                                    className="form-control"
                                  />
                                </div>
                                <div className="p-form">
                                  <label htmlFor="age">Age <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^\d*$/.test(value) && (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120))) {
                                        passInputChange(e);
                                      }
                                    }}
                                    placeholder="Age"
                                    className="form-control"
                                  />
                                </div>
                              </p>
                            </div>
                          </div>
                          <div className="p-btn">
                            <button type='submit'>Add Passenger</button>
                          </div>
                        </form>
                      </div>

                      <div className="passenger-details-display">
                        <h6>Added Passengers:</h6>
                        <div className="passenger-list">
                          <div className="passenger-headings">
                            <span>Name</span>
                            <span>Age</span>
                            <span>Gender</span>
                            <span>Address</span>
                            <span>Action</span>
                          </div>
                          {passengers.map((passenger, index) => (
                            <div key={index} className="passenger-item">
                              <span>{passenger.FirstName} {passenger.LastName}</span>
                              <span>{passenger.Age}</span>
                              <span>{passenger.Gender === '1' ? 'Male' : 'Female'}</span>
                              <span>{passenger.Address}</span>
                              <span>
                                <i
                                  style={{ cursor: "pointer", color: "red" }}
                                  className="ri-delete-bin-6-line"
                                  onClick={() => handleDeletePassenger(index)}></i>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>

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
                        <small >₹{priceWithIGST}</small>
                      </div>
                      <div className="review-pay">
                        <button
                          onClick={handlePayment}
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
                    <small>₹{totalPrice}</small>
                  </div>
                  <div className="p-line">
                    <span>Taxes</span>
                    <small>{0}</small>
                  </div>
                  <div className="total-fare">
                    <span>Total Price</span>
                    <small>{0}</small>
                  </div>
                  <div className="p-line">
                    <span>Convenience Fee</span>
                    <small>0</small>
                  </div>
                  <div className="p-line">
                    <span>Discount</span>
                    <small>{0}</small>
                  </div>
                  <div className="p-line">
                    <span>IGST </span>
                    <small>(18%)</small>
                  </div>
                  <div className="coupen">
                    <span>Offered Price</span>
                    <small>{0}</small>
                  </div>
                  <div className="final-pay">
                    <span>Total Payment</span>
                    <small>₹{priceWithIGST}</small>
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