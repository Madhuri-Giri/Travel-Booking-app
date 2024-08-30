import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./FlightReview.css"
import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { FaEquals } from "react-icons/fa6";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { PiTrolleySuitcaseFill } from "react-icons/pi";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Payloader from '../../pages/loading/Payloader';



const FlightReview = () => {
  const navigate = useNavigate();

  const [payLoading, setPayLoading] = useState(false);


  const location = useLocation();
  const { fareDataDetails } = location.state || {}; 


  const IsLCC = localStorage.getItem('IsLCC')
  console.log("IsLCC", IsLCC);


  if (!fareDataDetails) {
    console.error('fareDataDetails is undefined in FlightReview component');
  }

  useEffect(() => {
    if (!fareDataDetails) {
      console.error('fareDataDetails is undefined');
    }
  }, [fareDataDetails]);


  const segment = fareDataDetails.Segments[0][0];
  console.log("segment", segment);

  const origin = segment.Origin;
  const destination = segment.Destination;
  const airline = segment.Airline;
  const depTime = new Date(segment.DepTime);
  const arrTime = new Date(segment.ArrTime);
  const fare = fareDataDetails.Fare;
  const baseFaree = fare.BaseFare;
  const taxx = fare.Tax;
  const totalFare = baseFaree + taxx;

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // func for duration convert hpur minute---------------------

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // func for duration convert hpur minute---------------------
  console.log("fareDataDetails", fareDataDetails);

  //-----------------------------Payment apis--------------------------------------------------------------------------------------
  const [flightpayDetails, setFlightpayDetails] = useState(null);

  const flightPayCreate = async () => {
    try {

      const loginId = localStorage.getItem('loginId')

      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-flight-payment', {
        amount: 100,
        user_id: loginId,
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
      navigate('/enter-number', { state: { from: location } });
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

          localStorage.setItem('flight_payment_id', response.razorpay_payment_id);
          localStorage.setItem('flight_transaction_id', options.transaction_id);
          // alert('Flight Payment successful!');
          setPayLoading(true);


          try {
            await flightpayUpdate();

            const IsLCC = localStorage.getItem('IsLCC') === 'true'; 
          setPayLoading(false);

            if (IsLCC) {

              await bookLccApi();
              await flightPaymentStatus()
            } else {
              await bookHoldApi();
            }
            await sendTicketGDSRequest();

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
    }
     catch (error) {
      console.error('Error during payment setup:', error.message);
      alert('An error occurred during payment setup. Please try again.');
    }
  };



  




  const flightpayUpdate = async () => {
    try {
      const payment_id = localStorage.getItem('flight_payment_id');
      const transaction_id = localStorage.getItem('flight_transaction_id');
      const transaction_num = localStorage.getItem('transactionNum');

      if (!payment_id || !transaction_id) {
        throw new Error('Missing payment details');
      }

      const url = 'https://sajyatra.sajpe.in/admin/api/update-flight-payment';
      const payload = {
        payment_id,
        transaction_id,
        transaction_num,
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
      // console.log('flight Update successful:', data);
    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }

  }


  // -----------------------flight LcC Api----------------------------------------------

  const FtraceId = localStorage.getItem('F-TraceId');
  const FresultIndex = localStorage.getItem('F-ResultIndex');
  const FsrdvType = localStorage.getItem('F-SrdvType');
  const FsrdvIndex = localStorage.getItem('F-SrdvIndex');


  const AdditionalTxnFeeOfrd = localStorage.getItem('AdditionalTxnFeeOfrd');
  const AdditionalTxnFeePub = localStorage.getItem('AdditionalTxnFeePub');
  const AirTransFee = localStorage.getItem('AirTransFee');
  const OtherCharges = localStorage.getItem('OtherCharges');
  const TransactionFee = localStorage.getItem('TransactionFee');
  const Currency = localStorage.getItem('Currency');


  const baseFare = localStorage.getItem('BaseFare');
  const tax = localStorage.getItem('Tax');
  const yqTax = localStorage.getItem('YQTax');
  const passengerDetails = JSON.parse(localStorage.getItem('adultPassengerDetails'));
  const title = passengerDetails[0].gender;
  const firstName = passengerDetails[0].firstName;
  const lastName = passengerDetails[0].lastName;

 


  const bookLccApi = async () => {
    try {
  const transactionFlightNo = localStorage.getItem('transactionNum-Flight')
  const transaction_id = localStorage.getItem('flight_transaction_id');


      const llcPayload = {
        "SrdvType": FsrdvType,
        "transaction_num": transactionFlightNo,
         "transaction_id" : transaction_id,         
        "SrdvIndex": FsrdvIndex,
        "TraceId": FtraceId,
        "ResultIndex": FresultIndex,
        "Title": "Mr",
        "FirstName": firstName,
        "LastName": lastName,
        "PaxType": 1,
        "DateOfBirth": "2001-12-12",
        "Gender": "1",
        "PassportNo": "null",
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
        "TransactionFee": TransactionFee,
        "YQTax": parseFloat(yqTax),
        "AdditionalTxnFeeOfrd": AdditionalTxnFeeOfrd,
        "AdditionalTxnFeePub": AdditionalTxnFeePub,
        "AirTransFee": AirTransFee
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

        localStorage.setItem('flightTikitDetails', JSON.stringify(responseBody));

        setTimeout(() => {
          navigate('/booking-history', { state: { flightbookingDetails: responseBody } });
        }, 2000);
      }
    } catch (error) {
      // console.error('Failed to book seats:', error.message);
      console.error('llc api error:', error.message);
      toast.error('An error occurred during booking. Please try again.');
    }
  };



  const bookHoldApi = async () => {
    const holdPayload = {
      "SrdvIndex": FsrdvIndex,
        "TraceId": FtraceId,
        "ResultIndex": FresultIndex,
        "SrdvType": FsrdvType,
      "Passengers": [
        {
          "Title": "Mr",
          "FirstName": firstName,
          "LastName": lastName,
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
              "Currency": Currency,
              "BaseFare": parseFloat(baseFare),
              "Tax": parseFloat(tax),
              "YQTax": parseFloat(yqTax),
              "OtherCharges": OtherCharges,
              "TransactionFee": TransactionFee,
              "AdditionalTxnFeeOfrd": AdditionalTxnFeeOfrd,
              "AdditionalTxnFeePub": AdditionalTxnFeePub,
              "AirTransFee": AirTransFee
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
   
  
  const flightPaymentStatus = async () => {
    try {

      const transaction_id = localStorage.getItem('flight_transaction_id');


      if (!transaction_id) {
        throw new Error('Transaction ID is missing.');
      }  

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/flight-payment-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id
           }), 
      });
  
      const responseBody = await response.json();
      console.log('Flight Payment Status :', responseBody);
  
      if (!response.ok) {
        console.error('Failed to fetch payment status. Status:', response.status, 'Response:', responseBody);
        throw new Error(`Failed to fetch payment status. Status: ${response.status}`);
      }
  
      navigate('/booking-history'); 
      return responseBody;
  
    } catch (error) {
      console.error('Error during fetching payment status:', error.message);
      toast.error('An error occurred while checking payment status. Please try again.');
      return null; 
    }
  }


  // -------------------------------------------------------------------------------------------

  const sendTicketGDSRequest = async () => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/ticketgds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PNR: '',
          BookingId: '',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send request');
      }
  
      const data = await response.json();
      console.log('GDS Api:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  // -------------------------------------------------------------------------------------------

  if (payLoading) {
    return <Payloader />;
  }


  return (
    <>
      <CustomNavbar />
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
                      <p>₹{baseFaree.toFixed(2)}</p>
                    </div>
                    <div className="flightPayDivhed2">
                      <p>Add Ons</p>
                      <p>₹0</p>
                    </div>
                    <div className="flightPayDivhed2">
                      <p>Sajyatra Discount</p>
                      <p>₹0</p>
                    </div>
                    <div className="flightPayDivhed3">
                      <h5>Grand Total</h5>
                      <p>₹{totalFare.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flightPayDivMain">
                    <p className="flightPayDivMainP1"> Onward {formatDate(depTime)} </p>
                    <p className="flightPayDivMainP2">{origin.CityName} <MdOutlineAirplanemodeActive />  {destination.CityName} </p>
                    <p className="flightPayDivMainP3"> {formatTime(depTime)}  <FaEquals /> {formatTime(arrTime)}</p>
                    <p className="flightPayDivMainP5"> {segment.CabinClassName} Classes . Flex </p>
                    <p className="flightPayDivMainP4"> <MdOutlineFlightTakeoff /> {airline.AirlineName} {airline.AirlineCode}-{airline.FlightNumber}</p>
                    <p className="flightPayDivMainP6"> <IoTimeOutline />  {convertMinutesToHoursAndMinutes(segment.Duration)} .1 Stop At Delhi </p>
                    <p className="flightPayDivMainP7"> <PiTrolleySuitcaseFill /> Cabin Baggage {segment.CabinBaggage} (1 Piece) </p>
                    <p className="flightPayDivMainP8"> <PiTrolleySuitcaseFill /> Check-In Baggage 7Kg As Per Airline Policy </p>
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
      <Footer />
    </>
  )
}

export default FlightReview