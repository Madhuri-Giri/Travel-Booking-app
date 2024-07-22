import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReviewBooking.css';

const ReviewBooking = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [totalFare, setTotalFare] = useState(0); // Default to 0
  const navigate = useNavigate();

  useEffect(() => {
    const savedTotalPrice = localStorage.getItem('totalPrice');
    if (savedTotalPrice) {
      setTotalFare(parseFloat(savedTotalPrice)); // Update totalFare with saved total price
    }
  }, []);

  const back = () => {
    navigate('/passenger-list');
  };

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-bus-payment', {
        amount: totalFare,
        user_id: '1',
        email: email,
        phone: phone,
      });

      if (response.data.status === 'success') {
        setPaymentDetails(response.data.payment_details);
        console.log('response', response.data);
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

  const handlePayment = async () => {
    const paymentData = await fetchPaymentDetails();

    if (!paymentData) return;

    const options = {
      key: paymentData.razorpay_key,
      amount: paymentData.payment_details.amount * 100,
      currency: 'INR',
      transaction_id: paymentData.id,
      name: 'SRN Infotech',
      description: 'Test Transaction',
      image: 'https://your-logo-url.com/logo.png',
      order_id: paymentData.payment_details.razorpay_payment_id,
      handler: function (response) {
        console.log('Payment successful', response);
      },
      prefill: {
        name: 'Customer Name',
        email: email,
        contact: phone,
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
  };


  const updateHandlePayment = () => {

  }




  return (
    <div className='ReviewBooking'>
      <div className="review-book">
        <h5><i onClick={back} className="ri-arrow-left-s-line"></i> Review Booking</h5>
        <div className="test-account">
          <h6>Testing Account</h6>
          <div className="sdfgh">
            <div className="test-left">
              <p>Brand East</p>
              <div className="d-t">
                <span>Jul 01</span>
                <span>10:00 PM</span>
              </div>
            </div>
            <div className="test-right">
              <p>Pune University</p>
              <div className="d-t">
                <span>Jul 03</span>
                <span>10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-detail">
          <h6>Passenger Detail</h6>
          <div className="kuchbhi">
            <p>Name: Tansiha</p>
            <p>Age: 18yr</p>
          </div>
        </div>
        <div className="p-contact-detail">
          <h6>Contact Details</h6>
          <p>We'll send you the ticket here</p>
          <form>
            <div className="p-form">
              <label>Email</label>
              <input
                type="email"
                name='email'
                placeholder='Enter Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="p-form">
              <label>Phone No.</label>
              <input
                type="tel"
                name='mobile'
                placeholder='Enter Phone No.'
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </form>
          <div className="last-pay">
            <div className="fare">
              <h6>Total fare</h6>
              <small>${totalFare}</small>
            </div>
            <div className="review-pay">
              <button onClick={handlePayment}>Proceed To Pay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
