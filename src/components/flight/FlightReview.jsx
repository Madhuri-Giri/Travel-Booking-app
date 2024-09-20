/* eslint-disable no-unused-vars */
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
import { json, useLocation, useNavigate } from 'react-router-dom';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
// import Payloader from '../../pages/loading/Payloader';
import { RiTimerLine } from "react-icons/ri";
// import TimerFlight from '../timmer/TimerFlight';
import Loading from '../../pages/loading/Loading';
import PayloaderFlight from "../../pages/loading/PayloaderFlight";



const FlightReview = () => {
  const navigate = useNavigate();

  const [payLoading, setPayLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [holdAPIDATA, setholdAPIDATA] = useState();
  const [razorPayPAYMENT_Id, setRazorPayPAYMENT_Id] = useState();
  const [razorPayTRANSACTION_Id, setRazorPayTRANSACTION_Id] = useState();
  console.log('holdAPIDATA', holdAPIDATA);

  const location = useLocation();
  const { fareQuoteAPIData, flightSelectedDATA, confirmedAdults, confirmedChildren, confirmedInfants } = location.state || {};
  console.log('fareQuoteAPIData', fareQuoteAPIData);
  // console.log('alololo', fareQuoteAPIData.Fare || {});
  console.log('confirmedAdults', confirmedAdults);
  console.log('confirmedChildren', confirmedChildren);
  console.log('confirmedInfants', confirmedInfants);

  // selected flight data get------
  // const { flightSelectedDATA , } = location?.state || {};
  console.log('flightSelectedDATA', flightSelectedDATA);

  const dataToPass = location.state?.dataToPass;
  console.log('dataToPass', dataToPass);

  const IsLCC = dataToPass?.IsLCC
  // const IsLCC = localStorage.getItem('F-IsLcc')
  console.log("F-IsLcc", IsLCC);

  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------


  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedFare = flightSelectedDATA?.flight.OfferedFare
    if (savedFare) {
      setTotalPrice(parseFloat(savedFare));
    }
  }, [flightSelectedDATA]);

  // const finalTotalPrice = location.state?.seatMealBaggagePriceTotal;
  const finalTotalPrice = parseFloat(localStorage.getItem('finalTotalPrice')) || 0;

  // Calculate the grand total
  const grandTotal = totalPrice + finalTotalPrice;



  if (!fareQuoteAPIData) {
    console.error('fareQuoteAPIData is undefined in FlightReview component');
  }

  useEffect(() => {
    if (!fareQuoteAPIData) {
      console.error('fareQuoteAPIData is undefined');
    }
  }, [fareQuoteAPIData]);


  const segment = fareQuoteAPIData.Segments[0][0];
  console.log("segment", segment);

  const origin = segment.Origin;
  const destination = segment.Destination;
  const airline = segment.Airline;
  const depTime = new Date(segment.DepTime);
  const arrTime = new Date(segment.ArrTime);
  const fare = fareQuoteAPIData.Fare;
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
  // console.log("fareQuoteAPIData", fareQuoteAPIData);

  const roundedGrandTotal = Math.round(grandTotal);


  //-----------------------------Payment apis--------------------------------------------------------------------------------------
  const [flightpayDetails, setFlightpayDetails] = useState(null);

  const flightPayCreate = async () => {
    try {

      const transaction_num = localStorage.getItem('transactionNum');
      const loginId = localStorage.getItem('loginId')

      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-flight-payment', {
        amount: roundedGrandTotal,
        user_id: loginId,
        transaction_num,
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
          setRazorPayPAYMENT_Id(response.razorpay_payment_id)
          setRazorPayTRANSACTION_Id(options.transaction_id)
          // alert('Flight Payment successful!');
          setLoader(true);
          try {
            // setLoader(true)
            await flightpayUpdate();
            setLoader(true)
            const IsLCC = dataToPass?.IsLCC
            // const IsLCC = localStorage.getItem('F-IsLcc') === 'true';
            setPayLoading(true);

            if (IsLCC === true) {
              await bookLccApi();
            } else if (IsLCC === false) {
              await bookHoldApi();
              await sendTicketGDSRequest();
            } else {
              console.error('IsLCC value is not set correctly in localStorage');
            }

          } catch (error) {
            console.error('Error during updateHandlePayment or bookHandler:', error.message);
            alert('An error occurred during processing. Please try again.');
            setLoader(false);
            // Navigate to flight search page after showing the error message
            setTimeout(() => navigate('/flight-search'), 4000); // Navigate after 3 seconds
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
      // const payment_id = razorPayPAYMENT_Id;
      // const transaction_id = razorPayTRANSACTION_Id;
      const payment_id = localStorage.getItem('flight_payment_id');
      const transaction_id = localStorage.getItem('flight_transaction_id');

      // const transaction_num = localStorage.getItem('transactionNum');
      // console.log('transaction_num',transaction_num)

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
      console.log('Flight Update successful:', data);

    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }

  }

  // -----------------------flight LcC Api---------------------------------------------

  // ------farequotre data for payload of llc and hold--
  const FtraceId = dataToPass.TraceId;
  const FresultIndex = dataToPass.ResultIndex;
  const FsrdvType = dataToPass.SrdvType;
  const FsrdvIndex = dataToPass.SrdvIndex;

  const baseFare = fareQuoteAPIData.Fare.BaseFare;
  const yqTax = fareQuoteAPIData.Fare.YQTax;
  const tax = fareQuoteAPIData.Fare.Tax;
  const AdditionalTxnFeeOfrd = fareQuoteAPIData.Fare.AdditionalTxnFeeOfrd;
  const AdditionalTxnFeePub = fareQuoteAPIData.Fare.AdditionalTxnFeePub;
  const AirTransFee = fareQuoteAPIData.Fare.AirTransFee;
  const OtherCharges = fareQuoteAPIData.Fare.OtherCharges;
  const TransactionFee = fareQuoteAPIData.Fare.TransactionFee;
  const Currency = fareQuoteAPIData.Fare.Currency;
  const CommissionEarned = fareQuoteAPIData.Fare.CommissionEarned;
  const Discount = fareQuoteAPIData.Fare.Discount;
  const TdsOnCommission = fareQuoteAPIData.Fare.TdsOnCommission;
  const PublishedFare = fareQuoteAPIData.Fare.PublishedFare;
  const OfferedFare = fareQuoteAPIData.Fare.OfferedFare;

  console.log('FtraceId', FtraceId);
  console.log('FresultIndex', FresultIndex);
  console.log('FsrdvType', FsrdvType);
  console.log('FsrdvIndex', FsrdvIndex);

  console.log('baseFareA', parseFloat(baseFare));
  console.log('baseFareB', baseFare);
  console.log('yqTax', yqTax);
  console.log('tax', tax);
  console.log('AdditionalTxnFeeOfrd', AdditionalTxnFeeOfrd);
  console.log('AdditionalTxnFeePub', AdditionalTxnFeePub);
  console.log('AirTransFee', AirTransFee);
  console.log('OtherCharges', OtherCharges);
  console.log('TransactionFee', TransactionFee);
  console.log('Currency', Currency);
  console.log('CommissionEarned', CommissionEarned);
  console.log('Discount', Discount);
  console.log('TdsOnCommission', TdsOnCommission);
  console.log('PublishedFare', PublishedFare);
  console.log('OfferedFare', OfferedFare);
  // ------farequotre data for payload of llc and hold--

  const bookLccApi = async () => {
    try {
      const transactionFlightNo = localStorage.getItem('transactionNum');
      // const transaction_id = razorPayTRANSACTION_Id;
      const transaction_id = localStorage.getItem('flight_transaction_id');
      
      console.log("transaction_id", transaction_id);

      // const adultPassengerDetails = localStorage.getItem('adultPassengerDetails');
      // const parsedAdultPassengerDetails = JSON.parse(adultPassengerDetails);
      const parsedAdultPassengerDetails = confirmedAdults;

      const bookingResponses = await Promise.all(parsedAdultPassengerDetails.map(async (passenger) => {
        const llcPayload = {
          SrdvType: FsrdvType,
          transaction_num: transactionFlightNo,
          transaction_id: transaction_id,
          SrdvIndex: FsrdvIndex,
          TraceId: FtraceId,
          ResultIndex: FresultIndex,
          Passengers: [
            {
              Title: passenger.gender === "male" ? "Mr" : "Ms" || null,
              FirstName: passenger.firstName,
              LastName: passenger.lastName,
              PaxType: 1,
              DateOfBirth: passenger.dateOfBirth,
              Gender: passenger.gender === "male" ? "1" : "2",
              PassportNo: passenger.passportNo || "null",
              PassportExpiry: passenger.passportExpiry || null,
              PassportIssueDate: passenger.passportIssueDate || null,
              AddressLine1: passenger.addressLine1,
              City: passenger.city,
              CountryCode: passenger.countryCode || null,
              CountryName: passenger.countryName,
              ContactNo: passenger.contactNo,
              Email: passenger.email,
              IsLeadPax: passenger.isLeadPax || 0,
              Seat: [],
              MealDynamic: [],
              Baggage: [],
              Fare: [
                {
                  BaseFare: parseFloat(baseFare),
                  Tax: parseFloat(tax),
                  YQTax: parseFloat(yqTax),
                  TransactionFee: TransactionFee,
                  AdditionalTxnFeeOfrd: AdditionalTxnFeeOfrd,
                  AdditionalTxnFeePub: AdditionalTxnFeePub,
                  AirTransFee: AirTransFee,
                  Currency: Currency,
                  OtherCharges: OfferedFare,
                }
              ]
            }
          ]
        };

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/bookllc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(llcPayload),
        });

        if (!response.ok) {
          throw new Error(`Failed to book LLC. Status: ${response.status}`);
        }

        const responseBody = await response.json();
        return responseBody;
      }));

      console.log('LLC Responses:', bookingResponses);

      localStorage.setItem('flightTikitDetails', JSON.stringify(bookingResponses));
      navigate('/flightNewTicket', { state: { 
        flightSelectedDATA: flightSelectedDATA ,  
      } });

    } catch (error) {
      console.error('LLC API error:', error.message);
      toast.error(`LLC API error: ${error.message}`);
      setLoader(false);
      // Navigate to flight search page after showing the error message
      setTimeout(() => navigate('/flight-search'), 4000); // Navigate after 3 seconds
    }
  };


  const bookHoldApi = async () => {
    const transaction_id = localStorage.getItem('flight_transaction_id');
    // const transaction_id = razorPayTRANSACTION_Id;

    const storedPassengers = confirmedAdults;
    console.log("transaction_id", transaction_id)

    const passengers = storedPassengers.map(passenger => ({
      Title: passenger.gender === "male" ? "Mr" : "Ms" || null,
      FirstName: passenger.firstName,
      LastName: passenger.lastName,
      PaxType: 1,
      DateOfBirth: passenger.dateOfBirth,
      Gender: passenger.gender === "male" ? "1" : "2",
      PassportNo: passenger.passportNo || "null",
      PassportExpiry: passenger.passportExpiry || null,
      PassportIssueDate: passenger.passportIssueDate || null,
      AddressLine1: passenger.addressLine1,
      City: passenger.city,
      CountryCode: passenger.countryCode || null,
      CountryName: passenger.countryName,
      ContactNo: passenger.contactNo,
      Email: passenger.email,
      IsLeadPax: passenger.isLeadPax || 0,
      Seat: [],
      MealDynamic: [],
      Baggage: [],
      Fare: [
        {
          BaseFare: parseFloat(baseFare),
          Tax: parseFloat(tax),
          YQTax: parseFloat(yqTax),
          TransactionFee: TransactionFee,
          AdditionalTxnFeeOfrd: AdditionalTxnFeeOfrd,
          AdditionalTxnFeePub: AdditionalTxnFeePub,
          AirTransFee: AirTransFee,
          Currency: Currency,
          OtherCharges: OfferedFare,
        }
      ],
      GSTCompanyAddress: "",
      GSTCompanyContactNumber: "",
      GSTCompanyName: "",
      GSTNumber: "",
      GSTCompanyEmail: ""
    }));


    const holdPayload = {
      "SrdvIndex": FsrdvIndex,
      "TraceId": FtraceId,
      "ResultIndex": FresultIndex,
      "SrdvType": FsrdvType,
      "Passengers": passengers,
      "transaction_id": transaction_id,
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
        const errorData = await response.json();
        console.error('Response status:', response.status);
        console.error('Error details:', errorData);

        navigate('/flight-search');

        setLoader(false);
        return;
      }

      const holdData = await response.json();
      console.log('Hold Response:', holdData);
      setholdAPIDATA(holdData)
      // localStorage.setItem('HolApiData', JSON.stringify(holdData));

    } catch (error) {
      console.error('API call failed:', error.message || error);
      // Navigate to flight search page after showing the error message
      setTimeout(() => navigate('/flight-search'), 4000); // Navigate after 3 seconds
      setLoader(false);
    }
  };

  // -------------------------------------------------------------------------------------------

  const sendTicketGDSRequest = async () => {

    const savedData = holdAPIDATA;
    // const savedData = JSON.parse(localStorage.getItem('HolApiData'));

    const pnr = savedData.data.pnr;
    const bookingId = savedData.data.booking_id;
    const gdsId = savedData.data.id;

    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/ticketgds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "SrdvIndex": FsrdvIndex,
          "TraceId": FtraceId,
          "SrdvType": FsrdvType,
          "PNR": pnr,
          "BookingId": bookingId,
          "flight_hold_id": gdsId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      const data = await response.json();
      console.log('GDS Api:', data);

      // navigate('/flightNewTicket');
      navigate('/flightNewTicket', { state: { 
        // flightbookingDetails: bookingResponses ,
        flightSelectedDATA: flightSelectedDATA ,  
      } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (payLoading) {
    return <PayloaderFlight />;
  }

  if (loader) {
    return <Loading />;
  }

  return (
    <>
      <CustomNavbar />
      {/* <TimerFlight/> */}

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
                      <p>₹{totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flightPayDivhed2">
                      <p>Add Ons(Seat, Meal,baggage)</p>
                      <p>₹{finalTotalPrice}</p>
                    </div>
                    <div className="flightPayDivhed2">
                      <p>Sajyatra Discount</p>
                      <p>₹0</p>
                    </div>
                    <div className="flightPayDivhed3">
                      <h5>Grand Total</h5>
                      <p>₹{grandTotal.toFixed(2)}</p>
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