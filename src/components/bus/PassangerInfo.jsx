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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    setSelectedSeats(seats);
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };




  const cleanUpErrors = (errors) => {
    const cleanedErrors = {};

    for (const key in errors) {
      const newKey = key.split('.').slice(1).join('.');

      if (!cleanedErrors[newKey]) {
        cleanedErrors[newKey] = [];
      }
      cleanedErrors[newKey] = [...cleanedErrors[newKey], ...errors[key]];
    }
    for (const key in cleanedErrors) {
      cleanedErrors[key] = cleanedErrors[key].map(msg => msg.replace(/The Passenger.\d+\./, ''));
    }

    return cleanedErrors;
  };






  // ----------------------------------------------------------------------------------------------------


  const blockHandler = async (event) => {
    event.preventDefault();

    const selectedBusSeatData = JSON.parse(localStorage.getItem('selectedBusSeatData')) || [];

    if (passengerCount < selectedSeats.length) {
      const gstData = {
        CGSTAmount: 0,
        CGSTRate: 0,
        CessAmount: 0,
        CessRate: 0,
        IGSTAmount: 0,
        IGSTRate: 18,
        SGSTAmount: 0,
        SGSTRate: 0,
        TaxableAmount: 0
      };

      selectedBusSeatData.forEach((seat) => {
        if (seat.Price) {
          gstData.CGSTAmount += parseFloat(seat.Price.CGSTAmount) || 0;
          gstData.CGSTRate = Math.max(gstData.CGSTRate, parseFloat(seat.Price.CGSTRate) || 0);
          gstData.CessAmount += parseFloat(seat.Price.CessAmount) || 0;
          gstData.CessRate = Math.max(gstData.CessRate, parseFloat(seat.Price.CessRate) || 0);
          gstData.IGSTAmount += parseFloat(seat.Price.IGSTAmount) || 0;
          gstData.IGSTRate = Math.max(gstData.IGSTRate, parseFloat(seat.Price.IGSTRate) || 0);
          gstData.SGSTAmount += parseFloat(seat.Price.SGSTAmount) || 0;
          gstData.SGSTRate = Math.max(gstData.SGSTRate, parseFloat(seat.Price.SGSTRate) || 0);
          gstData.TaxableAmount += parseFloat(seat.Price.TaxableAmount) || 0;
        }
        seat.Price.GST = gstData;
      });

      const passengersData = selectedBusSeatData.map(seat => ({
        LeadPassenger: true,
        Title: null,
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
          ColumnNo: seat.ColumnNo,
          Height: seat.Height,
          IsLadiesSeat: seat.IsLadiesSeat,
          IsMalesSeat: seat.IsMalesSeat,
          IsUpper: seat.IsUpper,
          RowNo: seat.RowNo,
          SeatFare: seat.Price?.BasePrice || 0,
          SeatIndex: seat.SeatIndex || 0,
          SeatName: seat.SeatName || '',
          SeatStatus: seat.SeatStatus || false,
          SeatType: seat.SeatType || 1,
          Width: seat.Width || 0,
          Price: {
            CurrencyCode: seat.Price?.CurrencyCode || "INR",
            BasePrice: seat.Price?.BasePrice || 400,
            Tax: seat.Price?.Tax || 0,
            OtherCharges: seat.Price?.OtherCharges || 0,
            Discount: seat.Price?.Discount || 0,
            PublishedPrice: seat.Price?.PublishedPrice || 400,
            PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff || 400,
            OfferedPrice: seat.Price?.OfferedPrice || 380,
            OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff || 380,
            AgentCommission: seat.Price?.AgentCommission || 20,
            AgentMarkUp: seat.Price?.AgentMarkUp || 0,
            TDS: seat.Price?.TDS || 8,
            GST: seat.Price?.GST || gstData
          },
        },
      }));

      localStorage.setItem('busPassengerData', JSON.stringify(passengersData));
      console.log('busPassengerData', passengersData)

      const requestData = {
        ResultIndex: '1',
        TraceId: '1',
        BoardingPointId: 1,
        DroppingPointId: 1,
        RefID: '1',
        Passenger: passengersData,
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
          const errorData = await response.json();
          console.log('Raw Errors:', errorData.errors);
          const cleanedErrors = cleanUpErrors(errorData.errors || {});
          setErrors(cleanedErrors);
          console.log('Cleaned Errors:', cleanedErrors);

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Block Response:', data);

        const busSavedId = data.result.saved_bookings[0]?.id;
        localStorage.setItem('busSavedId', busSavedId);

        const newPassenger = {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Gender: formData.gender,
          Address: formData.address,
          Age: formData.age,
        };

        const updatedPassengers = [...passengers, newPassenger];
        setPassengers(updatedPassengers);
        setPassengerCount(updatedPassengers.length);
        setFormData(initialFormData);
        setErrors({});

      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("All selected seats must have corresponding passengers.");
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedSeatsCount', selectedSeats.length);
    localStorage.setItem('passengerCount', passengerCount);
    
    // console.log("selectedSeatsCountttttttt", localStorage.getItem('selectedSeatsCount'));
    // console.log("pssssssngr", localStorage.getItem('passengerCount'));

  }, [selectedSeats, passengerCount]);


  // -----------------------------------------------------------------------------------------------------

  const deletePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    setPassengerCount(updatedPassengers.length);
    // Optionally, update localStorage
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
                    <label htmlFor="firstName">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                      className={`form-control ${errors['0.FirstName'] ? 'is-invalid' : ''}`}
                    />
                    {errors['0.FirstName'] && (
                      <div className="invalid-feedback">
                        {errors['0.FirstName'].join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="p-form">
                    <label htmlFor="lastName">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                      className={`form-control ${errors['0.LastName'] ? 'is-invalid' : ''}`}
                    />
                    {errors['0.LastName'] && (
                      <div className="invalid-feedback">
                        {errors['0.LastName'].join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="p-form">
                    <label htmlFor="address">
                      Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className={`form-control ${errors['0.Address'] ? 'is-invalid' : ''}`}
                    />
                    {errors['0.Address'] && (
                      <div className="invalid-feedback">
                        {errors['0.Address'].join(', ')}
                      </div>
                    )}
                  </div>


                  <div className="p-form">
                    <label htmlFor="age">
                      Age <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text" // Use type="text"
                      name="age"
                      value={formData.age}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validate if the value is numeric and within the range 0-120
                        if (/^\d*$/.test(value) && (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120))) {
                          handleInputChange(e);
                        }
                      }}
                      placeholder="Age"
                      className={`form-control ${errors['0.Age'] ? 'is-invalid' : ''}`}
                    />
                    {errors['0.Age'] && (
                      <div className="invalid-feedback">
                        {errors['0.Age'].join(', ')}
                      </div>
                    )}
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
              <span> <i style={{ cursor: "pointer", color: "red" }} onClick={() => deletePassenger(index)} className="ri-delete-bin-6-line"></i></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

};

export default PassangerInfo;

