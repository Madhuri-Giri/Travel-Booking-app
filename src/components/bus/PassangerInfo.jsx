import { useEffect, useState } from 'react';
import './PassangerInfo.css';


const PassangerInfo = () => {

  const initialFormData = {
    firstName: '',
    lastName: '',
    address: '',
    age: '',
    gender: '1',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [passengerCount, setPassengerCount] = useState(0);

  const passInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      <form >
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
                  onChange={passInputChange}
                />
              </div>
              <div className="ipt">
                <label>Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="2"
                  checked={formData.gender === '2'}
                  onChange={passInputChange}
                />
              </div>
            </div>
            <p className="p-mid">
              <div className="p-form">
                <label htmlFor="firstName">First Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={passInputChange}
                  placeholder="Enter First Name"
                  className="form-control"
                />
              </div>
              <div className="p-form">
                <label htmlFor="lastName">Last Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={passInputChange}
                  placeholder="Enter Last Name"
                  className="form-control"
                />
              </div>
              <div className="p-form">
                <label htmlFor="address">Address <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={passInputChange}
                  placeholder="Address"
                  className="form-control"
                />
              </div>
              <div className="p-form">
                <label htmlFor="age">Age <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120))) {
                      passInputChange(e);
                    }
                  }}
                  placeholder="Age"
                  className="form-control"
                />
              </div>
            </p>
          </div>
        </div>
        <div className="p-btn">
          <button type='submit'>Add Passenger</button>
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
              <span> <i style={{ cursor: "pointer", color: "red" }}  className="ri-delete-bin-6-line"></i></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

};

export default PassangerInfo;