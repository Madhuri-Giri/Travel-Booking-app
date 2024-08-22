import React, { useEffect, useState } from 'react';
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

const GuestDetails = () => {
  const [hotelBlock, setHotelBlock] = useState([]);
  const [selectedRoomsData, setSelectedRoomsData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    mobile: "",
    age:"",
    paxType: "",
    leadPassenger:"",
    passportNo: "",
    passportIssueDate:"",
    passportExpDate:"",
    PAN:"",
  });

  const navigate = useNavigate(); 
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceWithGST, setTotalPriceWithGST] = useState(0);
  const gstRate = 18; // GST rate in percentage
  
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
        
        // Calculate total price with GST
        const totalWithGST = calculateTotalWithGST(total, gstRate);
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
 
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
     // Save form data to localStorage
     localStorage.setItem('guestDetails', JSON.stringify(formData));
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
    
  };
// ---------------- RozarPay Payment Gateway  Integration start -------------------
const fetchPaymentDetails = async () => {
  try {
    const loginId = localStorage.getItem('loginId');
    const transactionNum = localStorage.getItem('transactionNum');

    if (!loginId || !transactionNum) {
      throw new Error('Login ID or Transaction Number is missing.');
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
     const loginId = localStorage.getItem('loginId');
    if (!loginId) {
      navigate('/enter-number'); 
      return;
    }
  
    e.preventDefault();
    try {
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
          name: `${formData.fname} ${formData.mname} ${formData.lname}`,
          email: formData.email,
          contact: formData.mobile,
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
        transaction_id,
        payment_id
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        console.error('Failed to update payment details. Status:', response.status);
        throw new Error('Failed to update payment details');
      }

      const data = await response.data;
      console.log('Update successful:', data);
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


const bookHandler = async () => {
  try {

    
     // Retrieve transactionNum from localStorage
     const transactionNum = localStorage.getItem('transactionNum');
     const transaction_id = localStorage.getItem('transaction_id');

    const bookingPayload = {
      ResultIndex: "9",
      HotelCode: "92G|DEL",
      HotelName: "The Manor",
      GuestNationality: "IN",
      NoOfRooms: "1",
      ClientReferenceNo: 0,
      IsVoucherBooking: true,
      transaction_num: transactionNum,
      transaction_id:transaction_id,
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
              SupplierPrice: null,
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
              HotelPassenger: [
                  {
                      Title: "Mr",
                      FirstName: formData.fname,
                      MiddleName: formData.mname,
                      LastName: formData.lname,
                      Phoneno: formData.mobile,
                      Email: formData.email,
                      PaxType: "1",
                      LeadPassenger: true,
                      PassportNo: null,
                      PassportIssueDate: null,
                      PassportExpDate: null,
                      PAN: "XXXXXXXXXX"
                  },
                  {
                      Title: "Mstr",
                      FirstName: formData.fname,
                      MiddleName: formData.mname,
                      LastName: formData.lname,
                      Phoneno: formData.mobile,
                      Email: formData.email,
                      PaxType: "2",
                      LeadPassenger: false,
                      Age: "8",
                      PassportNo: null,
                      PassportIssueDate: null,
                      PassportExpDate: null,
                      PAN: "XXXXXXXXXX"
                  }
              ],
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
      console.error('Failed to hotel booking . Status:', response.status, 'Response:', responseBody);
      throw new Error(`Failed to Hotel booking . Status: ${response.status}`);
    }

    if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
      console.error('Booking failed:', responseBody.Error.ErrorMessage);
      toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
    } else {
      toast.success('Hotel Booking successful!');

      localStorage.setItem('HotelBookingDetails', JSON.stringify(responseBody));
// Retrieve guest details from localStorage
 const guestDetails = JSON.parse(localStorage.getItem('guestDetails'));
      setTimeout(() => {
navigate('/booking-history', { state: { bookingDetails: responseBody.hotelBooking} });

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

  let cleanedDescription = he.decode(description); // Decode HTML entities
  cleanedDescription = cleanedDescription.replace(/<\/?(ul|li|b|i|strong|em|span)\b[^>]*>/gi, ''); // Remove specific tags
  cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<p\s*\/?>|<\/p>/gi, '\n'); // Replace tags with newlines
  cleanedDescription = cleanedDescription.replace(/\\|\|/g, ''); // Remove slashes and pipes
  cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' '); // Replace multiple spaces
  cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n'); // Replace multiple newlines
  cleanedDescription = cleanedDescription.replace(/\/\/+|\\|\|/g, '');
  cleanedDescription = cleanedDescription.trim(); // Trim leading/trailing whitespace
  cleanedDescription = cleanedDescription.replace(/"/g, ''); // Remove single quotes
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
  <h2 className="section-title">Guest <span style={{color:"#00b7eb"}}>Details</span> </h2>
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
              ) : <p>No hotel policy details available.</p>}
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

              {/* {HotelNorms ? (
                <div className="hotel-norms">
                  <h4>Hotel Norms</h4>
                  <p>{cleanHotelNorms(HotelNorms)}</p>
                </div>
              ) : <p>No hotel norms available.</p>} */}
            </div>

            <div className="room-details-container">
              {/* <h4>Selected Single Deluxe Rooms</h4> */}
              {singleDeluxe.map((room, index) => (
                <div key={index}>
                  <p>Room Type: {room.RoomTypeName}</p>
                  <p>Quantity: {room.guestCounts.room}</p>
                  <p>Total Price: INR {totalPriceSingleDeluxe.toFixed(2)}</p>
                  <div className="payment-summary">
        <p><strong>Total Price:</strong> {totalPriceWithGST.toFixed(2)}</p>
        <p><strong>GST (18%):</strong> {((totalPriceWithGST - totalPrice) / totalPrice * 100).toFixed(2)}%</p>
      </div>
                </div>

              ))}
              
              {/* <h4>Selected Double Deluxe Rooms</h4> */}
              {doubleDeluxe.map((room, index) => (
                <div key={index}>
                  <p>Room Type: {room.RoomTypeName}</p>
                  <p>Quantity: {room.guestCounts.room}</p>
                  <p>Total Price: INR {totalPriceDoubleDeluxe.toFixed(2)}</p>
                  <div className="payment-summary">
        <p><strong>Total Price:</strong> {totalPriceWithGST.toFixed(2)}</p>
        <p><strong>GST (18%):</strong> {((totalPriceWithGST - totalPrice) / totalPrice * 100).toFixed(2)}%</p>
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
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Passport No."
                  name="passportNo"
                  value={formData.passportNo}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 date-picker-container">
         <input
          type="date"
          value={formData.passportIssueDate ? formData.passportIssueDate.toISOString().split('T')[0] : ''}
           onChange={(e) => handleChange(e.target.value, 'passportIssueDate')}
          min={new Date().toISOString().split('T')[0]}  
            className="form-control full-width"  
                />
                  <label className="custom-placeholder">Passport Issue Date</label> 
                      </div>

                  <div className="mb-3 date-picker-container">
                 <input
          type="date"
                   value={formData.passportExpDate ? formData.passportExpDate.toISOString().split('T')[0] : ''}
                       onChange={(e) => handleChange(e.target.value, 'passportExpDate')}
             min={new Date().toISOString().split('T')[0]}  
                  className="form-control full-width" 
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
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Pax Type"
                  name="paxType"
                  value={formData.paxType}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <button className='submit-btn' type="submit">Save</button>
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
                  <label  className='check_btn'>
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
