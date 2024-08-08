import { useEffect, useState } from 'react';
import "./PassangerInfo.css";
import { useNavigate } from 'react-router-dom';

const PassangerInfo = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    address: '',
    age: '',
    number: '',
    email: '',
    gender: '1',
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [passengerCount, setPassengerCount] = useState(0);

  useEffect(() => {
    const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    setSelectedSeats(seats);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const blockHandler = async (event) => {
    event.preventDefault();

    if (passengers.length < selectedSeats.length) {
      const requestData = {
        ResultIndex: '1',
        TraceId: '1',
        BoardingPointId: 1,
        DroppingPointId: 1,
        RefID: '1',
        Passenger: [
          {
            LeadPassenger: true,
            Title: 'Mr',
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
            Phoneno: formData.number,
            Gender: formData.gender,
            IdType: null,
            Idnumber: null,
            Address: formData.address,
            Age: formData.age,
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
                PublishedPrice: 300,
                PublishedPriceRoundedOff: 400,
                OfferedPrice: 380,
                OfferedPriceRoundedOff: 380,
                AgentCommission: 20,
                AgentMarkUp: 0,
                TDS: 8,
                GST: {
                  CGSTRate: 0,
                  CGSTAmount: 0,
                  SGSTRate: 0,
                  SGSTAmount: 0,
                  IGSTRate: 18,
                  IGSTAmount: 0,
                  CessRate: 0,
                  CessAmount: 0,
                  TaxableAmount: 0,
                },
              },
            },
          },
        ],
      };

      try {
        const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-block', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Block Response:', data);

        setPassengers((prevPassengers) => [
          ...prevPassengers,
          {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
            Phoneno: formData.number,
            Gender: formData.gender,
            Address: formData.address,
            Age: formData.age,
          },
        ]);

        setPassengerCount(passengerCount + 1);

        setFormData(initialFormData);

       
        if (passengers.length + 1 >= selectedSeats.length) {
          const passengersJSON = JSON.stringify([...passengers, {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
            Phoneno: formData.number,
            Gender: formData.gender,
            Address: formData.address,
            Age: formData.age,
          }]);
          localStorage.setItem('passengerData', passengersJSON);
          const transactionNum = data.result.saved_bookings[0].transaction_num;
          localStorage.setItem('transactionNum', transactionNum);
          navigate('/passenger-list');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("All selected seats must have corresponding passengers.");
    }
  };

  const backHandlerList = () => {
    navigate('/bord-drop');
  };

  return (
    <div className='PassangerInfo'>
      <h5>
        <i style={{ cursor: "pointer" }} onClick={backHandlerList} className="ri-arrow-left-s-line"></i>
        Passenger Information
      </h5>
      <div className="passanger">
        <h6>Add Passengers</h6>
        <p>SELECTED SEATS: <span>{selectedSeats.join(', ')}</span></p>

        <div className="p-detail">
          <h6>Traveller Details</h6>
          <p><span>{passengerCount} passenger{passengerCount !== 1 ? 's' : ''} added</span> / {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected</p>
        </div>
        <p>It is compulsory to add passengers as per the number of seats.</p>
        
        <div className="pessanger-main">
          <form onSubmit={blockHandler}>
            <div className="travelller">
              <div className="p-top">
                <h6>Enter Traveller Details </h6>
                <div className="pas">
                  <div className="ipt">
                    <label>Male</label>
                    <input
                      type="radio"
                      name="gender"
                      value="1"
                      checked={formData.gender === '1'}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ipt">
                    <label>Female</label>
                    <input
                      type="radio"
                      name="gender"
                      value="2"
                      checked={formData.gender === '2'}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <p className="p-mid">
                  <div className="p-form">
                    <label>First Name</label>
                    <input
                      type="text"
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='Enter Name'
                      required
                    />
                  </div>
                  <div className="p-form">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder='Enter Last Name'
                      required
                    />
                  </div>
                  <div className="p-form">
                    <label>Address</label>
                    <input
                      type="text"
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder='Enter Address'
                      required
                    />
                  </div>
                  <div className="p-form">
                    <label>Age</label>
                    <input
                      type="text"
                      name='age'
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder='Enter Age'
                      required
                    />
                  </div>
                </p>
              </div>
            </div>

            <div className="travelller2">
              <h6>Enter Contact Details</h6>
              <p className="p-mid2">
                <div className="p-form">
                  <label>Email</label>
                  <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Enter Email'
                    required
                  />
                </div>
                <div className="p-form">
                  <label>Contact</label>
                  <input
                    type="number"
                    name='number'
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder='Enter Number'
                    required
                  />
                </div>
              </p>
            </div>

            <div className="p-btn">
              <button type='submit'>
                {passengers.length < selectedSeats.length - 1 ? 'Add Passenger' : 'Add New Passenger'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassangerInfo;
