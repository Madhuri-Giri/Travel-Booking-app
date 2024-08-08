import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import './ReviewBooking.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewBooking = () => {




  const [paymentDetails, setPaymentDetails] = useState(null);
  // const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  const [totalFare, setTotalFare] = useState(0); 
  const navigate = useNavigate();


  const [passengerData, setPassengerData] = useState([]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('passengerData')); 
    if (storedData && Array.isArray(storedData) && storedData.length > 0) {
      setPassengerData(storedData);
    } else {
      setPassengerData([]);
    }
  }, []);


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
              contact: loginData.contact || '' 
          }));
      }
  }, []);


  const newcontactHandler = (e) => {
       e.preventDefault();

       localStorage.setItem('newContactData', JSON.stringify(newContactData));

    setNewContactData(newContactInitialData);
    setIsContactSubmitted(true);
    toast.success("Contact details submitted successfully!"); 
  }

  //  ------------------------------------------------------------------

  useEffect(() => {
    const savedTotalPrice = localStorage.getItem('totalPrice');
    if (savedTotalPrice) {
      setTotalFare(parseFloat(savedTotalPrice)); 
    }
  }, []);

  const back = () => {
    navigate('/passenger-list');
  };

  const fetchPaymentDetails = async () => {
    try {
      const loginId = localStorage.getItem('loginId')

      const roundedAmount = Math.round(totalPayment * 100) / 100;
      // console.log('Sending data to API:', { amount: totalPayment, user_id: loginId });

      const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-bus-payment', {
        amount: roundedAmount,
        user_id: loginId,
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



  // --------------------------------


  const handlePayment = async () => {
    const loginId = localStorage.getItem('loginId');
    
    if (!loginId) {
      navigate('/enter-number',{ state: { from: location } }); 
      return;
    }
  
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
          
          localStorage.setItem('payment_id', response.razorpay_payment_id
            );
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
          username : 'pallavi',
          email: 'pallavi@gmail.com',
          mobile:  '9999999999',
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
    } catch (error) {
      console.error('Error updating payment details:', error.message);
      throw error;
    }
  };
  
//  ----------------------------book api-----------------------------------

const bookHandler = async () => {
  try {
    const bookingPayload = {
      ResultIndex: "1",
      TraceId: "1",
      BoardingPointId: 1,
      DroppingPointId: 1,
      RefID: "1",
      Passenger: [
        {
          LeadPassenger: true,
          PassengerId: 0,
          Title: "Mr",
          FirstName: "Amit",
          LastName: "Singh",
          Email: "amit@srdvtechnologies.com",
          Phoneno: "9643737502",
          Gender: "1",
          IdType: null,
          IdNumber: null,
          Address: "Modinagar",
          Age: "22",
          Seat: {
            ColumnNo: "001",
            Height: 1,
            IsLadiesSeat: false,
            IsMalesSeat: false,
            IsUpper: false,
            RowNo: "000",
            SeatFare: 400,
            SeatIndex: 2,
            SeatName: "2",
            SeatStatus: true,
            SeatType: 1,
            Width: 1,
            Price: {
              CurrencyCode: "INR",
              BasePrice: 400,
              Tax: 0,
              OtherCharges: 0,
              Discount: 0,
              PublishedPrice: 400,
              PublishedPriceRoundedOff: 400,
              OfferedPrice: 380,
              OfferedPriceRoundedOff: 380,
              AgentCommission: 20,
              AgentMarkUp: 0,
              TDS: 8,
              GST: {
                CGSTAmount: 0,
                CGSTRate: 0,
                CessAmount: 0,
                CessRate: 0,
                IGSTAmount: 0,
                IGSTRate: 18,
                SGSTAmount: 0,
                SGSTRate: 0,
                TaxableAmount: 0
              }
            }
          }
        },
        {
          LeadPassenger: false,
          PassengerId: 0,
          Title: "Mr",
          FirstName: "ramesh",
          LastName: "Tomar",
          Email: "ramesh@srdvtechnologies.com",
          Phoneno: "1234567890",
          Gender: "1",
          IdType: null,
          IdNumber: null,
          Address: "Modinagar",
          Age: "28",
          Seat: {
            ColumnNo: "002",
            Height: 1,
            IsLadiesSeat: false,
            IsMalesSeat: false,
            IsUpper: false,
            RowNo: "000",
            SeatFare: 400,
            SeatIndex: 3,
            SeatName: "3",
            SeatStatus: true,
            SeatType: 1,
            Width: 1,
            Price: {
              CurrencyCode: "INR",
              BasePrice: 400,
              Tax: 0,
              OtherCharges: 0,
              Discount: 0,
              PublishedPrice: 400,
              PublishedPriceRoundedOff: 400,
              OfferedPrice: 380,
              OfferedPriceRoundedOff: 380,
              AgentCommission: 20,
              AgentMarkUp: 0,
              TDS: 8,
              GST: {
                CGSTAmount: 0,
                CGSTRate: 0,
                CessAmount: 0,
                CessRate: 0,
                IGSTAmount: 0,
                IGSTRate: 18,
                SGSTAmount: 0,
                SGSTRate: 0,
                TaxableAmount: 0
              }
            }
          }
        }
      ]
    };

    const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingPayload),
    });

    const responseBody = await response.json();
    console.log('Booking Confirmation Response:', responseBody);

    if (!response.ok) {
      console.error('Failed to book seats. Status:', response.status, 'Response:', responseBody);
      throw new Error(`Failed to book seats. Status: ${response.status}`);
    }

    if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
      console.error('Booking failed:', responseBody.Error.ErrorMessage);
      toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
    } else {
      toast.success('Booking successful!');

      localStorage.setItem('busTikitDetails', JSON.stringify(responseBody));

      setTimeout(() => {
        navigate('/bus-tikit-download', { state: { bookingDetails: responseBody } });
      }, 2000);
    }
  } catch (error) {
    console.error('Error during booking:', error.message);
    toast.error('An error occurred during booking. Please try again.');
  }
};



// -------------------------------------------------------------------------------------------------



const [seatPrices, setSeatPrices] = useState([]);
    const [taxes, setTaxes] = useState(0);
    const [igst, setIgst] = useState(0);
    const [offeredPrice, setOfferedPrice] = useState(0);

useEffect(() => {
    const busLayoutResponse = localStorage.getItem('BuslayoutResponse');
    if (busLayoutResponse) {
        const parsedResponse = JSON.parse(busLayoutResponse);
        const result = parsedResponse.Result;
        if (result && Array.isArray(result)) {
            const prices = result.flat().map(seat => ({
                offeredPrice: seat.Price.OfferedPrice,
                tax: seat.Price.Tax,
                igstRate: seat.Price.GST.IGSTRate,
            }));
            setSeatPrices(prices);
        }
    }
}, []);



const totalPayment = totalFare + taxes + (totalFare * 0.18); 

// -------------------------------------------------------------------------------------------------

   
  return (
    <div className='ReviewBooking'>
      <div className="review-book">
        <h5><i onClick={back} className="ri-arrow-left-s-line"></i> Review Details</h5>
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
                 <h6>Traveller Details</h6>
                 {passengerData.map((pass, index) => (
                           <div key={index} className='details'>
                              <div className="one">
                        <span>Name</span>
                        <small>{pass.FirstName}</small>
                      </div>
                     <div className="one">
                        <span>Age</span>
                        <small>{pass.Age}</small>
                      </div> <div className="one">
                        <span>Gender</span>
                        <small>{pass.Gender}</small>
                      </div>  
                      <div className="one">
                        <span>Address</span>
                        <small>{pass.Address}</small>
                      </div> 
                      <div className="one">
                        <span>Contact No</span>
                        <small>{pass.Phoneno}</small>
                      </div>

                           </div> 
                      ))}
        </div>



       

       

        <div className="price-page">
    <h6>Price Details</h6>
    <div className="price">
      <div className="p-line">
        <span>Base Fare</span>
        <small>{totalFare.toFixed(2)}</small>
      </div>
      <div className="p-line">
        <span>Taxes</span>
        <small>{taxes}</small>
      </div>
      <div className="total-fare">
        <span>Total Price</span>
        <small>{totalFare.toFixed(2)}</small> 
      </div>
      <div className="p-line">
        <span>Convenience Fee</span>
        <small>0</small>
      </div>
      <div className="p-line">
        <span>IGST (18%)</span>
        <small>{(totalFare * 0.18).toFixed(2)}</small>
      </div>
      <div className="coupen">
        <span>Offered Price</span>
        <small>{offeredPrice}</small>
      </div>
      <div className="final-pay">
        <span>Total Payment</span>
        <small>{totalPayment.toFixed(2)}</small>
      </div>
    </div>
      </div>



      <div className="new-contact">
      <h6>Contact Details </h6>
      <p>We'll send you ticket here.Please fill this form before pay.</p>
      <form onSubmit={newcontactHandler}>
        <div className="c-detail">
          <div className="cont">
            <label>Name</label>
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
            <label>Email</label>
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
            <label>Contact</label>
            <input
              type="number"
              name="contact"
              value={newContactData.contact}
              onChange={handleInputChange}
              placeholder="Enter Your Contact"
              required
            />
          </div>
          <div className="p-cont">
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>

     



        <div className="p-contact-detail">             
          <div className="last-pay">
            <div className="fare">
              <h6>Total Ticket Amount</h6>
              <small >{totalPayment.toFixed(2)}</small>
            </div>
            <div className="review-pay">
              <button  style={{
                  backgroundColor: !isContactSubmitted ? '#ccc' : '', 
                }} onClick={handlePayment}   disabled={!isContactSubmitted} >Proceed To Pay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;