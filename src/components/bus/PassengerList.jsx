import { useState, useEffect } from 'react';
import './PassengerList.css';
import { useNavigate } from 'react-router-dom';

const PassengerList = () => {
  const navigate = useNavigate();
  const initialPassengerData = JSON.parse(localStorage.getItem('passengerData')) || [];
  const [passengerData, setPassengerData] = useState(initialPassengerData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedAge, setEditedAge] = useState('');
  const [editedGender, setEditedGender] = useState('Male');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedPhoneNo, setEditedPhoneNo] = useState('');
  const [selectedPassengers, setSelectedPassengers] = useState(new Set());

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('passengerData'));
    if (storedData && Array.isArray(storedData) && storedData.length > 0) {
      setPassengerData(storedData);
    } else {
      setPassengerData([]);
    }
  }, []);

  const handleDeletePassenger = (index) => {
    const updatedPassengers = [...passengerData];
    updatedPassengers.splice(index, 1);
    setPassengerData(updatedPassengers);
    localStorage.setItem('passengerData', JSON.stringify(updatedPassengers));
  };

  const openEditPopup = (index) => {
    setEditIndex(index);
    const passenger = passengerData[index];
    setEditedFirstName(passenger.FirstName);
    setEditedLastName(passenger.LastName);
    setEditedAge(passenger.Age);
    setEditedGender(passenger.Gender);
    setEditedAddress(passenger.Address);
    setEditedPhoneNo(passenger.Phoneno);
    setIsEditOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditOpen(false);
  };

  const saveEditedPassenger = () => {
    const updatedPassengers = [...passengerData];
    updatedPassengers[editIndex] = {
      ...updatedPassengers[editIndex],
      FirstName: editedFirstName,
      LastName: editedLastName,
      Age: editedAge,
      Gender: editedGender,
      Address: editedAddress,
      Phoneno: editedPhoneNo,
    };
    setPassengerData(updatedPassengers);
    localStorage.setItem('passengerData', JSON.stringify(updatedPassengers));
    setIsEditOpen(false);
  };

  const handleCheckboxChange = (index) => {
    const updatedSelectedPassengers = new Set(selectedPassengers);
    if (updatedSelectedPassengers.has(index)) {
      updatedSelectedPassengers.delete(index);
    } else {
      updatedSelectedPassengers.add(index);
    }
    setSelectedPassengers(updatedSelectedPassengers);
  };

  const reviewHandler = () => {
    navigate('/review-booking');
  };

  const back = () => {
    navigate('/passenger-info');
  };

  const isContinueButtonDisabled = selectedPassengers.size === 0;

  return (
    <>
      <div className='PassengerList'>
        {isEditOpen && (
          <div className="edit-popup">
            <button className="close-btn" onClick={closeEditPopup}><i className="ri-close-circle-fill"></i></button>
            <input type="text" placeholder="First Name" value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} />
            <input type="text" placeholder="Age" value={editedAge} onChange={(e) => setEditedAge(e.target.value)} />
            <div className="gender-options">
              <label>
                <p>Male</p>
                <input type="radio" name="editedGender" value="Male" checked={editedGender === 'Male'} onChange={() => setEditedGender('Male')} />
              </label>
              <label>
                <p>Female</p>
                <input type="radio" name="editedGender" value="Female" checked={editedGender === 'Female'} onChange={() => setEditedGender('Female')} />
              </label>
            </div>
            <input type="text" placeholder="Address" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} />
            <input type="text" placeholder="Contact No." value={editedPhoneNo} onChange={(e) => setEditedPhoneNo(e.target.value)} />
            <button className='save-btn' onClick={saveEditedPassenger}>Save</button>
          </div>
        )}
        <div className="P-select">
          <h5><i onClick={back} className="ri-arrow-left-s-line" /> Select Passenger</h5>
          <span>{passengerData.length} / ADDED</span>
          <div className="round">
            <h3>Seat No. S30 LB</h3>
            <p>Select passenger</p>
          </div>
        </div>
        <div className="passanger-list">
          {passengerData.map((passenger, index) => (
            <div key={index} className="p-lines">
              <div className="p-one">
                <input 
                  type="checkbox" 
                  checked={selectedPassengers.has(index)} 
                  onChange={() => handleCheckboxChange(index)} 
                />
              </div>
              <div className="p-two">
                <div className="lists-info">
                  <div className='bhar'><span style={{fontWeight:'600'}}>Name</span><small>{passenger.FirstName} {passenger.LastName}</small></div>
                  <div className='bhar'><span style={{fontWeight:'600'}}>Address</span><small>{passenger.Address}</small></div>
                  <div className='bhar'><span style={{fontWeight:'600'}}>Gender</span><small>{passenger.Gender}</small></div>
                  <div className='bhar'><span style={{fontWeight:'600'}}>Age</span><small>{passenger.Age}</small></div>
                  <div className='bhar'><span style={{fontWeight:'600'}}>Contact No.</span><small>{passenger.Phoneno}</small></div>
                </div>
              </div>
              <div className="p-three">
                <i className="ri-edit-line" onClick={() => openEditPopup(index)}></i>
                <i className="ri-delete-bin-line" onClick={() => handleDeletePassenger(index)}></i>
              </div>
            </div>
          ))}
       
          <div className="pas-btn">
            <button 
              onClick={reviewHandler} 
              className='continue' 
              type='submit' 
              disabled={isContinueButtonDisabled}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerList;
