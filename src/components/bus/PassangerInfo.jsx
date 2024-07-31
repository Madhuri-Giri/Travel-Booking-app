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

     useEffect(() => {
      const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [] ;
      setSelectedSeats(seats)
     }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const blockHandler = async (event) => {
    event.preventDefault();


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
          Email: 'amit@srdvtechnologies.com', 
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
        // {
        //   LeadPassenger: false,
        //   PassengerId: 0, 
        //   Title: "Mr",
        //   FirstName: "ramesh",
        //   LastName: "Tomar",
        //   Email: "ramesh@srdvtechnologies.com",
        //   Phoneno: "1234567890",
        //   Gender: "1",
        //   IdType: null,
        //   IdNumber: null,
        //   Address: "Modinagar",
        //   Age: "28",
        //   Seat: {
        //     ColumnNo: "002", 
        //     Height: 1, 
        //     IsLadiesSeat: false,
        //     IsMalesSeat: false,
        //     IsUpper: false,
        //     RowNo: "000", 
        //     SeatFare: 400, 
        //     SeatIndex: 3, 
        //     SeatName: "3", 
        //     SeatStatus: true,
        //     SeatType: 1, 
        //     Width: 1, 
        //     Price: {
        //       CurrencyCode: "INR",
        //       BasePrice: 400,
        //       Tax: 0,
        //       OtherCharges: 0,
        //       Discount: 0,
        //       PublishedPrice: 400,
        //       PublishedPriceRoundedOff: 400,
        //       OfferedPrice: 380,
        //       OfferedPriceRoundedOff: 380,
        //       AgentCommission: 20,
        //       AgentMarkUp: 0,
        //       TDS: 8,
        //       GST: {
        //         CGSTAmount: 0,
        //         CGSTRate: 0,
        //         CessAmount: 0,
        //         CessRate: 0,
        //         IGSTAmount: 0,
        //         IGSTRate: 18,
        //         SGSTAmount: 0,
        //         SGSTRate: 0,
        //         TaxableAmount: 0,
        //       },
        //     },
        //   },
        // },
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
      console.log('Block Response:', data.result.data.Result.Passenger);

      const passengers = data.result.data.Result.Passenger;
      const passengersJSON = JSON.stringify(passengers);
      localStorage.setItem('passengerData', passengersJSON); 

      navigate('/passenger-list');
    } catch (error) {
      console.error('Error:', error);
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
          <p>/ 1 Seat Selected</p>
        </div>
        <div className="pessanger-main">
          <form onSubmit={blockHandler}>
            <div className="p-top">
              <h6>Enter Traveller Details</h6>
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
              {/* <div className="p-form">
                <label>Email</label>
                <input
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Enter Email'
                  required
                />
              </div> */}
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
              <div className="p-btn">
                <button type='submit'>Add Passenger</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassangerInfo;


// -----------------------------------------------------------------------------------------
















// import { useEffect, useState } from 'react';
// import "./PassangerInfo.css";
// import { useNavigate } from 'react-router-dom';
// import addImg from "../../assets/images/busPassngerIng.png"

// const PassangerInfo = () => {
//   const initialFormData = {
//     firstName: '',
//     lastName: '',
//     address: '',
//     age: '',
//     number: '',
//     email: '',
//     gender: '1',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const navigate = useNavigate();
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   useEffect(() => {
//     const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
//     setSelectedSeats(seats)
//   }, [])

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };



//   const blockHandler = async (event) => {
//     event.preventDefault();


//     const requestData = {
//       ResultIndex: '1',
//       TraceId: '1',
//       BoardingPointId: 1,
//       DroppingPointId: 1,
//       RefID: '1',
//       Passenger: [
//         {
//           LeadPassenger: true,
//           Title: 'Mr',
//           FirstName: formData.firstName,
//           LastName: formData.lastName,
//           Email: 'amit@srdvtechnologies.com',
//           Phoneno: formData.number,
//           Gender: formData.gender,
//           IdType: null,
//           Idnumber: null,
//           Address: formData.address,
//           Age: formData.age,
//           Seat: {
//             ColumnNo: "001",
//             Height: 1,
//             IsLadiesSeat: false,
//             IsMalesSeat: false,
//             IsUpper: false,
//             RowNo: "000",
//             SeatFare: 400,
//             SeatIndex: 2,
//             SeatName: "2",
//             SeatStatus: true,
//             SeatType: 1,
//             Width: 1,
//             Price: {
//               CurrencyCode: "INR",
//               BasePrice: 400,
//               Tax: 0,
//               OtherCharges: 0,
//               Discount: 0,
//               PublishedPrice: 300,
//               PublishedPriceRoundedOff: 400,
//               OfferedPrice: 380,
//               OfferedPriceRoundedOff: 380,
//               AgentCommission: 20,
//               AgentMarkUp: 0,
//               TDS: 8,
//               GST: {
//                 CGSTRate: 0,
//                 CGSTAmount: 0,
//                 SGSTRate: 0,
//                 SGSTAmount: 0,
//                 IGSTRate: 18,
//                 IGSTAmount: 0,
//                 CessRate: 0,
//                 CessAmount: 0,
//                 TaxableAmount: 0,
//               },
//             },
//           },
//         },
//         // {
//         //   LeadPassenger: false,
//         //   PassengerId: 0, 
//         //   Title: "Mr",
//         //   FirstName: "ramesh",
//         //   LastName: "Tomar",
//         //   Email: "ramesh@srdvtechnologies.com",
//         //   Phoneno: "1234567890",
//         //   Gender: "1",
//         //   IdType: null,
//         //   IdNumber: null,
//         //   Address: "Modinagar",
//         //   Age: "28",
//         //   Seat: {
//         //     ColumnNo: "002", 
//         //     Height: 1, 
//         //     IsLadiesSeat: false,
//         //     IsMalesSeat: false,
//         //     IsUpper: false,
//         //     RowNo: "000", 
//         //     SeatFare: 400, 
//         //     SeatIndex: 3, 
//         //     SeatName: "3", 
//         //     SeatStatus: true,
//         //     SeatType: 1, 
//         //     Width: 1, 
//         //     Price: {
//         //       CurrencyCode: "INR",
//         //       BasePrice: 400,
//         //       Tax: 0,
//         //       OtherCharges: 0,
//         //       Discount: 0,
//         //       PublishedPrice: 400,
//         //       PublishedPriceRoundedOff: 400,
//         //       OfferedPrice: 380,
//         //       OfferedPriceRoundedOff: 380,
//         //       AgentCommission: 20,
//         //       AgentMarkUp: 0,
//         //       TDS: 8,
//         //       GST: {
//         //         CGSTAmount: 0,
//         //         CGSTRate: 0,
//         //         CessAmount: 0,
//         //         CessRate: 0,
//         //         IGSTAmount: 0,
//         //         IGSTRate: 18,
//         //         SGSTAmount: 0,
//         //         SGSTRate: 0,
//         //         TaxableAmount: 0,
//         //       },
//         //     },
//         //   },
//         // },
//       ],
//     };


//     try {
//       const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-block', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Block Response:', data.result.data.Result.Passenger);

//       const passengers = data.result.data.Result.Passenger;
//       const passengersJSON = JSON.stringify(passengers);
//       localStorage.setItem('passengerData', passengersJSON);

//       navigate('/passenger-list');
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const backHandlerList = () => {
//     navigate('/bord-drop');
//   };

//   return (
//     <div className='PassangerInfo'>

//       <div className="passanger">
//         <div className="sbse-top">
//           <img src={addImg} alt="" />
//         </div>

//         <div className="sbse-btm">
//           <h5>Add Passenger Information</h5>
//           <div className="passenger-form">
//             <form onSubmit={blockHandler}>
//                <div className="one">
//                <div className="add">
//                    <label>FirstName</label>
//                    <input
//                   type="text"
//                   name='firstName'
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder='Enter Name'
//                   required
//                 />
//                </div>
//                <div className="add">
//                    <label>LastName</label>
//                    <input
//                   type="text"
//                   name='lastName'
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder='Enter Last Name'
//                   required
//                 />
//                </div>
//                <div className="add">
//                    <label>Address</label>
//                    <input
//                   type="text"
//                   name='address'
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder='Enter Address'
//                   required
//                 />
//                </div>
//                 <div className="add">
//                  <label>Age</label>
//                 <input
//                   type="text"
//                   name='age'
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   placeholder='Enter Age'
//                   required
//                 />
//               </div>
//                </div>
//                <div className="one">
//                <div className="add">
//                <label>Email</label>
//                 <input
//                   type="email"
//                   name='email'
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder='Enter Email'
//                   required
//                 />
//                </div> <div className="add">
//                <label>Contact</label>
//                <input
//                   type="number"
//                   name='number'
//                   value={formData.number}
//                   onChange={handleInputChange}
//                   placeholder='Enter Number'
//                   required
//                 />
//                </div>
              
//                <div className="add">
//                    <label>FirstName</label>
//                     <input 
//                   type="text"
//                   name='firstName'
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder='Enter Name'
//                   required
//                 />
//                </div>
//                </div>
//                <div className="add-pas">
//                 <button type='submit'>Add Passenger</button>
//                </div>
//             </form>
//           </div>
//         </div>

//       </div>




//     </div>
//   );
// };

// export default PassangerInfo;



