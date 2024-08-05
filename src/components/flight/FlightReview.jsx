import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./FlightReview.css"

const FlightReview = () => {


  //-----------------------------Payment apis--------------------------------------------------------------------------------------
  const [flightpayDetails, setFlightpayDetails] = useState(null);

  const flightPayCreate = async () => {
    try {

      const loginId = localStorage.getItem('loginId')
      const user_id = localStorage.getItem('user_id')

      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-flight-payment', {
        amount: 100,
        user_id: user_id,
      });

      if (response.data.status === 'success') {
        setFlightpayDetails(response.data.payment_details);
        console.log('flight response', response.data);
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


  const flightpayHandler = async () => {
    const loginId = localStorage.getItem('loginId');
    if (!loginId) {
      navigate('/login'); 
      return;
    }

    try {
      const paymentData = await flightPayCreate();
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

          localStorage.setItem('flight_payment_id', response.razorpay_payment_id
          );
          localStorage.setItem('flight_transaction_id', options.transaction_id);

          alert('flight Payment successful!');

          try {
            await flightpayUpdate();
            await bookLccApi();
            await bookHoldApi()
          } catch (error) {
            console.error('Error during updateHandlePayment or bookHandler:', error.message);
            alert('An error occurred during processing. Please try again.');
          }
        },
        prefill: {
          username: 'tanisha',
          email: 'tanisha@gmail.com',
          mobile: '7777777777',
        },
        notes: {
          address: 'Bhopal',
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
  }


  const flightpayUpdate = async () => {
    try {
      const payment_id = localStorage.getItem('flight_payment_id');
      const transaction_id = localStorage.getItem('flight_transaction_id');

      if (!payment_id || !transaction_id) {
        throw new Error('Missing payment details');
      }

      const url = 'https://sajyatra.sajpe.in/admin/api/update-flight-payment';
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
      console.log('flight Update successful:', data);
    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }

  }


  // -----------------------flight LLC Api-----------------------------------------------------------------------------------

  const traceId = localStorage.getItem('FlightTraceId2');
  const resultIndex = localStorage.getItem('FlightResultIndex2');
  const srdvType = localStorage.getItem('FlightSrdvType');
  const srdvIndex = localStorage.getItem('FlightSrdvIndex2');
  const baseFare = localStorage.getItem('BaseFare');
  const tax = localStorage.getItem('Tax');
  const yqTax = localStorage.getItem('YQTax');


  const bookLccApi = async () => {
    try {
      const llcPayload = {
        "SrdvIndex": srdvIndex,
        "ResultIndex": resultIndex,
        "TraceId": parseInt(traceId),
        "SrdvType": srdvType,
        "Title": "Mr",
        "FirstName": "Manas",
        "LastName": "Pal",
        "PaxType": 1,
        "DateOfBirth": "2001-12-12",
        "Gender": "1",
        "PassportNo": "",
        "PassportExpiry": "",
        "PassportIssueDate": "",
        "AddressLine1": "A152 Ashok Nagar",
        "City": "Delhi",
        "CountryCode": "IN",
        "CountryName": "INDIA",
        "ContactNo": "9999999990",
        "Email": "manivneet@srdvtechnologies.com",
        "IsLeadPax": 1,
        "BaseFare": parseFloat(baseFare),
        "Tax": parseFloat(tax),
        "TransactionFee": "0",
        "YQTax": parseFloat(yqTax),
        "AdditionalTxnFeeOfrd": "",
        "AdditionalTxnFeePub": "",
        "AirTransFee": "0"
      };


      const response = await fetch('https://sajyatra.sajpe.in/admin/api/bookllc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(llcPayload),
      });

      const responseBody = await response.json();
      console.log(' LLC Response:', responseBody);

      if (!response.ok) {
        console.error('Failed to book seats. Status:', response.status, 'Response:', responseBody);
        throw new Error(`Failed to book seats. Status: ${response.status}`);
      }

      if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
        console.error('Booking failed:', responseBody.Error.ErrorMessage);
        toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
      } else {
        toast.success(' flight Booking successful!');

      }
    } catch (error) {
      console.error('Error during booking:', error.message);
      toast.error('An error occurred during booking. Please try again.');
    }
  };

  const bookHoldApi = async () => {
    const holdPayload = {
      "EndUserIp": "1.1.1.1",
      "ClientId": "180112",
      "UserName": "Maneesh3",
      "Password": "Maneesh@36",
      SrdvType: srdvType,
      SrdvIndex: srdvIndex,
      TraceId: parseInt(traceId),
      ResultIndex: resultIndex,
      "Passengers": [
        {
          "Title": "Mr",
          "FirstName": 'firstName',
          "LastName": 'LastName',
          "PaxType": 1,
          "DateOfBirth": "1997-03-12T00:00:00",
          "Gender": "1",
          "PassportNo": "abc123456",
          "PassportExpiry": "2031-03-12T00:00:00",
          "AddressLine1": 'address',
          "City": "Noida",
          "CountryCode": "IN",
          "CountryName": "INDIA",
          "ContactNo": 'Mobile',
          "Email": 'Email',
          "IsLeadPax": 1,
          "Fare": [
            {
              "Currency": "INR",
              "BaseFare": parseFloat(baseFare),
              "Tax": parseFloat(tax),
              "YQTax": parseFloat(yqTax),
              "OtherCharges": 0,
              "TransactionFee": "0",
              "AdditionalTxnFeeOfrd": 0,
              "AdditionalTxnFeePub": 0,
              "AirTransFee": "0"
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/book-hold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(holdPayload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const holdData = await response.json();
      console.log('Hold Response:', holdData);

    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  // -------------------------------------------------------------------------------------------

  return (
    <>


      <div className="container-fluid review-cont">
        <div className="row">
          <div className="col-md-6">
            <div className="reviewBoxx">
              <h5 className="reviewHed">Review Your Trip Details</h5>
              <div className="flight-pay">
                <div className="flightPaydetails">
                  <div className="flightPayDivhed">
                    <div className="flightPayDivhed1">
                      <p>Air Fare</p>
                      <p>₹4,233.8</p>
                    </div>
                    <div className="flightPayDivhed2">
                      <p>Air Fare</p>
                      <p>₹0</p>
                    </div>
                    <div className="flightPayDivhed3">
                      <h5>Grand Total</h5>
                      <p>₹4,233.8</p>
                    </div>
                  </div>
                  <div className="flightPayDivMain">
                    <p> Onward Thu,13 Jun </p>
                    <p> Indore  Guwahati </p>
                    <p> 09:20 Pm  07:15 Am </p>
                    <p> Air India Ai-635 </p>
                    <p> Economy Classes . Flex </p>
                    <p> 27h 10m .1 Stop At Delhi </p>
                    <p> Cabin Baggage 15Kg (1 Piece) </p>
                    <p> Check-In Baggage 7Kg As Per Airline Policy </p>
                  </div>
                </div>
                <div className="flightPaybtn">
                  <button onClick={flightpayHandler}>Proceed To Pay</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default FlightReview