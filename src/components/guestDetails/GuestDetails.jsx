import React, { useEffect, useState, useRef } from 'react';
import './GuestDetails.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Accordion from 'react-bootstrap/Accordion';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";
import he from 'he';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import parse from 'html-react-parser';

const GuestDetails = () => {
 
  const [hotelBlock, setHotelBlock] = useState([]);
  const [selectedRoomsData, setSelectedRoomsData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const NoOfAdults = parseInt(localStorage.getItem('numberOfAdults'), 10) || 1;

  const [guestForms, setGuestForms] = useState(Array(NoOfAdults).fill({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    mobile: "",
    age: "",
    paxType: "",
    leadPassenger: "",
    passportNo: "",
    passportIssueDate: "",
    passportExpDate: "",
    PAN: "",
  }));

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceWithGST, setTotalPriceWithGST] = useState(0);

  const gstRate = parseFloat(localStorage.getItem('hotel-igst')) || 18;
  const discount = parseFloat(localStorage.getItem('hotel-discount')) || 0;

  const [timer, setTimer] = useState(600000);
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 50);
    }, 50);

    if (timer <= 0) {
      clearInterval(countdown);
      navigate('/hotel-room');
    }

    return () => clearInterval(countdown);
  }, [timer, navigate]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec left`;
  };

  const navigateSearch = () => {
    navigate('/hotel-room');
  };

  // Function to calculate total price with GST
  const calculateTotalWithGST = (amount, gstRate) => {
    return amount + (amount * gstRate / 100);
  };

  // Function to apply discount
  const applyDiscount = (amount, discount) => {
    return amount - (amount * discount / 100);
  };

  useEffect(() => {
    // Retrieve and parse the selectedRoomsData from localStorage
    const selectedRoomsData = localStorage.getItem('selectedRoomsData');

    if (selectedRoomsData) {
      try {
        const parsedData = JSON.parse(selectedRoomsData);

        // Extract the total prices
        const totalPriceDoubleDeluxe = parseFloat(parsedData.totalPriceDoubleDeluxe) || 0;
        const totalPriceSingleDeluxe = parseFloat(parsedData.totalPriceSingleDeluxe) || 0;

        // Calculate the total price
        const total = totalPriceDoubleDeluxe + totalPriceSingleDeluxe;
        setTotalPrice(total);

        // Apply discount
        const discountedPrice = applyDiscount(total, discount);

        // Calculate total price with GST
        const totalWithGST = calculateTotalWithGST(discountedPrice, gstRate);
        setTotalPriceWithGST(totalWithGST);

        // Optionally store total price with GST in localStorage
        localStorage.setItem('totalPriceWithGST', totalWithGST.toFixed(2));

      } catch (error) {
        console.error('Error parsing selectedRoomsData:', error);
      }
    } else {
      console.log('No selectedRoomsData found in localStorage');
    }
  }, []);


  useEffect(() => {
    const hotelBlockData = localStorage.getItem('hotelBlock');

    const selectedRoomsData = localStorage.getItem('selectedRoomsData');

    if (hotelBlockData) {
      try {
        const parsedData = JSON.parse(hotelBlockData);
        setHotelBlock(parsedData);
      } catch (error) {
        console.error('Error parsing hotelBlock:', error);
      }
    }

    if (selectedRoomsData) {
      try {
        const parsedData = JSON.parse(selectedRoomsData);
        setSelectedRoomsData(parsedData);
      } catch (error) {
        console.error('Error parsing selectedRoomsData:', error);
      }
    }
  }, []);

  if (!selectedRoomsData) {
    return <p>Loading...</p>;
  }
  const handleDateChange = (index, date, field) => {
    const newGuestForms = [...guestForms];
    newGuestForms[index] = {
      ...newGuestForms[index],
      [field]: date,
    };
    setGuestForms(newGuestForms);
  };

  const handleFormChange = (index, e) => {
    const { name, value } = e.target;
    const newGuestForms = [...guestForms];
    newGuestForms[index] = {
      ...newGuestForms[index],
      [name]: value,
    };
    setGuestForms(newGuestForms);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    localStorage.setItem('guestDetails', JSON.stringify(guestForms));
  };


  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  // const handleDateChange = (index, date, field) => {
  //   const newGuestForms = [...guestForms];
  //   newGuestForms[index] = {
  //     ...newGuestForms[index],
  //     [field]: date,
  //   };
  //   setGuestForms(newGuestForms);
  // };
  // ---------------- RozarPay Payment Gateway  Integration start -------------------
  const fetchPaymentDetails = async () => {
    try {
      const loginId = localStorage.getItem('loginId');
      const transactionNum = localStorage.getItem('transactionNum');
      const hotel_booking_id = localStorage.getItem('hotelBlockId');

      if (!loginId || !transactionNum || !hotel_booking_id) {
        throw new Error('Login ID or Transaction Number or Hotel booking Id is missing.');
      }

      // Handling decimal digits of the amount
      const roundedAmount = Math.round(totalPriceWithGST * 100) / 100;

      // Ensure roundedAmount is a valid number
      if (isNaN(roundedAmount) || roundedAmount <= 0) {
        throw new Error('Invalid amount value.');
      }

      // Construct the payload with necessary fields
      const payload = {
        amount: roundedAmount,
        user_id: loginId,
        transaction_num: transactionNum,
        hotel_booking_id: hotel_booking_id
      };

      console.log('Sending payload:', payload);

      // API call
      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-payment', payload);

      if (response.data.status === 'success') {
        setPaymentDetails(response.data.payment_details);
        console.log('Payment details fetched:', response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment details');
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      alert('Failed to initiate payment. Please try again.');
      return null;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const loginId = localStorage.getItem('loginId');
    if (!loginId) {
      navigate('/enter-number');
      return;
    }

    try {
      const paymentData = await fetchPaymentDetails();
      if (!paymentData) return;

      // Assuming the first guest is the lead guest
      const leadGuest = guestForms[0];

      const options = {
        key: paymentData.razorpay_key,
        amount: paymentData.payment_details.amount * 100, // Amount in paise
        currency: 'INR',
        transaction_id: paymentData.payment_details.id,
        name: 'SRN Infotech',
        description: 'Test Transaction',
        image: 'https://your-logo-url.com/logo.png',
        handler: async function (response) {
          console.log('Payment successful', response);
          localStorage.setItem('payment_id', response.razorpay_payment_id);
          localStorage.setItem('transaction_id', options.transaction_id);

          alert('Payment successful!');

          try {
            await updateHandlePayment();
            await bookHandler();
          } catch (error) {
            console.error('Error during updateHandlePayment or bookHandler:', error.message);
            alert('An error occurred during processing. Please try again.');
          }
        },
        prefill: {
          name: `${leadGuest.fname} ${leadGuest.mname} ${leadGuest.lname}`,
          email: leadGuest.email,
          contact: leadGuest.mobile,
        },
        notes: {
          address: 'Some Address',
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

  const updateHandlePayment = async () => {
    try {
      const payment_id = localStorage.getItem('payment_id');
      const transaction_id = localStorage.getItem('transaction_id');

      if (!payment_id || !transaction_id) {
        throw new Error('Missing payment details');
      }

      const url = 'https://sajyatra.sajpe.in/admin/api/update-payment';
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
      console.log('statusHotel', status);

      switch (status) {
        case 'pending':
          toast.info('Payment is pending. Please wait.');
          break;
        case 'failed':
          toast.error('Payment failed. Redirecting to hotel search page.');
          navigate('/hotel-search');
          break;
        case 'success':
          toast.success('Payment updated successfully!');
          break;
        default:
          toast.warn('Unknown payment status. Please contact support.');
      }


    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }
  };

  // ----------------Payment Integration End -------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  ----------------------------Start book api-----------------------------------
      // Construct the booking payload
      const bookHandler = async () => {
        try {
          const transactionNum = localStorage.getItem('transactionNum');
          const transaction_id = localStorage.getItem('transaction_id');
          const hotel_booking_id = localStorage.getItem('hotelBlockId');
    
          if (!transactionNum || !transaction_id || !hotel_booking_id) {
            throw new Error('Required data missing for booking.');
          }
    
          const bookingPayload = {
            ResultIndex: "9",
            HotelCode: "92G|DEL",
            HotelName: "The Manor",
            GuestNationality: "IN",
            NoOfRooms: "1",
            ClientReferenceNo: 0,
            IsVoucherBooking: true,
            transaction_num: transactionNum,
            transaction_id: transaction_id,
            hotel_booking_id: hotel_booking_id,
            HotelRoomsDetails: [
              {
                ChildCount: 0,
                RequireAllPaxDetails: false,
                RoomId: 0,
                RoomStatus: 0,
                RoomIndex: 4,
                RoomTypeCode: "211504640|4|1",
                RoomTypeName: "Deluxe Room",
                RatePlanCode: "230104963",
                RatePlan: 13,
                InfoSource: "FixedCombination",
                SequenceNo: "EA~~341089~4",
                DayRates: [
                  {
                    Amount: 12325,
                    Date: "2019-09-28T00:00:00"
                  }
                ],
                Price: {
                  CurrencyCode: "INR",
                  RoomPrice: 12325,
                  Tax: 3113.3,
                  ExtraGuestCharge: 0,
                  ChildCharge: 0,
                  OtherCharges: 26,
                  Discount: 2175,
                  PublishedPrice: 15464.3,
                  PublishedPriceRoundedOff: 15464,
                  OfferedPrice: 15464.3,
                  OfferedPriceRoundedOff: 15464,
                  AgentCommission: 0,
                  AgentMarkUp: 0,
                  ServiceTax: 4.68,
                  TDS: 0,
                  ServiceCharge: 0,
                  TotalGSTAmount: 4.68,
                  GST: {
                    CGSTAmount: 0,
                    CGSTRate: 0,
                    CessAmount: 0,
                    CessRate: 0,
                    IGSTAmount: 4.68,
                    IGSTRate: 18,
                    SGSTAmount: 0,
                    SGSTRate: 0,
                    TaxableAmount: 26
                  }
                },
                HotelPassenger: guestForms.map((guest, index) => ({
                  Title: index === 0 ? "Mr" : "Mstr", // Adjust as needed
                  FirstName: guest.fname,
                  MiddleName: guest.mname,
                  LastName: guest.lname,
                  Phoneno: guest.mobile,
                  Email: guest.email,
                  PaxType: index === 0 ? "1" : "2", // Adjust as needed
                  LeadPassenger: index === 0,
                  PassportNo: guest.passportNo || null,
                  PassportIssueDate: guest.passportIssueDate || null,
                  PassportExpDate: guest.passportExpDate || null,
                  PAN: guest.PAN || "XXXXXXXXXX"
                })),
                RoomPromotion: "Member’s exclusive price",
                Amenities: [
                  "Breakfast Buffet"
                ],
                SmokingPreference: "0",
                BedTypes: [
                  {
                    BedTypeCode: "13",
                    BedTypeDescription: "1 double bed"
                  }
                ],
                HotelSupplements: [],
                LastCancellationDate: "2019-09-17T00:00:00",
                CancellationPolicies: [
                  {
                    Charge: 100,
                    ChargeType: 2,
                    Currency: "INR",
                    FromDate: "2019-09-18T00:00:00",
                    ToDate: "2019-09-26T23:59:59"
                  },
                  {
                    Charge: 100,
                    ChargeType: 2,
                    Currency: "INR",
                    FromDate: "2019-09-27T00:00:00",
                    ToDate: "2019-09-29T23:59:59"
                  },
                  {
                    Charge: 100,
                    ChargeType: 2,
                    Currency: "INR",
                    FromDate: "2019-09-28T00:00:00",
                    ToDate: "2019-09-29T00:00:00"
                  }
                ],
                CancellationPolicy: "Deluxe Room#^#100.00% of total amount will be charged, If cancelled between 18-Sep-2019 00:00:00 and 26-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 27-Sep-2019 00:00:00 and 29-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 28-Sep-2019 00:00:00 and 29-Sep-2019 00:00:00.|#!#",
                Inclusion: [
                  "Breakfast Buffet"
                ],
                BedTypeCode: "13",
                Supplements: null
              }
            ],
            ArrivalTime: "2019-09-28T00:00:00",
            IsPackageFare: true,
            SrdvType: "SingleTB",
            SrdvIndex: "SrdvTB",
            TraceId: "1",
            EndUserIp: "1.1.1.1",
            ClientId: "XXXX",
            UserName: "XXXX",
            Password: "XXXX"
          };
    
          const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-book', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingPayload),
          });
    
          const responseBody = await response.json();
          console.log('Hotel Booking Confirmation Response:', responseBody);
    
          if (!response.ok) {
            console.error('Failed to hotel booking. Status:', response.status, 'Response:', responseBody);
            throw new Error(`Failed to Hotel booking. Status: ${response.status}`);
          }
    
          if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
            console.error('Booking failed:', responseBody.Error.ErrorMessage);
            toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
          } else {
            toast.success('Hotel Booking successful!');
    
            localStorage.setItem('HotelBookingDetails', JSON.stringify(responseBody));
            const guestDetails = JSON.parse(localStorage.getItem('guestDetails'));
    
            setTimeout(() => {
              navigate('/booking-history', { state: { bookingDetails: responseBody.hotelBooking } });
            }, 2000);
          }
        } catch (error) {
          console.error('Error during hotel booking:', error.message);
          toast.error('An error occurred during hotel booking. Please try again.');
        }
      };
    
  const { AddressLine1, HotelName, HotelRoomsDetails, HotelPolicyDetail, HotelNorms } = hotelBlock;
  const { singleDeluxe, doubleDeluxe, totalPriceSingleDeluxe, totalPriceDoubleDeluxe, checkInDate, checkOutDate } = selectedRoomsData;

  // -------------------------------End Book API--------------------------------------------

  const cleanUpDescription = (description) => {
    if (!description) return '';
    let cleanedDescription = he.decode(description);
    cleanedDescription = cleanedDescription.replace(/<\/?(ul|li|b|i|strong|em|span)\b[^>]*>/gi, '');
    cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<p\s*\/?>|<\/p>/gi, '\n');
    cleanedDescription = cleanedDescription.replace(/\\|\|/g, '');
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' ');
    cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n');
    cleanedDescription = cleanedDescription.replace(/\/\/+|\\|\|/g, '');
    cleanedDescription = cleanedDescription.trim();
    cleanedDescription = cleanedDescription.replace(/"/g, '');
    cleanedDescription = cleanedDescription.replace(/<\/li>/gi, '\n');
    cleanedDescription = cleanedDescription.replace(/<\/?ul>/gi, '\n');
    cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<\/p>|<p\s*\/?>/gi, '\n');
    cleanedDescription = cleanedDescription.replace(/<\/?(b|i|strong|em|span)\b[^>]*>/gi, '');
    cleanedDescription = cleanedDescription.replace(/\\|\|/g, '');
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' ');
    cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n');
    cleanedDescription = cleanedDescription.trim();
    cleanedDescription = cleanedDescription.replace(/(?:Valid From|Check-in hour|Identification card at arrival)/gi, '\n$&');
    cleanedDescription = cleanedDescription.replace(/<li>/gi, (match, offset, string) => {
      const listItems = string.split('</li>');
      const index = listItems.indexOf(match);
      return `${index + 1}. `;
    });
    return cleanedDescription;
  };

  return (
    <>
      <CustomNavbar />
      <div className="timer">
        <div> <p><RiTimerLine /> Redirecting in {formatTime(timer)}...</p> </div>
      </div>

      <div className="guest_bg">
        <div className="guest-details-container">
          <h2 className="section-title">Guest <span style={{ color: "#00b7eb" }}>Details</span> </h2>
          <div className="details-wrapper">
            <div className="left-side">
              <h3>{HotelName}</h3>
              <h5>{AddressLine1}</h5>
            </div>
            <div className="right-side">
              <p><strong>Check-in Date:</strong> {checkInDate}</p>
              <p><strong>Check-out Date:</strong> {checkOutDate}</p>
            </div>
          </div>
          {HotelRoomsDetails && HotelRoomsDetails.length > 0 ? (
            HotelRoomsDetails.map((room, index) => (
              <div key={index} className="guest-details-card">

                <div className="hotel-policies">
                  <Accordion className="accordian_space">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header><b>Hotel Policies:</b></Accordion.Header>
                      <Accordion.Body>
                        {HotelPolicyDetail ? (
                          <div className="hotel-policy">
                            <h4>Policy Details</h4>
                            <p>{cleanUpDescription(HotelPolicyDetail)}</p>
                          </div>
                        ) : (
                          <p>No hotel policy details available.</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <Accordion className="accordian_space">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header><b>Hotel Policies:</b></Accordion.Header>
                      <Accordion.Body>
                        {HotelPolicyDetail ? (
                          <div className="hotel-policy">
                            <h4>Hotel Norms</h4>
                            <p>{cleanUpDescription(HotelNorms)}</p>
                          </div>
                        ) : <p>No hotel norms available.</p>}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                <div className="room-details-container">
                  {/* <h4>Selected Single Deluxe Rooms</h4> */}
                  {singleDeluxe.map((room, index) => (
                    <div key={index}>
                      <p>Room Type: {room.RoomTypeName}</p>
                      <p>Quantity: {room.guestCounts.room}</p>
                      <p> Price:  ₹{totalPriceSingleDeluxe.toFixed(2)}</p>

                      <div className="payment-summary">
                        {/* <p><strong>Total Price:</strong> {totalPriceWithGST.toFixed(2)}</p> */}
                        {/* <p><strong>GST (18%):</strong> {((totalPriceWithGST - totalPrice) / totalPrice * 100).toFixed(2)}%</p> */}
                        <p>GST ({gstRate}%): ₹{((applyDiscount(totalPrice, discount) * gstRate) / 100).toFixed(2)}</p>
                        <p>Total Price with GST: ₹{totalPriceWithGST.toFixed(2)}</p>
                        <p>Discount: -₹{(totalPrice * discount / 100).toFixed(2)}</p>
                        <p>Price After Discount: ₹{applyDiscount(totalPrice, discount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  {/* <h4>Selected Double Deluxe Rooms</h4> */}
                  {doubleDeluxe.map((room, index) => (
                    <div key={index}>
                      <p>Room Type: {room.RoomTypeName}</p>
                      <p>Quantity: {room.guestCounts.room}</p>
                      <p>Total Price: ₹  {totalPriceDoubleDeluxe.toFixed(2)}</p>
                      <div className="payment-summary">
                        <p>GST ({gstRate}%): ₹ {((applyDiscount(totalPrice, discount) * gstRate) / 100).toFixed(2)}</p>
                        <p>Total Price with GST: ₹ {totalPriceWithGST.toFixed(2)}</p>
                        <p>Discount: ₹ {(totalPrice * discount / 100).toFixed(2)}</p>
                        <p>Price After Discount: ₹ {applyDiscount(totalPrice, discount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {!showForm && (
                  <button className='submit-btn' onClick={() => setShowForm(true)}>Add Details</button>
                )}

                {showForm && !formSubmitted && (
                  /* ---------Start form----------- */
                  <div className="form-container">
                    <div className="form-content">
                      <h2 className="text-center">Enter Your Details</h2>
                      <form onSubmit={handleFormSubmit}>
                        {guestForms.map((formData, index) => (
                          <div key={index} className="guest-form">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="First Name"
                                    name="fname"
                                    value={formData.fname}
                                    onChange={(e) => handleFormChange(index, e)}
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Middle Name (Optional)"
                                    name="mname"
                                    value={formData.mname}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Last Name"
                                    name="lname"
                                    value={formData.lname}
                                    onChange={(e) => handleFormChange(index, e)}
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleFormChange(index, e)}
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Contact Number"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={(e) => handleFormChange(index, e)}
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="PAN No./Aadhaar Card No."
                                    name="number"
                                    value={formData.number}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-3">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Age"
                                    name="age"
                                    value={formData.age}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>

                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Passport No."
                                    name="passportNo"
                                    value={formData.passportNo}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>

                                <div className="mb-3">
                        <DatePicker
                          selected={formData.passportIssueDate}
                          onChange={(date) => handleDateChange(index, date, 'passportIssueDate')}
                          placeholderText="Passport Issue Date"
                          className="form-control full-width"
                          minDate={new Date()}
                        />
                        <label className="custom-placeholder">Passport Issue Date</label>
                      </div>

                      <div className="mb-3">
                        <DatePicker
                          selected={formData.passportExpDate}
                          onChange={(date) => handleDateChange(index, date, 'passportExpDate')}
                          placeholderText="Passport Expiry Date"
                          className="form-control full-width"
                          minDate={new Date()}
                        />
                        <label className="custom-placeholder">Passport Expiry Date</label>
                      </div>

                                <div className="mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Lead Passenger (Yes/No)"
                                    name="leadPassenger"
                                    value={formData.leadPassenger}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Pax Type"
                                    name="paxType"
                                    value={formData.paxType}
                                    onChange={(e) => handleFormChange(index, e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <button className='submit-btn' type="submit">Save</button>
                          </div>
                        ))}
                      </form>
                    </div>
                  </div>
                )}
                {formSubmitted && (
                  <div>
                    {/* <h2>Guest Details</h2>
                  <p><strong>First Name:</strong> {formData.fname}</p>
                  <p><strong>Middle Name:</strong> {formData.mname}</p>
                  <p><strong>Last Name:</strong> {formData.lname}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Mobile:</strong> {formData.mobile}</p> */}
                    <label className='check_btn'>
                      <input
                        type="checkbox"
                        checked={checkboxChecked}
                        onChange={handleCheckboxChange}
                      />
                      Confirm details are correct
                    </label>
                    {checkboxChecked && (
                      <button className='submit-btn' onClick={handlePayment}>Proceed to Payment</button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="submit-btn">No room details available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default GuestDetails;
