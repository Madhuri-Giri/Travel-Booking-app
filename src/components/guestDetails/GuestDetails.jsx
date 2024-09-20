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
  
  const dispatch = useDispatch();
  const blockHotelRooms = location.state?.blockHotelRooms || [];

  useEffect(() => {
    dispatch(blockHotelRooms());
}, [dispatch]);

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
      const hotel_booking_id = localStorage.getItem('hotelBlockId');

      if (!loginId || !transactionNum || !hotel_booking_id) {
        throw new Error('Login ID or Transaction Number or Hotel booking Id is missing.');
      }

      // Construct the payload with necessary fields
      const payload = {
        amount: 10,
        user_id: loginId,
        transaction_num: transactionNum,
        hotel_booking_id: [hotel_booking_id]
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

      const bookHandler = async () => {

        if (index < 0 || index >= hotels.length) {
          console.error('Invalid hotel index:', index);
          return;
      }

      const resultIndex = resultIndexes[index];
      const srdvIndex = srdvIndexes[index];
      const hotelCode = hotelCodes[index];

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
          const transactionNum = localStorage.getItem('transactionNum');
          const transaction_id = localStorage.getItem('transaction_id');
          const hotel_booking_id = localStorage.getItem('hotelBlockId');
      
          if (!transactionNum || !transaction_id || !hotel_booking_id) {
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
            hotel_booking_id: hotel_booking_id,
      
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
  return (
    <>
      <CustomNavbar />
      <Timer />
     
      <Footer />
    </>
  );
};
export default GuestDetails;