import { useEffect, useState } from 'react';
import "./PassangerInfo.css";
import { useNavigate } from 'react-router-dom';

const PassangerInfo = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    address: '',
    age: '',
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

    const storedPassengers = JSON.parse(localStorage.getItem('passengerData')) || [];
    setPassengers(storedPassengers);
    setPassengerCount(storedPassengers.length);
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

    if (passengerCount < selectedSeats.length) {
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
            Email: 'tani@gmail.com',
            Phoneno: '9999999999',
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

        const newPassenger = {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Gender: formData.gender,
          Address: formData.address,
          Age: formData.age,
        };

        const updatedPassengers = [...passengers, newPassenger];
        setPassengers(updatedPassengers);
        setPassengerCount(passengerCount + 1);
        setFormData(initialFormData);

        if (passengerCount + 1 >= selectedSeats.length) {
          const passengersJSON = JSON.stringify(updatedPassengers);
          localStorage.setItem('passengerData', passengersJSON);
          const transactionNum = data.result.saved_bookings[0].transaction_num;
          localStorage.setItem('transactionNum', transactionNum);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("All selected seats must have corresponding passengers.");
    }
  };

  const deletePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    setPassengerCount(updatedPassengers.length);
    localStorage.setItem('passengerData', JSON.stringify(updatedPassengers));
  };

  return (
    <>
      <div className='PassangerInfo'>
        <div className="p-upr">
          <h6><i className="ri-user-add-line"></i>Traveller Details <br /></h6>
          <p>
            <span>{passengerCount} passenger{passengerCount !== 1 ? 's' : ''} added</span> / {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
          </p>
        </div>

        <div className='pbh'>It is compulsory to add passengers as per the number of seats.</div>

        <div className="pessanger-main">
          <form onSubmit={blockHandler}>
            <div className="travelller">
              <div className="p-top">
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

            <div className="p-btn">
              <button type='submit' disabled={passengerCount >= selectedSeats.length}>
                Add Passenger
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="passenger-details-display">
        <h6>Added Passengers:</h6>
        <div className="passenger-list">
          <div className="passenger-headings">
            <span>Name</span>
            <span>Age</span>
            <span>Gender</span>
            <span>Address</span>
            <span>Action</span>
          </div>
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-item">
              <span>{passenger.FirstName}</span>
              <span>{passenger.Age}</span>
              <span>{passenger.Gender === '1' ? 'Male' : 'Female'}</span>
              <span>{passenger.Address}</span>
           <i onClick={() => deletePassenger(index)} className="ri-delete-bin-6-line"></i>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default PassangerInfo;
