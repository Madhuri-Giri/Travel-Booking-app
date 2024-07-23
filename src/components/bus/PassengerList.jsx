import { useState, useEffect } from 'react';
import './PassengerList.css';
import { useNavigate } from 'react-router-dom';

const PassengerList = () => {
  const navigate = useNavigate();

  // Retrieve passenger data from localStorage or use initial data if not present
  const initialPassengerData = JSON.parse(localStorage.getItem('passengerData')) || [
  ];

  const [passengerData, setPassengerData] = useState(initialPassengerData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedAge, setEditedAge] = useState('');
  const [editedGender, setEditedGender] = useState('Male');
  const [isNewPassengerOpen, setIsNewPassengerOpen] = useState(false);
  const [newPassengerData, setNewPassengerData] = useState({
    FirstName: '',
    LastName: '',
    Age: '',
    Gender: 'Male',
  });


  const handleDeletePassenger = (index) => {
    const updatedPassengers = [...passengerData];
    updatedPassengers.splice(index, 1);
    setPassengerData(updatedPassengers);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('passengerData')); // Use 'passengerData' key
    
    if (storedData && Array.isArray(storedData) && storedData.length > 0) {
      setPassengerData(storedData);
    } else {
      setPassengerData([]);
    }
  }, []);
  
  

  const openEditPopup = (index) => {
    setEditIndex(index);
    setEditedFirstName(passengerData[index].FirstName);
    setEditedLastName(passengerData[index].LastName);
    setEditedAge(passengerData[index].Age);
    setEditedGender(passengerData[index].Gender);
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
    };
    setPassengerData(updatedPassengers);
    setIsEditOpen(false);
  };

  const openNewPassengerPopup = () => {
    setIsNewPassengerOpen(true);
  };

  const closeNewPassengerPopup = () => {
    setIsNewPassengerOpen(false);
    setNewPassengerData({
      FirstName: '',
      LastName: '',
      Age: '',
      Gender: 'Male',
    });
  };

  const saveNewPassenger = () => {
    const updatedPassengers = [...passengerData, newPassengerData];
    setPassengerData(updatedPassengers);
    localStorage.setItem('passengerData', JSON.stringify(updatedPassengers));
    setIsNewPassengerOpen(false);
    setNewPassengerData({
      FirstName: '',
      LastName: '',
      Age: '',
      Gender: 'Male',
      Email: '',
      Number: '',

    });
  };

  const handleNewPassengerInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassengerData({
      ...newPassengerData,
      [name]: value,
    });
  };

  const reviewHandler = () => {
    navigate('/review-booking');
  };

  const back = () => {
    navigate('/passenger-info');
  };

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
            <button className='save-btn' onClick={saveEditedPassenger}>Save</button>
          </div>
        )}
        {isNewPassengerOpen && (
          <div className="edit-popup">
            <button className="close-btn" onClick={closeNewPassengerPopup}><i className="ri-close-circle-fill"></i></button>
            <input type="text" name="FirstName" placeholder="First Name" value={newPassengerData.FirstName} onChange={handleNewPassengerInputChange} required />
            <input type="text" name="LastName" placeholder="Last Name" value={newPassengerData.LastName} onChange={handleNewPassengerInputChange} required />
            <input type="text" name="Age" placeholder="Age" value={newPassengerData.Age} onChange={handleNewPassengerInputChange} required />
            <div className="gender-options">
              <label>
                <p>Male</p>
                <input type="radio" name="Gender" value="Male" checked={newPassengerData.Gender === 'Male'} onChange={handleNewPassengerInputChange} required />
              </label>
              <label>
                <p>Female</p>
                <input type="radio" name="Gender" value="Female" checked={newPassengerData.Gender === 'Female'} onChange={handleNewPassengerInputChange} required />
              </label>
            </div>
            <button className='save-btn' onClick={saveNewPassenger}>Save</button>
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
                <input type="checkbox" />
              </div>
              <div className="p-two">
                {/* <p>{passenger.FirstName} <span>{passenger.LastName}</span></p>
                <p>{passenger.Gender} <span>{passenger.Age}yr</span></p> */}
                <div className="lists-info">
                   <div className='bhar'><span style={{fontWeight:'600'}}>Name</span><small>{passenger.FirstName} {passenger.LastName}</small></div>
                   <div className='bhar'><span style={{fontWeight:'600'}}>Gender</span><small>{passenger.Gender}</small></div>
                   <div className='bhar'><span style={{fontWeight:'600'}}>Age</span><small>{passenger.Age}</small></div>
                   <div className='bhar'><span style={{fontWeight:'600'}}>Contact No.</span><small>{passenger.Phoneno                   }</small></div>

                </div>
              </div>
              <div className="p-three">
                <i className="ri-edit-line" onClick={() => openEditPopup(index)}></i>
                <i className="ri-delete-bin-line" onClick={() => handleDeletePassenger(index)}></i>
              </div>
            </div>
          ))}
          <div className="ad-new-passenger">
            <button className='ad-new' onClick={openNewPassengerPopup}><i className="ri-user-add-fill"></i>Add new passenger</button>
          </div>
          <div className="pas-btn">
            <button onClick={reviewHandler} className='continue' type='submit'>Continue</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerList;

