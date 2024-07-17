import { useState } from 'react';
import "./PassangerInfo.css";
import { useNavigate } from 'react-router-dom';

const PassangerInfo = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    address: '',
    age: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const blockHandler = async (event) => {
    event.preventDefault();
  
    // Fetch necessary data from localStorage or other sources
    const traceId = localStorage.getItem('traceId');
    const resultIndex = localStorage.getItem('resultIndex');
    const boardingPointId = 1; // Example, replace with actual boarding point ID
    const droppingPointId = 1; // Example, replace with actual dropping point ID
  
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResultIndex: resultIndex,
          TraceId: traceId,
          BoardingPointId: boardingPointId,
          DroppingPointId: droppingPointId,
          RefID: '1', // Example, replace with actual RefID if required
          Passenger: [
            {
              LeadPassenger: true,
              Title: 'Mr',
              FirstName: formData.firstName,
              LastName: formData.lastName,
              Email: 'amit@srdvtechnologies.com', // Replace with actual email
              Phoneno: '9643737502', // Replace with actual phone number
              Gender: '1', // Assuming gender selection, replace with actual value
              Address: formData.address,
              Age: formData.age,
              Seat: {
                ColumnNo: '001', // Example seat column number
                RowNo: '000', // Example seat row number
                SeatName: '2', // Example seat name
                SeatFare: 400, // Example seat fare
                SeatType: 1, // Example seat type
                Width: 20, // Example seat width
                Height: 30, // Example seat height
                IsUpper: true, // Example boolean for upper seat
                IsLadiesSeat: false, // Example boolean for ladies seat
                IsMalesSeat: true, // Example boolean for males seat
                SeatIndex: 1, // Example seat index
                SeatStatus: 'Available', // Example seat status
                Price: {
                  CurrencyCode: 'INR',
                  BasePrice: 400,
                  PublishedPrice: 300,
                  OfferedPrice: 380,
                  AgentCommission: 20,
                  TDS: 8,
                  GST: {
                    IGSTRate: 18,
                    CGSTAmount: 0,
                    SGSTAmount: 0,
                    CessRate: 0,
                    TaxableAmount: 0,
                  },
                },
              },
            },
            // Add more passengers as needed
          ],
        }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
      // Navigate to passenger list page
      navigate('/passenger-list');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const backHandlerList = () => {
    navigate('/bord-drop');
  };

  return (
    <>
      <div className='PassangerInfo'>
        <h5> 
          <i style={{ cursor: "pointer" }} onClick={backHandlerList} className="ri-arrow-left-s-line"></i>
          Passenger Information
        </h5>
        <div className="passanger">
          <h6>Add Passengers</h6>
          <p>SELECTED SEATS: <span>7</span></p>
          <div className="p-detail">
            <h6>Passengers Details</h6>
            <p>/ 1 Seat Selected</p>
          </div>
          <div className="pessanger-main">
            <form onSubmit={blockHandler}>
              <div className="p-top">
                <h6>Add Passenger Information</h6>
                <div className="pas">
                  <div className="ipt">
                    <label>Male</label>
                    <input type="checkbox" />
                  </div>
                  <div className="ipt">
                    <label>Female</label>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>
              <div className="p-btm">
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
                <div className="p-btn">
                  <button type='submit'>Add Passenger</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassangerInfo;
