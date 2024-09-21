import React, { useEffect, useState, useRef } from 'react';
import './GuestDetails.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
import Loading from '../../pages/loading/Loading';
import PayloaderHotel from '../../pages/loading/PayloaderHotel';
import Timer from '../timmer/Timer';
import Popup from '../guestDetails/PopUp'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelRooms } from '../../redux-toolkit/slices/hotelRoomSlice';
import { blockHotelRooms } from '../../redux-toolkit/slices/hotelBlockSlice';
import { bookHotel } from '../../redux-toolkit/slices/hotelBookSlice';

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
    passportNo: "",
    pan: "",
    paxType: "",
    leadPassenger: "",
    // passportIssueDate: "",
    // passportExpDate: "",
  }));

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  
  const location = useLocation();
  const { hotelRoomsDetails, bookingStatus } = location.state || {};

  console.log('Booking status from block API:', bookingStatus);

    const { HotelName, AddressLine1, checkInDate, checkOutDate, HotelPolicyDetail, HotelNorms } = hotelRoomsDetails || {};

  const [errors, setErrors] = useState({});

  const setErrorState = (index, field, message) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${index}-${field}`]: message,
    }));
  };
 
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
 // Check if all fields are filled
 const allFilled = newGuestForms.every(formData =>
  formData.fname && formData.lname && formData.email && formData.mobile &&
  formData.age && formData.passportNo && formData.pan
);

setIsFormComplete(allFilled);
setCheckboxChecked(allFilled); 
};

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    localStorage.setItem('guestDetails', JSON.stringify(guestForms));
    setShowPopup(true); 
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
};
  // ---------------- RozarPay Payment Gateway  Integration start -------------------
  const fetchPaymentDetails = async () => {
    try {
        const loginId = localStorage.getItem('loginId');
        const transactionNum = localStorage.getItem('transactionNum');
        // Get the ID from bookingStatus if it exists
        const bookingId = bookingStatus && bookingStatus.length > 0 ? bookingStatus[0].id : null;

        console.log('loginId:', loginId);
        console.log('transactionNum:', transactionNum);
        console.log('hotel_booking_id:', bookingId); // Use bookingId here

        if (!loginId || !transactionNum || !bookingId) { // Check bookingId instead of hotel_booking_id
            throw new Error('Login ID, Transaction Number, or Hotel Booking ID is missing.');
        }

        const payload = {
            amount: 100,
            user_id: loginId,
            transaction_num: transactionNum,
            hotel_booking_id: [bookingId], // Use bookingId in payload
        };

        console.log('Sending payload:', payload);

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

          setPayLoading(true);

          try {
            await updateHandlePayment();

            setPayLoading(false);

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
      // --------------Update payment------------
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

  const [selectedRoom, setSelectedRoom] = useState(null);
  const hotelRooms = location.state?.hotelRooms || [];
  
  const { loading, error } = useSelector((state) => state.hotelRooms || {});
  const { hotels = [], srdvType, resultIndexes, srdvIndexes, hotelCodes, traceId } = useSelector((state) => state.hotelSearch || {});

  //  ----------------------------Start book api-----------------------------------
      // Construct the booking payload
      let isProcessing = false;

      const bookHandler = async (index) => {

        if (index < 0 || index >= hotels.length) {
          console.error('Invalid hotel index:', index);
          return;
      }

      const resultIndex = resultIndexes[index];
      const srdvIndex = srdvIndexes[index];
      const hotelCode = hotelCodes[index];

       console.log('Result Index:', resultIndex);
    console.log('SRDV Index:', srdvIndex);
    console.log('Hotel Code:', hotelCode);

      if (resultIndex === undefined || srdvIndex === undefined || hotelCode === undefined) {
          console.error('One or more values are undefined. Check your data arrays.');
          return;
      }

      if (isProcessing || !selectedRoom) return;
      isProcessing = true;

        if (isProcessing) return;
        isProcessing = true;
      
        const formatDate = (date) => {
          const d = new Date(date);
          return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 19) : d.toISOString().slice(0, 19);
        };
      
        const errors = [];
      
        // Validate required fields
        guestForms.forEach((formData, index) => {
          if (!formData.fname || formData.fname.length < 2 || formData.fname.length > 30) {
            errors.push(`First Name is required and must be between 2 and 30 characters at index ${index}`);
          }
          if (!formData.lname || formData.lname.length < 2 || formData.lname.length > 30) {
            errors.push(`Last Name is required and must be between 2 and 30 characters at index ${index}`);
          }
          if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
            errors.push(`A valid Email is required at index ${index}`);
          }
          if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            errors.push(`Contact Number must be 10 digits at index ${index}`);
          }
          if (formData.age === '' || isNaN(formData.age) || formData.age < 18 || formData.age > 100) {
            errors.push(`Age must be between 18 and 100 at index ${index}`);
          }
          if (!["Yes", "No"].includes(formData.leadPassenger)) {
            errors.push(`Lead Passenger must be 'Yes' or 'No' at index ${index}`);
          }
          if (![1, 2].includes(Number(formData.paxType))) {
            errors.push(`Pax Type must be '1' (for Adult) or '2' (for Child) at index ${index}`);
          }
        });
      
        if (errors.length > 0) {
          toast.error(errors.join(', '));
          isProcessing = false;
          return;
        }
        try {

          const bookingId = bookingStatus && bookingStatus.length > 0 ? bookingStatus[0].id : null;

          const transactionNum = localStorage.getItem('transactionNum');
          const transaction_id = localStorage.getItem('transaction_id');
          // const hotel_booking_id = localStorage.getItem('hotelBlockId');
      
          if (!transactionNum || !transaction_id || !bookingId) {
            throw new Error('Required data missing for booking.');
          }
      
          const guestDetails = guestForms;
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
            bookingId: [bookingId],
            HotelRoomsDetails: [
              {
                  ChildCount: selectedRoom.ChildCount || 0,
                  RequireAllPaxDetails: selectedRoom.RequireAllPaxDetails || false,
                  RoomId: selectedRoom.RoomId || 0,
                  RoomStatus: selectedRoom.RoomStatus || 0,
                  RoomIndex: selectedRoom.RoomIndex || 0,
                  RoomTypeCode: selectedRoom.RoomTypeCode || 'DEFAULT_CODE',
                  RoomTypeName: selectedRoom.RoomTypeName || 'Unknown',
                  RatePlanCode: selectedRoom.RatePlanCode || '',
                  RatePlan: selectedRoom.RatePlan || 0,
                  InfoSource: selectedRoom.InfoSource || 'Unknown',
                  SequenceNo: selectedRoom.SequenceNo || '0',
                  DayRates: (selectedRoom.DayRates && selectedRoom.DayRates.length > 0
                      ? selectedRoom.DayRates.map(dayRate => ({
                          Amount: dayRate.Amount || 0,
                          Date: dayRate.Date || 'Unknown'
                      }))
                      : [{ Amount: 0, Date: 'Unknown' }]
                  ),
                HotelPassenger: guestDetails.map(guest => ({
                  Title: guest.title || "Mr",
                  FirstName: guest.fname || "",
                  MiddleName: guest.mname || "",
                  LastName: guest.lname || "",
                  Phoneno: guest.mobile || "",
                  Email: guest.email || "",
                  Age: guest.age || "",
                  PaxType: guest.paxType || "",         
                  LeadPassenger: guest.leadPassenger || "",     
                  PassportNo: guest.passportNo || "",
                  PassportIssueDate: "",   
                  PassportExpDate: "",     
                  PAN: guest.pan || "",
                })),
                SupplierPrice: selectedRoom.SupplierPrice || null,
                Price: {
                  CurrencyCode: selectedRoom.Price?.CurrencyCode || 'INR',
                  RoomPrice: selectedRoom.Price?.RoomPrice || 0,
                  Tax: selectedRoom.Price?.Tax || 0,
                  ExtraGuestCharge: selectedRoom.Price?.ExtraGuestCharge || 0,
                  ChildCharge: selectedRoom.Price?.ChildCharge || 0,
                  OtherCharges: selectedRoom.Price?.OtherCharges || 0,
                  Discount:selectedRoom.Price?.Discount || 0,
                  PublishedPrice: selectedRoom.Price?.PublishedPrice || 0,
                  PublishedPriceRoundedOff: selectedRoom.Price?.PublishedPriceRoundedOff || 0,
                  OfferedPrice: selectedRoom.Price?.OfferedPrice || 0,
                  OfferedPriceRoundedOff: selectedRoom.Price?.OfferedPriceRoundedOff || 0,
                  AgentCommission: selectedRoom.Price?.AgentCommission || 0,
                  AgentMarkUp: selectedRoom.Price?.AgentMarkUp || 0,
                  ServiceTax: selectedRoom.Price?.ServiceTax || 0,
                  TDS: selectedRoom.Price?.TDS || 0,
                  ServiceCharge: selectedRoom.Price?.ServiceCharge || 0,
                  TotalGSTAmount: selectedRoom.Price?.TotalGSTAmount || 0,
                  GST: {
                    CGSTAmount: selectedRoom.Price?.GST?.CGSTAmount || 0,
                    CGSTRate: selectedRoom.Price?.GST?.CGSTRate || 0,
                    CessAmount: selectedRoom.Price?.GST?.CessAmount || 0,
                    CessRate: selectedRoom.Price?.GST?.CessRate || 0,
                    IGSTAmount: selectedRoom.Price?.GST?.IGSTAmount || 0,
                    IGSTRate: selectedRoom.Price?.GST?.IGSTRate || 0,
                    SGSTAmount: selectedRoom.Price?.GST?.SGSTAmount || 0,
                    SGSTRate: selectedRoom.Price?.GST?.SGSTRate || 0,
                    TaxableAmount: selectedRoom.Price?.GST?.TaxableAmount || 0
                  }
                },
                RoomPromotion: selectedRoom.RoomPromotion || '',
                Amenities: (selectedRoom.Amenities && selectedRoom.Amenities.length > 0
                  ? selectedRoom.Amenities
                  : ['Unknown']
                ),
                SmokingPreference: selectedRoom.SmokingPreference || 'NoPreference',
                BedTypes: (selectedRoom.BedTypes && selectedRoom.BedTypes.length > 0
                  ? selectedRoom.BedTypes.map(bedType => ({
                      BedTypeCode: bedType.BedTypeCode || '0',
                      BedTypeDescription: bedType.BedTypeDescription || 'Unknown'
                    }))
                  : [{ BedTypeCode: '0', BedTypeDescription: 'Unknown' }]
                ),
                HotelSupplements: (selectedRoom.HotelSupplements && selectedRoom.HotelSupplements.length > 0
                  ? selectedRoom.HotelSupplements
                  : [{ Supplement: 'None' }]
                ),
                LastCancellationDate: selectedRoom.LastCancellationDate || 'Unknown',
                CancellationPolicies: (selectedRoom.CancellationPolicies && selectedRoom.CancellationPolicies.length > 0
                  ? selectedRoom.CancellationPolicies.map(policy => ({
                      Charge: policy.Charge || 0,
                      ChargeType: policy.ChargeType || 0,
                      Currency: policy.Currency || 'INR',
                      FromDate: formatDate(policy.FromDate || new Date()),
                      ToDate: formatDate(policy.ToDate || new Date())
                    }))
                  : [{ Charge: 0, ChargeType: 0, Currency: 'INR', FromDate: formatDate(new Date()), ToDate: formatDate(new Date()) }]
                ),
                CancellationPolicy: selectedRoom.CancellationPolicy || 'No Policy',
                Inclusion: (selectedRoom.Inclusion && selectedRoom.Inclusion.length > 0
                  ? selectedRoom.Inclusion
                  : ['None']
                ),
                BedTypeCode: selectedRoom.BedTypeCode || 'NA',
                Supplements: (selectedRoom.Supplements && selectedRoom.Supplements.length > 0
                  ? selectedRoom.Supplements
                  : ['None']
                )
              }
            ],
            ArrivalTime: "2019-09-28T00:00:00",
            IsPackageFare: true,
            SrdvIndex: srdvIndex,
            SrdvType: srdvType,
            TraceId: "1",
          };
      
      await dispatch(bookHotel(bookingPayload)).unwrap();
      toast.success('Hotel Booking successful!');
      localStorage.setItem('HotelBookingDetails', JSON.stringify(responseBody));

      setTimeout(() => {
        navigate('/hotel-ticket', { state: { bookingDetails: responseBody.hotelBooking } });
      }, 2000);
      
    } catch (error) {
      console.error('Error during hotel booking:', error.message);
      toast.error('An error occurred during hotel booking. Please try again.');
    } finally {
      isProcessing = false;
    }
  }
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
      <Timer />
      <div className="guest_bg">
      <div className="guest-details-container">
        <h2 className="section-title">Guest <span style={{ color: "#00b7eb" }}>Details</span></h2>
        <div className="details-wrapper">
          <div className="left-side">
            <h3>{hotelRoomsDetails.HotelName}</h3>
            <h5>{hotelRoomsDetails.AddressLine1}</h5>
          </div>
          <div className="right-side">
            <p><strong>Check-in Date:</strong> {checkInDate}</p>
            <p><strong>Check-out Date:</strong> {checkOutDate}</p>
          </div>
        </div>
        
        <div className="guest-details-card">
          <div className="hotel-policies">
            <Accordion className="accordian_space">
              <Accordion.Item eventKey="0">
                <Accordion.Header><b>Hotel Policies:</b></Accordion.Header>
                <Accordion.Body>
                  {hotelRoomsDetails.HotelPolicyDetail ? (
                    <div className="hotel-policy">
                      <h4>Policy Details</h4>
                      <div dangerouslySetInnerHTML={{ __html: cleanUpDescription(hotelRoomsDetails.HotelPolicyDetail) }} />
                    </div>
                  ) : (
                    <p>No hotel policy details available.</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion className="accordian_space">
              <Accordion.Item eventKey="1">
                <Accordion.Header><b>Hotel Norms:</b></Accordion.Header>
                <Accordion.Body>
                  {hotelRoomsDetails.HotelNorms ? (
                    <div className="hotel-policy">
                      <h4>Hotel Norms</h4>
                      <div dangerouslySetInnerHTML={{ __html: cleanUpDescription(hotelRoomsDetails.HotelNorms) }} />
                    </div>
                  ) : (
                    <p>No hotel norms available.</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        

        {!showForm && (
          <button className='submit-btn' onClick={() => setShowForm(true)}>Add Details</button>
        )}

        {showForm && !formSubmitted && (
          <div className="form-container">
            <div className="form-content">
              <h2 className="text-center">Enter Your Details</h2>
              <form onSubmit={handleFormSubmit}>
                {guestForms.map((formData, index) => (
                  <div key={index} className="guest-form">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3 req_field">
                          <label className="required_field">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            name="fname"
                            value={formData.fname}
                            onChange={(e) => handleFormChange(index, e)}
                            required
                            minLength={2}
                            maxLength={30}
                          />
                        </div>

                        <div className="mb-3 req_field">
                          <label>Middle Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Middle Name (Optional)"
                            name="mname"
                            value={formData.mname}
                            onChange={(e) => handleFormChange(index, e)}
                          />
                        </div>

                        <div className="mb-3 req_field">
                          <label className="required_field">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            name="lname"
                            value={formData.lname}
                            onChange={(e) => handleFormChange(index, e)}
                            required
                            minLength={2}
                            maxLength={30}
                          />
                        </div>

                        <div className="mb-3 req_field">
                          <label className="required_field">Email</label>
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
                        <div className="mb-3 req_field">
                          <label className="required_field">Contact Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Contact Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={(e) => handleFormChange(index, e)}
                            required
                            pattern="[0-9]{10}"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        

                        <div className="mb-3 req_field">
                          <label className="required_field">PAN No.</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="PAN No."
                            name="pan"
                            value={formData.pan}
                            onChange={(e) => handleFormChange(index, e)}
                          />
                        </div>

                        <div className="mb-3 req_field">
                          <label className="required_field">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Age"
                            name="age"
                            value={formData.age}
                            onChange={(e) => handleFormChange(index, e)}
                            min={0}
                          />
                        </div>

                        <div className="mb-3 passport_field">
                          <label>Passport No.</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Passport No."
                            name="passportNo"
                            value={formData.passportNo}
                            onChange={(e) => handleFormChange(index, e)}
                          />
                        </div>
                        <div className="mb-3 req_field">
              <label className="required_field">Lead Passenger</label>
              <select
              className="form-control"
              name="leadPassenger"
              value={formData.leadPassenger}
              onChange={(e) => handleFormChange(index, e)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="mb-3 req_field">
            <label className="required_field">Pax Type</label>
            <select
              className="form-control"
              name="paxType"
              value={formData.paxType}
              onChange={(e) => handleFormChange(index, e)}
            >
              <option value="">Select</option>
              <option value="1">Adult</option>
              <option value="2">Child</option>
            </select>
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
            <Popup show={showPopup} onClose={handleClosePopup} formData={guestForms} />
            <label className='check_btn'>
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={handleCheckboxChange}
              />
              Confirm details are correct
            </label>
            {isFormComplete && (
              <button className='submit-btn' onClick={handlePayment}>Proceed to Payment</button>
            )}
          </div>
        )}
      </div>
    </div>
      <Footer />
    </>
  );
};
export default GuestDetails;