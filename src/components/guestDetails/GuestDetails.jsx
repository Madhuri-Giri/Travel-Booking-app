import React, { useEffect, useState } from 'react';
import './GuestDetails.css';  
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

const GuestDetails = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    mobile: "",
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    const roomsJSON = localStorage.getItem('roomsData');
    if (roomsJSON) {
      setRoomsData(JSON.parse(roomsJSON));
    }
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-payment', {
        amount: 100,
        user_id: '1',
      });

      if (response.data.status === 'success') {
        setPaymentDetails(response.data.payment_details);
        console.log('Payment details fetched:', response.data);
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      alert('Failed to initiate payment. Please try again.');
      return null;
    }
  };

  const handlePayment = async (e) => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
//  ----------------------------book api-----------------------------------

const bookHandler = async () => {
  try {
    const bookingPayload = {
      ResultIndex: "9",
      HotelCode: "92G|DEL",
      HotelName: "The Manor",
      GuestNationality: "IN",
      NoOfRooms: "1",
      ClientReferenceNo: 0,
      IsVoucherBooking: true,
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
                      FirstName: "FirstName",
                      MiddleName: null,
                      LastName: "LastName",
                      Phoneno: "9999999999",
                      Email: "test@email.com",
                      PaxType: "1",
                      LeadPassenger: true,
                      PassportNo: null,
                      PassportIssueDate: null,
                      PassportExpDate: null,
                      PAN: "XXXXXXXXXX"
                  },
                  {
                      Title: "Mstr",
                      FirstName: "FirstName",
                      MiddleName: null,
                      LastName: "LastName",
                      Phoneno: "9999999999",
                      Email: "test@email.com",
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

      setTimeout(() => {
navigate('/booking-details', { state: { bookingDetails: responseBody.hotelBooking } });

      }, 2000);
    }
  } catch (error) {
    console.error('Error during hotel booking:', error.message);
    toast.error('An error occurred during hotel booking. Please try again.');
  }
};



// ---------------------------------------------------------------------------
  return (
    <div className="guest-details-container">
      <h2 className="section-title">Guest Details</h2>
      {roomsData.length > 0 ? (
        roomsData.map((room, index) => (
          <div key={index} className="guest-details-card">
            <h3 className="card-title">Room Type: {room.RoomTypeName}</h3>
            <h2>{room.HotelName}</h2>
            <p className="info-section">Price: {room.Price?.CurrencyCode} {room.Price?.RoomPrice?.toFixed(2)}</p>
            <p className="info-section">
              Day Rate: {room.DayRates?.map(dayRate => (
                <span key={dayRate.Date}>
                  {new Date(dayRate.Date).toLocaleDateString()} - {dayRate.Amount}
                </span>
              ))}
            </p>
            <p className="info-section">Smoking Preference: {room.SmokingPreference}</p>
            <h5 className="info-section">Cancellation Policies:</h5>
            <ul>
              {room.CancellationPolicies?.map((policy, index) => (
                <li key={index}>
                  {policy.ChargeType === 1 ? 'Fixed Charge' : 'Percentage Charge'}: 
                  {policy.Currency} {policy.Charge} from {new Date(policy.FromDate).toLocaleDateString()} to {new Date(policy.ToDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <p className="info-section"><strong>Cancellation Policies:</strong> {room.CancellationPolicy}</p>
            <button type="submit" onClick={bookHandler }>Continue</button>
          </div>
        ))
      ) : (
        <p className="no-room-details">No room details available.</p>
      )}

      <div>
        <h2>Enter Your Details</h2>
        <form onSubmit={handlePayment}>
          <div className="row mb-3">
            <div className="col-12">
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
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Middle Name (Optional)"
                name="mname"
                value={formData.mname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
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
          </div>
          <div className="row mb-3">
            <div className="col-12">
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
          </div>
          <p className="confirmation-message">Confirmation email sent to this email address</p>
          <div className="row mb-3">
            <div className="col-12">
              <input
                type="tel"
                className="form-control"
                placeholder="Mobile"
                name="mobile"
                pattern="[0-9]{10}"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button type="submit" className="submit-btn">Proceed To Pay</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestDetails;
