import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Accordion } from 'react-bootstrap';
import './HotelRoom.css';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";
import he from 'he';

const initialFormData = {
  firstName: '',
  lastName: '',
  middleName:'',
  mobile: '',
  email: '',
  mobile: "",
    age: "",
    paxType: "",
    leadPassenger: "",
    passportNo: "",
    passportIssueDate: "",
    passportExpDate: "",
    PAN: "",

};

const HotelRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hotelRooms, setHotelRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormData);

  
  // Single and Double delux element 
  const [selectedSingleDeluxeRooms, setSelectedSingleDeluxeRooms] = useState([]);
  const [selectedDoubleDeluxeRooms, setSelectedDoubleDeluxeRooms] = useState([]);

  const [totalPriceSingleDeluxe, setTotalPriceSingleDeluxe] = useState(0);
  const [totalPriceDoubleDeluxe, setTotalPriceDoubleDeluxe] = useState(0);

  const [timer, setTimer] = useState(600000);
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 50);
    }, 50);

    if (timer <= 0) {
      clearInterval(countdown);
      navigate('/hotel-description');
    }

    return () => clearInterval(countdown);
  }, [timer, navigate]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec left`;
  };

  const navigateSearch = () => {
    navigate('/hotel-description');
  };
  


  useEffect(() => {
    if (location.state && Array.isArray(location.state.hotelRooms)) {
      setHotelRooms(location.state.hotelRooms);
      setLoading(false);
    } else {
      setError('No hotel room data available.');
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    const singleDeluxeRooms = JSON.parse(localStorage.getItem('selectedSingleDeluxeRooms')) || [];
    const doubleDeluxeRooms = JSON.parse(localStorage.getItem('selectedDoubleDeluxeRooms')) || [];

    if (Array.isArray(singleDeluxeRooms) && Array.isArray(doubleDeluxeRooms)) {
      setSelectedSingleDeluxeRooms(singleDeluxeRooms);
      setSelectedDoubleDeluxeRooms(doubleDeluxeRooms);

      updateTotalPrice(singleDeluxeRooms, 'single');
      updateTotalPrice(doubleDeluxeRooms, 'double');


    } else {
      console.error('Selected hotel data is not an array:', singleDeluxeRooms, doubleDeluxeRooms);
    }
  }, []);

  const updateTotalPrice = (rooms, type) => {
    const newTotalPrice = rooms.reduce((sum, room) => {
      const roomPrice = room.Price?.RoomPrice || 0;
      const roomCount = room.guestCounts?.room || 1;


      return sum + (roomPrice * roomCount);
    }, 0);

    if (type === 'single') {
      setTotalPriceSingleDeluxe(newTotalPrice);
    }
    else if (type === 'double') {
      setTotalPriceDoubleDeluxe(newTotalPrice);
    }
  };

  const handleRoomToggle = (room, type) => {
    const setSelectedRooms = type === 'single' ? setSelectedSingleDeluxeRooms : setSelectedDoubleDeluxeRooms;

    const selectedRooms = type === 'single' ? selectedSingleDeluxeRooms : selectedDoubleDeluxeRooms;
    setSelectedRooms((prevSelectedRooms) => {
      const isSelected = prevSelectedRooms.some(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode);
      let newSelectedRooms;

      if (isSelected) {
        newSelectedRooms = prevSelectedRooms.filter(selectedRoom => selectedRoom.RoomTypeCode !== room.RoomTypeCode);
      } else {
        const newSelectedRoom = {
          ...room,
          guestCounts: { adults: 1, children: 0, room: 1 }
        };
        newSelectedRooms = [...prevSelectedRooms, newSelectedRoom];
      }

      updateTotalPrice(newSelectedRooms, type);

      const localStorageKey = type === 'single' ? 'selectedSingleDeluxeRooms' : 'selectedDoubleDeluxeRooms';
      localStorage.setItem(localStorageKey, JSON.stringify(newSelectedRooms));

      return newSelectedRooms;
    });
  };

  const handleGuestChange = (index, type, increment, roomType) => {

    const setSelectedRooms = roomType === 'single' ? setSelectedSingleDeluxeRooms : setSelectedDoubleDeluxeRooms;

    const selectedRooms = roomType === 'single' ? selectedSingleDeluxeRooms : selectedDoubleDeluxeRooms;

    setSelectedRooms((prevSelectedRooms) => {
      if (!Array.isArray(prevSelectedRooms)) {
        console.error('selectedRooms is not an array:', prevSelectedRooms);
        return [];
      }

      const updatedRooms = [...prevSelectedRooms];
      const currentRoom = updatedRooms[index];
      if (!currentRoom || !currentRoom.guestCounts) return prevSelectedRooms;

      const newCount = currentRoom.guestCounts[type] + increment;

      if (newCount < 1) return prevSelectedRooms; // Prevent negative or zero counts

      updatedRooms[index] = {
        ...currentRoom,
        guestCounts: {
          ...currentRoom.guestCounts,
          [type]: newCount
        }
      };

      updateTotalPrice(updatedRooms, roomType);

      const localStorageKey = roomType === 'single' ? 'selectedSingleDeluxeRooms' : 'selectedDoubleDeluxeRooms';
      localStorage.setItem(localStorageKey, JSON.stringify(updatedRooms));

      return updatedRooms;
    });
  };

  // ----------Start API Integration---------
  

  const selectedRoomsData = {
    singleDeluxe: selectedSingleDeluxeRooms,
    doubleDeluxe: selectedDoubleDeluxeRooms,
    totalPriceSingleDeluxe,
    totalPriceDoubleDeluxe,
    checkInDate: '2024-08-01',  
    checkOutDate: '2024-08-07'  
  };

  const roomblockHandler = async (event) => {
    event.preventDefault();
    const transactionNum = localStorage.getItem('transactionNum');

    // Function to create Bed Types with default fallback
    const createBedTypes = (bedTypes) => {
        return bedTypes && bedTypes.length > 0
            ? bedTypes.map(bedType => ({
                BedTypeCode: bedType.BedTypeCode,
                BedTypeDescription: bedType.BedTypeDescription 
            }))
            : [{
                BedTypeCode: 'DefaultCode',
                BedTypeDescription: 'DefaultDescription'
            }];
    };

    // Assuming selectedSingleDeluxeRooms and selectedDoubleDeluxeRooms are arrays of room data
    const hotelRoomsDetails = [
        ...selectedSingleDeluxeRooms.map((room) => ({
            ChildCount: room.ChildCount,
            RequireAllPaxDetails: room.RequireAllPaxDetails,
            RoomId: room.RoomId,
            RoomStatus: room.RoomStatus,
            RoomIndex: room.RoomIndex,
            RoomTypeCode: room.RoomTypeCode,
            RoomTypeName: room.RoomTypeName,
            RatePlanCode: room.RatePlanCode,
            RatePlan: room.RatePlan,
            InfoSource: room.InfoSource,
            SequenceNo: room.SequenceNo,
            DayRates: room.DayRates,
            SupplierPrice: room.SupplierPrice,
            Price: {
                CurrencyCode: room.Price?.CurrencyCode,
                RoomPrice: room.Price?.RoomPrice,
                Tax: room.Price?.Tax,
                ExtraGuestCharge: room.Price?.ExtraGuestCharge,
                ChildCharge: room.Price?.ChildCharge,
                OtherCharges: room.Price?.OtherCharges,
                Discount: room.Price?.Discount,
                PublishedPrice: room.Price?.PublishedPrice,
                PublishedPriceRoundedOff: room.Price?.PublishedPriceRoundedOff,
                OfferedPrice: room.Price?.OfferedPrice,
                OfferedPriceRoundedOff: room.Price?.OfferedPriceRoundedOff,
                AgentCommission: room.Price?.AgentCommission,
                AgentMarkUp: room.Price?.AgentMarkUp,
                ServiceTax: room.Price?.ServiceTax,
                TDS: room.Price?.TDS,
                ServiceCharge: room.Price?.ServiceCharge,
                TotalGSTAmount: room.Price?.TotalGSTAmount,
                GST: room.Price?.GST || {
                    CGSTAmount: 0,
                    CGSTRate: 0,
                    CessAmount: 0,
                    CessRate: 0,
                    IGSTAmount: 0,
                    IGSTRate: 0,
                    SGSTAmount: 0,
                    SGSTRate: 0,
                    TaxableAmount: 0
                }
            },
            RoomPromotion: room.RoomPromotion || "Member’s exclusive price",
            Amenities: room.Amenities || ["Breakfast Buffet"],
            SmokingPreference: room.SmokingPreference || "0",
            BedTypes: createBedTypes(room.BedTypes),
            HotelSupplements: room.HotelSupplements || [],
            LastCancellationDate: room.LastCancellationDate,
            CancellationPolicies: room.CancellationPolicies,
            CancellationPolicy: room.CancellationPolicy,
            Inclusion: room.Inclusion || ["Breakfast Buffet"],
            BedTypeCode: "'DefaultCode'",
            Supplements: room.Supplements || null
        })),
        ...selectedDoubleDeluxeRooms.map((room) => ({
            ChildCount: room.ChildCount,
            RequireAllPaxDetails: room.RequireAllPaxDetails,
            RoomId: room.RoomId,
            RoomStatus: room.RoomStatus,
            RoomIndex: room.RoomIndex,
            RoomTypeCode: room.RoomTypeCode,
            RoomTypeName: room.RoomTypeName,
            RatePlanCode: room.RatePlanCode,
            RatePlan: room.RatePlan,
            InfoSource: room.InfoSource,
            SequenceNo: room.SequenceNo,
            DayRates: room.DayRates,
            SupplierPrice: room.SupplierPrice,
            Price: {
                CurrencyCode: room.Price?.CurrencyCode,
                RoomPrice: room.Price?.RoomPrice,
                Tax: room.Price?.Tax,
                ExtraGuestCharge: room.Price?.ExtraGuestCharge,
                ChildCharge: room.Price?.ChildCharge,
                OtherCharges: room.Price?.OtherCharges,
                Discount: room.Price?.Discount,
                PublishedPrice: room.Price?.PublishedPrice,
                PublishedPriceRoundedOff: room.Price?.PublishedPriceRoundedOff,
                OfferedPrice: room.Price?.OfferedPrice,
                OfferedPriceRoundedOff: room.Price?.OfferedPriceRoundedOff,
                AgentCommission: room.Price?.AgentCommission,
                AgentMarkUp: room.Price?.AgentMarkUp,
                ServiceTax: room.Price?.ServiceTax,
                TDS: room.Price?.TDS,
                ServiceCharge: room.Price?.ServiceCharge,
                TotalGSTAmount: room.Price?.TotalGSTAmount,
                GST: room.Price?.GST || {
                    CGSTAmount: 0,
                    CGSTRate: 0,
                    CessAmount: 0,
                    CessRate: 0,
                    IGSTAmount: 0,
                    IGSTRate: 0,
                    SGSTAmount: 0,
                    SGSTRate: 0,
                    TaxableAmount: 0
                }
            },
            RoomPromotion: room.RoomPromotion || "Member’s exclusive price",
            Amenities: room.Amenities || ["Breakfast Buffet"],
            SmokingPreference: room.SmokingPreference || "0",
            BedTypes: createBedTypes(room.BedTypes),
            HotelSupplements: room.HotelSupplements || [],
            LastCancellationDate: room.LastCancellationDate,
            CancellationPolicies: room.CancellationPolicies,
            CancellationPolicy: room.CancellationPolicy,
            Inclusion: room.Inclusion || ["Breakfast Buffet"],
            BedTypeCode: "DefaultCode",
            Supplements: room.Supplements || null
        }))
    ];
console.log('payload',hotelRoomsDetails)
    // Construct request data
    const requestData = {
        ResultIndex: "9",
        HotelCode: "92G|DEL",
        HotelName: "The Manor",
        GuestNationality: "IN",
        NoOfRooms: (selectedSingleDeluxeRooms.length + selectedDoubleDeluxeRooms.length).toString(),
        ClientReferenceNo: 0,
        IsVoucherBooking: true,
        transaction_num: transactionNum,
        HotelRoomsDetails: hotelRoomsDetails,
        ArrivalTime: "2019-09-28T00:00:00",
        IsPackageFare: true,
        SrdvType: "SingleTB",
        SrdvIndex: "SrdvTB",
        TraceId: "1",
        
    };

    // Sending the request
    try {
        const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-block', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        const data = res.data;
        const bookingStatus = res.booking_status;

        if (!bookingStatus) {
            throw new Error('Booking status is undefined in the response.');
        }

        console.log('hotel-block API Response:', data);
        console.log('hotel-block id:', bookingStatus.id);
        console.log('hotel-igst:', bookingStatus.igst);
        console.log('hotel-discount:', bookingStatus.discount);

        const rooms = data.BlockRoomResult;
        const hotelId = bookingStatus.id;
        const hotelIgst = bookingStatus.igst;
        const hotelDiscount = bookingStatus.discount;

        localStorage.setItem('hotelBlock', JSON.stringify(rooms));
        localStorage.setItem('hotelBlockId', JSON.stringify(hotelId));
        localStorage.setItem('hotelIgst', JSON.stringify(hotelIgst));
        localStorage.setItem('hotelDiscount', JSON.stringify(hotelDiscount));
        localStorage.setItem('selectedRoomsData', JSON.stringify(selectedRoomsData)); // Store updated room data
        navigate('/hotel-guest');
    } catch (error) {
        console.error('Error:', error);
    }
};


//   const roomblockHandler = async (event) => {
//     event.preventDefault();

//     const transactionNum = localStorage.getItem('transactionNum');

//     const requestData = {
//       // payload/parameter here
//       ResultIndex: "9",
//       HotelCode: "92G|DEL",
//       HotelName: "The Manor",
//       GuestNationality: "IN",
//       NoOfRooms: "1",
//       ClientReferenceNo: 0,
//       IsVoucherBooking: true,
//       transaction_num: transactionNum,
//       HotelRoomsDetails: [
//         {
//           ChildCount: 0,
//           RequireAllPaxDetails: false,
//           RoomId: 0,
//           RoomStatus: 0,
//           RoomIndex: 4,
//           RoomTypeCode: "211504640|4|1",
//           RoomTypeName: "Deluxe Room",
//           RatePlanCode: "230104963",
//           RatePlan: 13,
//           InfoSource: "FixedCombination",
//           SequenceNo: "EA~~341089~4",
//           DayRates: [
//             {
//               Amount: 12325,
//               Date: "2019-09-28T00:00:00"
//             }
//           ],
//           SupplierPrice: null,
//           Price: {
//             CurrencyCode: "INR",
//             RoomPrice: 12325,
//             Tax: 3113.3,
//             ExtraGuestCharge: 0,
//             ChildCharge: 0,
//             OtherCharges: 26,
//             Discount: 2175,
//             PublishedPrice: 15464.3,
//             PublishedPriceRoundedOff: 15464,
//             OfferedPrice: 15464.3,
//             OfferedPriceRoundedOff: 15464,
//             AgentCommission: 0,
//             AgentMarkUp: 0,
//             ServiceTax: 4.68,
//             TDS: 0,
//             ServiceCharge: 0,
//             TotalGSTAmount: 4.68,
//             GST: {
//               CGSTAmount: 0,
//               CGSTRate: 0,
//               CessAmount: 0,
//               CessRate: 0,
//               IGSTAmount: 4.68,
//               IGSTRate: 18,
//               SGSTAmount: 0,
//               SGSTRate: 0,
//               TaxableAmount: 26
//             }
//           },
//           HotelPassenger: [
//             {
//               Title: "Mr",
//               FirstName: formData.firstName,
//               MiddleName: null,
//               LastName: formData.lastName,
//               Phoneno: formData.mobile,
//               Email: formData.email,
//               PaxType: "1",
//               LeadPassenger: true,
//               PassportNo: null,
//               PassportIssueDate: null,
//               PassportExpDate: null,
//               PAN: "XXXXXXXXXX"
//             },
//             {
//               Title: "Mstr",
//               FirstName: formData.firstName,
//               MiddleName: null,
//               LastName: formData.lastName,
//               Phoneno: formData.mobile,
//               Email: formData.email,
//               PaxType: "2",
//               LeadPassenger: false,
//               Age: "8",
//               PassportNo: null,
//               PassportIssueDate: null,
//               PassportExpDate: null,
//               PAN: "XXXXXXXXXX"
//             }
//           ],
//           RoomPromotion: "Member’s exclusive price",
//           Amenities: [
//             "Breakfast Buffet"
//           ],
//           SmokingPreference: "0",
//           BedTypes: [
//             {
//               BedTypeCode: "13",
//               BedTypeDescription: "1 double bed"
//             }
//           ],
//           HotelSupplements: [],
//           LastCancellationDate: "2019-09-17T00:00:00",
//           CancellationPolicies: [
//             {
//               Charge: 100,
//               ChargeType: 2,
//               Currency: "INR",
//               FromDate: "2019-09-18T00:00:00",
//               ToDate: "2019-09-26T23:59:59"
//             },
//             {
//               Charge: 100,
//               ChargeType: 2,
//               Currency: "INR",
//               FromDate: "2019-09-27T00:00:00",
//               ToDate: "2019-09-29T23:59:59"
//             },
//             {
//               Charge: 100,
//               ChargeType: 2,
//               Currency: "INR",
//               FromDate: "2019-09-28T00:00:00",
//               ToDate: "2019-09-29T00:00:00"
//             }
//           ],
//           CancellationPolicy: "Deluxe Room#^#100.00% of total amount will be charged, If cancelled between 18-Sep-2019 00:00:00 and 26-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 27-Sep-2019 00:00:00 and 29-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 28-Sep-2019 00:00:00 and 29-Sep-2019 00:00:00.|#!#",
//           Inclusion: [
//             "Breakfast Buffet"
//           ],
//           BedTypeCode: "13",
//           Supplements: null
//         }
//       ],
//       ArrivalTime: "2019-09-28T00:00:00",
//       IsPackageFare: true,
//       SrdvType: "SingleTB",
//       SrdvIndex: "SrdvTB",
//       TraceId: "1"
//     };

//     try {
//       const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-block', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const res = await response.json();
//       const data=res.data;

//       const bookingStatus = res.booking_status;

//       if (!bookingStatus) {
//         throw new Error('Booking status is undefined in the response.');
//       }

//       console.log('hotel-block API Response:',data);
//       console.log('hotel-block id:', bookingStatus.id);
//       console.log('hotel-igst:',bookingStatus.igst);
//       console.log('hotel-discount:',bookingStatus.discount);

//       const rooms = data.BlockRoomResult;
//       const roomsJSON = JSON.stringify(rooms);

//       const hotelId = bookingStatus.id;
//       const hotelIdJSON = JSON.stringify(hotelId);

//       const hotelIgst = bookingStatus.igst;
//       const hotelIgstJSON = JSON.stringify(hotelIgst);

//       const hotelDiscount = bookingStatus.discount;
//       const hotelDiscountJSON = JSON.stringify(hotelDiscount);

//       localStorage.setItem('hotelBlock', roomsJSON);
//       localStorage.setItem('hotelBlockId', hotelIdJSON);
//       localStorage.setItem('hotelIgst', hotelIgstJSON);
//       localStorage.setItem('hotelDiscount ', hotelDiscountJSON);
//       localStorage.setItem('selectedRoomsData', JSON.stringify(selectedRoomsData)); // Store updated room data
//       navigate('/hotel-guest')

//  // Reload the page after navigation
// //  window.location.reload();

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

  // --------------End API Integration-----------------

  const cleanUpDescription = (description) => {
    if (!description) return '';
  
    let cleanedDescription = he.decode(description); // Decode HTML entities
    cleanedDescription = cleanedDescription.replace(/<\/?(ul|li|b|i|strong|em|span)\b[^>]*>/gi, ''); // Remove specific tags
    cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<p\s*\/?>|<\/p>/gi, '\n'); // Replace tags with newlines
    cleanedDescription = cleanedDescription.replace(/\\|\|/g, ''); // Remove slashes and pipes
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' '); // Replace multiple spaces
    cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n'); // Replace multiple newlines
    cleanedDescription = cleanedDescription.replace(/\/\/+|\\|\|/g, '');
    cleanedDescription = cleanedDescription.trim(); // Trim leading/trailing whitespace
    cleanedDescription = cleanedDescription.replace(/"/g, ''); // Remove single quotes
    return cleanedDescription;
  };
  
  const singleDeluxeRooms = hotelRooms.filter(room => room.RoomTypeName === 'SINGLE DELUXE');
  const doubleDeluxeRooms = hotelRooms.filter(room => room.RoomTypeName === 'DOUBLE Deluxe');

  return (
    <>
      <CustomNavbar />

      <div className="timer ">
          <div> <p><RiTimerLine /> Redirecting in {formatTime(timer)}...</p> </div>
        </div>
      <section className='room_bg'>
        <Container className="hotelroom_container">
          <div className="room_container">
            {/* <Container> */}
            <div className="container">
              <div className="row">
              <div className="hotel_room_container">
                {loading && <p>Loading hotel rooms...</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && hotelRooms.length === 0 && <p>No hotel room data available.</p>}
                {hotelRooms.length > 0 && !error && (
                  <>

                    {/* -------Start Single Deluxe ----------- */}
                    <div className="col-lg-6 room_heading">
                      {singleDeluxeRooms.map((room, index) => (
                        <Card key={index} className="mb-4">
                          <Card.Body>
                            <h4 className='heading_space'>Single Deluxe <span style={{ color: "#00b7eb" }}>Rooms</span></h4>
                            <div className="Exclusive_room">
                              <div className="room_type_container">
                                <div className="room_type_box">
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQChoqyNKN6YKMcxWCLOmy21prYOB9b9dYApg&s" alt="single_delux1" />

                                </div>
                              </div>
                            </div>
                            <Card.Title><b>{room.RoomTypeName}</b></Card.Title>
                            <Card.Text>
                              <p><b>Price: INR</b> {room.Price?.RoomPrice?.toFixed(2)}</p>
                              <p><b>Day Rate:</b> {room.DayRates?.map(dayRate => (
                                <span key={dayRate.Date}>
                                  {new Date(dayRate.Date).toLocaleDateString()} - INR {dayRate.Amount}
                                </span>
                              ))}</p>

                              <p className='space_r'><b>Smoking Preference:</b>{room.SmokingPreference}</p>

                              <Accordion className="accordian_space">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header><b>Cancellation Policy</b></Accordion.Header>
                                  <Accordion.Body>
                                    {/* {room.CancellationPolicies.map((policy, idx) => (
                                      <p key={idx}>
                                        {policy.FromDate} to {policy.ToDate}: {policy.Charge}% will be charged.
                                      </p>
                                    ))} */}
                                    <div className="cancellation-container">
                         {room.CancellationPolicies.map((policy, idx) => (
                             <div key={idx} className="cancellation-policy">
                                    <p>
                                 <strong>{new Date(policy.FromDate).toLocaleDateString()}</strong> to{' '}
                             <strong>{new Date(policy.ToDate).toLocaleDateString()}</strong>:{' '}
                              <strong>{policy.Charge} ₹ </strong>  charges.
                                    </p>
                                  </div>
                                      ))}
                                  </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>

                              <Accordion className="accordian_space">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header><b>Cancellation Policies:</b></Accordion.Header>
                                  <Accordion.Body>
                                    {room.CancellationPolicy}
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>

                            </Card.Text>
                            {!selectedSingleDeluxeRooms.some(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode) ? (
                              <button onClick={() => handleRoomToggle(room, 'single')} className="reserve_button">Reserve</button>
                            ) : (
                              <div className="guest_selection">
                                <button onClick={() => handleRoomToggle(room, 'single')} className="remove_button">Remove</button>
                                <h5>If you want to increase room quantity:</h5>
                                <div className="guest_count">
                                  <button onClick={() => handleGuestChange(selectedSingleDeluxeRooms.findIndex(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode), 'room', -1, 'single')}>-</button>
                                  <span>Room: {selectedSingleDeluxeRooms.find(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode)?.guestCounts.room || 1}</span>
                                  <button onClick={() => handleGuestChange(selectedSingleDeluxeRooms.findIndex(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode), 'room', 1, 'single')}>+</button>

                                  <div className="selected_rooms_summary">
                                    <span>Total Price: INR {totalPriceSingleDeluxe.toFixed(2)}</span>
                                  </div>

                                </div>
                                <button onClick={roomblockHandler} className="reserve_button">Continue</button>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                    {/*---------End Single Deluxe------------ */}

                    {/* ---------Start Double Delux---------- */}
                    <div className="col-lg-6 room_heading">
                      {doubleDeluxeRooms.map((room, index) => (
                        <Card key={index} className="mb-4">
                          <Card.Body>
                            <h4 className='heading_space'>Double Deluxe <span style={{ color: "#00b7eb" }}>Rooms</span></h4>
                            <div className="Exclusive_room">
                              <div className="room_type_container">
                                <div className="room_type_box">
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTRg_N-yr4A_-MUDghr0VQoP10l9AebA7Kxw&s" alt="double_delux1" />
                                </div>
                              </div>
                            </div>
                            <Card.Title><b>{room.RoomTypeName}</b></Card.Title>
                            <Card.Text>
                              <p><b>Price: INR</b> {room.Price?.RoomPrice?.toFixed(2)}</p>
                              <p><b>Day Rate:</b> {room.DayRates?.map(dayRate => (
                                <span key={dayRate.Date}>
                                  {new Date(dayRate.Date).toLocaleDateString()} - INR {dayRate.Amount}
                                </span>
                              ))}</p>
                              <p className='space_r'><b>Smoking Preference:</b> {room.SmokingPreference}</p>

                              <Accordion className="accordian_space">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header><b>Cancellation Policy</b></Accordion.Header>
                                  <Accordion.Body>
                                    {/* {room.CancellationPolicies.map((policy, idx) => (
                                      <p key={idx}>
                                        {policy.FromDate} to {policy.ToDate}: {policy.Charge}% will be charged.
                                      </p>
                                    ))} */} <div className="cancellation-container">
                           {room.CancellationPolicies.map((policy, idx) => (
                            <div key={idx} className="cancellation-policy">
                            <p>
                      <strong>{new Date(policy.FromDate).toLocaleDateString()}</strong> to{' '}
                      <strong>{new Date(policy.ToDate).toLocaleDateString()}</strong>:{' '}
                      <strong>{policy.Charge} ₹ </strong>  charges.
                      </p>
                         </div>
                            ))}
                            </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                              <Accordion className="accordian_space">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header><b>Cancellation Policies:</b></Accordion.Header>
                                  <Accordion.Body>
                                    {room.CancellationPolicy}

                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Card.Text>
                            {!selectedDoubleDeluxeRooms.some(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode) ? (
                              <button onClick={() => handleRoomToggle(room, 'double')} className="reserve_button">Reserve</button>
                            ) : (
                              <div className="guest_selection">
                                <button onClick={() => handleRoomToggle(room, 'double')} className="remove_button">Remove</button>
                                <h5>If you want to increase room quantity:</h5>
                                <div className="guest_count">

                                  <button onClick={() => handleGuestChange(selectedDoubleDeluxeRooms.findIndex(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode), 'room', -1, 'double')}>-</button>

                                  <span>Room: {selectedDoubleDeluxeRooms.find(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode)?.guestCounts.room || 1}</span>
                                  <button onClick={() => handleGuestChange(selectedDoubleDeluxeRooms.findIndex(selectedRoom => selectedRoom.RoomTypeCode === room.RoomTypeCode), 'room', 1, 'double')}>+</button>
                                </div>
                                <div className="selected_rooms_summary">
                                  <span>Total Price: INR {totalPriceDoubleDeluxe.toFixed(2)}</span>
                                  <button onClick={roomblockHandler} className="reserve_button">Continue</button>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                    {/* ---------End Double Deluxe---------- */}
                  </>
                )}
              </div>
              </div>
            </div>
            {/* </Container> */}
          </div>
        </Container>
      </section>
      <Footer />

    </>
  );
};

export default HotelRoom;
