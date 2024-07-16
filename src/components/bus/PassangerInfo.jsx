import { useState, useEffect } from 'react';
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
  const [passengerData, setPassengerData] = useState(() => {
    const storedPassengerData = localStorage.getItem('passengerData');
    return storedPassengerData ? JSON.parse(storedPassengerData) : [];
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    localStorage.setItem('passengerData', JSON.stringify(passengerData));
  }, [passengerData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const blockHandler = async (event) => {
    event.preventDefault();
             
    navigate('/passenger-list')
     
  };
  
  const backHandlerList = () => {
    navigate('/bord-drop')
  }

  return (
    <>
      <div className='PassangerInfo'>
        <h5> 
          <i style={{cursor:"pointer"}} onClick={backHandlerList} className="ri-arrow-left-s-line"></i>
          Passenger Information
        </h5>
        <div className="passanger">
          <h6>Add Passengers</h6>
          <p>SELECTED SEATS: <span>7</span></p>
          <div className="p-detail">
            <h6>Passengers Details</h6>
            <p>{passengerData.length} / 1 Seat Selected</p>
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
}

export default PassangerInfo;

















// ------------------dynamic data----------------------------


// import { useState, useEffect } from 'react';
// import "./PassangerInfo.css";
// import { useNavigate } from 'react-router-dom';

// const PassangerInfo = () => {
//   const initialFormData = {
//     firstName: '',
//     lastName: '',
//     address: '',
//     age: '',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [passengerData, setPassengerData] = useState(() => {
//     const storedPassengerData = localStorage.getItem('passengerData');
//     return storedPassengerData ? JSON.parse(storedPassengerData) : [];
//   });
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     localStorage.setItem('passengerData', JSON.stringify(passengerData));
//   }, [passengerData]);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };


//   const blockHandler = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch('https://srninfotech.com/projects/travel-app/api/seat-block', {
//         method: 'POST',
//         headers:{
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ResultIndex: "1",
//           TraceId: "1",
//           BoardingPointId: 1,
//           DroppingPointId: 1,
//           RefID: "1",
//           Passenger: [
//             {
//               LeadPassenger: true,
//               PassengerId: passengerData.length + 1, 

//               Title: "Mr",
//               FirstName: formData.firstName,
//               LastName: formData.lastName,
//               Email: "amit@srdvtechnologies.com",
//               Phoneno: "9643737502",
//               Gender: "1",
//               Address: formData.address,
//               Age: formData.age,
//               Seat: {
//                 ColumnNo: "001",
//                 RowNo: "000",
//                 SeatIndex: 2,
//                 SeatFare: 400,
//                 Height: 1,
//                 IsLadiesSeat: false,
//                 IsMalesSeat: false,
//                 IsUpper: false,
//                 SeatName: "2A",
//                 SeatStatus: true,
//                 SeatType: 1,
//                 Width: 1,
//                 Price: {
//                   CurrencyCode: "INR",
//                   BasePrice: 400,
//                   Tax: 0,
//                   OtherCharges: 0,
//                   Discount: 0,
//                   PublishedPrice: 400,
//                   PublishedPriceRoundedOff: 400,
//                   OfferedPrice: 380,
//                   OfferedPriceRoundedOff: 380,
//                   AgentCommission: 20,
//                   AgentMarkUp: 0,
//                   TDS: 8,
//                   GST: {
//                     CGSTAmount: 0,
//                     CGSTRate: 0,
//                     CessAmount: 0,
//                     CessRate: 0,
//                     IGSTAmount: 0,
//                     IGSTRate: 18,
//                     SGSTAmount: 0,
//                     SGSTRate: 0,
//                     TaxableAmount: 0
//                   }
//                 }
//               }
//             }
//           ]
//         }),
//       });
  
//       const data = await response.json();
//       console.log('Full API response:', data);
  
//       if (data.result && data.result.data && data.result.data.Result) {
//         const result = data.result.data.Result;
  
//         if (Array.isArray(result.Passenger) && result.Passenger.length > 0) {
//           const newPassenger = result.Passenger[0]; 
  
//           setPassengerData([...passengerData, newPassenger]);
//           navigate('/passenger-list');
//         } else {
//           console.log('No valid Passenger data found in API response:', data.result.data);
//         }
//       } else {
//         console.log('No valid Result data found in API response:', data.result.data);
//       }
  
//       setFormData(initialFormData);
//     } catch (error) {
//       console.error('Error blocking seats:', error);
//     }
//   };
  
//   const backHandlerList = () => {
//     navigate('/bord-drop')
//   }

  
//   return (

//     <>
//        <div className='PassangerInfo'>
//       <h5> <i style={{cursor:"pointer"}} onClick={backHandlerList} className="ri-arrow-left-s-line"></i>Passenger Information</h5>
//       <div className="passanger">
//         <h6>Add Passengers</h6>
//         <p>SELECTED SEATS: <span>7</span></p>
//         <div className="p-detail">
//           <h6>Passengers Details</h6>
//           <p>{passengerData.length} / 1 Seat Selected</p>
//         </div>
//         <div className="pessanger-main">
//           <form onSubmit={blockHandler}>
//             <div className="p-top">
//               <h6>Add Passenger</h6>
//               <div className="pas">
//                 <div className="ipt">
//                   <label>Male</label>
//                   <input type="checkbox" />
//                 </div>
//                 <div className="ipt">
//                   <label>Female</label>
//                   <input type="checkbox" />
//                 </div>
//               </div>
//             </div>
//             <div className="p-btm">
//               <div className="p-form">
//                 <label>First Name</label>
//                 <input
//                   type="text"
//                   name='firstName'
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder='Enter Name'
//                   required
//                 />
//               </div>
//               <div className="p-form">
//                 <label>Last Name</label>
//                 <input
//                   type="text"
//                   name='lastName'
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder='Enter Last Name'
//                   required
//                 />
//               </div>
//               <div className="p-form">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name='address'
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder='Enter Address'
//                   required
//                 />
//               </div>
//               <div className="p-form">
//                 <label>Age</label>
//                 <input
//                   type="text"
//                   name='age'
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   placeholder='Enter Age'
//                   required
//                 />
//               </div>
//               <div className="p-btn">
//                 <button type='submit'>Add Passenger</button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
    
//     </>

   
//   );
// }

// export default PassangerInfo;
