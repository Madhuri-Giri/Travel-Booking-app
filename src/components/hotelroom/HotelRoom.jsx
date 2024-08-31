import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Accordion } from 'react-bootstrap';
import './HotelRoom.css';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";
import he from 'he';

  const HotelRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hotelRooms, setHotelRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  let isProcessing = false;

  const roomblockHandler = async (event) => {
    event.preventDefault();

    if (isProcessing) return;
    isProcessing = true;

    const transactionNum = localStorage.getItem('transactionNum');
    const storedHotelRoomData = localStorage.getItem('hotelRooms');

    const hotelRoomsDetails = {
        SrdvIndex: '65',
        SrdvType: 'SingleTB',
        ResultIndex: '9',
        TraceId: '1',
        HotelCode: '92G|DEL',
        HotelName: 'The Manor',
        NoOfRooms: '1',
        // transactionNum: transactionNum,
        HotelRoomsDetails: [
            {
                ChildCount: storedHotelRoomData.ChildCount || 0,
                RequireAllPaxDetails: storedHotelRoomData.RequireAllPaxDetails || false,
                RoomId: storedHotelRoomData.RoomId || 0,
                RoomStatus: storedHotelRoomData.RoomStatus || 0,
                RoomIndex: storedHotelRoomData.RoomIndex || 0,
                RoomTypeCode: storedHotelRoomData.RoomTypeCode || 'DEFAULT_CODE',
                RoomTypeName: storedHotelRoomData.RoomTypeName || 'Unknown',
                RatePlanCode: storedHotelRoomData.RatePlanCode || '',
                RatePlan: storedHotelRoomData.RatePlan || 0,
                InfoSource: storedHotelRoomData.InfoSource || 'Unknown',
                SequenceNo: storedHotelRoomData.SequenceNo || '0',
                DayRates: (storedHotelRoomData.DayRates && storedHotelRoomData.DayRates.length > 0
                    ? storedHotelRoomData.DayRates.map(dayRate => ({
                        Amount: dayRate.Amount || 0,
                        Date: dayRate.Date || 'Unknown'
                    }))
                    : [{ Amount: 0, Date: 'Unknown' }]
                ),
                SupplierPrice: storedHotelRoomData.SupplierPrice || null,
                Price: {
                    CurrencyCode: storedHotelRoomData.Price?.CurrencyCode || 'INR',
                    RoomPrice: storedHotelRoomData.Price?.RoomPrice || 0,
                    Tax: storedHotelRoomData.Price?.Tax || 0,
                    ExtraGuestCharge: storedHotelRoomData.Price?.ExtraGuestCharge || 0,
                    ChildCharge: storedHotelRoomData.Price?.ChildCharge || 0,
                    OtherCharges: storedHotelRoomData.Price?.OtherCharges || 0,
                    Discount: storedHotelRoomData.Price?.Discount || 0,
                    PublishedPrice: storedHotelRoomData.Price?.PublishedPrice || 0,
                    PublishedPriceRoundedOff: storedHotelRoomData.Price?.PublishedPriceRoundedOff || 0,
                    OfferedPrice: storedHotelRoomData.Price?.OfferedPrice || 0,
                    OfferedPriceRoundedOff: storedHotelRoomData.Price?.OfferedPriceRoundedOff || 0,
                    AgentCommission: storedHotelRoomData.Price?.AgentCommission || 0,
                    AgentMarkUp: storedHotelRoomData.Price?.AgentMarkUp || 0,
                    ServiceTax: storedHotelRoomData.Price?.ServiceTax || 0,
                    TDS: storedHotelRoomData.Price?.TDS || 0,
                    ServiceCharge: storedHotelRoomData.Price?.ServiceCharge || 0,
                    TotalGSTAmount: storedHotelRoomData.Price?.TotalGSTAmount || 0,
                    GST: {
                        CGSTAmount: storedHotelRoomData.Price?.GST?.CGSTAmount || 0,
                        CGSTRate: storedHotelRoomData.Price?.GST?.CGSTRate || 0,
                        CessAmount: storedHotelRoomData.Price?.GST?.CessAmount || 0,
                        CessRate: storedHotelRoomData.Price?.GST?.CessRate || 0,
                        IGSTAmount: storedHotelRoomData.Price?.GST?.IGSTAmount || 0,
                        IGSTRate: storedHotelRoomData.Price?.GST?.IGSTRate || 0,
                        SGSTAmount: storedHotelRoomData.Price?.GST?.SGSTAmount || 0,
                        SGSTRate: storedHotelRoomData.Price?.GST?.SGSTRate || 0,
                        TaxableAmount: storedHotelRoomData.Price?.GST?.TaxableAmount || 0
                    }
                },
                RoomPromotion: storedHotelRoomData.RoomPromotion || '',
                Amenities: (storedHotelRoomData.Amenities && storedHotelRoomData.Amenities.length > 0
                    ? storedHotelRoomData.Amenities
                    : ['Unknown']
                ),
                SmokingPreference: storedHotelRoomData.SmokingPreference || 'NoPreference',
                BedTypes: (storedHotelRoomData.BedTypes && storedHotelRoomData.BedTypes.length > 0
                    ? storedHotelRoomData.BedTypes.map(bedType => ({
                        BedTypeCode: bedType.BedTypeCode || '0',
                        BedTypeDescription: bedType.BedTypeDescription || 'Unknown'
                    }))
                    : [{ BedTypeCode: '0', BedTypeDescription: 'Unknown' }]
                ),
                HotelSupplements: (storedHotelRoomData.HotelSupplements && storedHotelRoomData.HotelSupplements.length > 0
                    ? storedHotelRoomData.HotelSupplements
                    : [{ Supplement: 'None' }]
                ),
                LastCancellationDate: storedHotelRoomData.LastCancellationDate || 'Unknown',
                CancellationPolicies: (storedHotelRoomData.CancellationPolicies && storedHotelRoomData.CancellationPolicies.length > 0
                    ? storedHotelRoomData.CancellationPolicies.map(policy => ({
                        Charge: policy.Charge || 0,
                        ChargeType: policy.ChargeType || 0,
                        Currency: policy.Currency || 'INR',
                        FromDate: policy.FromDate || 'Unknown',
                        ToDate: policy.ToDate || 'Unknown'
                    }))
                    : [{ Charge: 0, ChargeType: 0, Currency: 'INR', FromDate: 'Unknown', ToDate: 'Unknown' }]
                ),
                CancellationPolicy: storedHotelRoomData.CancellationPolicy || 'No Policy',
                Inclusion: (storedHotelRoomData.Inclusion && storedHotelRoomData.Inclusion.length > 0
                    ? storedHotelRoomData.Inclusion
                    : ['None']
                ),
                BedTypeCode: storedHotelRoomData.BedTypeCode || 'NA',
                Supplements: (storedHotelRoomData.Supplements && storedHotelRoomData.Supplements.length > 0
                    ? storedHotelRoomData.Supplements
                    : ['None']
                )
            }
        ],
        ArrivalTime: "2019-09-28T00:00:00",
        IsPackageFare: true,
       
    };

    // Sending the request
    try {
        const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-block', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hotelRoomsDetails),
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
    isProcessing = false;
};
  // --------------End API Integration-----------------

  const cleanCancellationPolicy = (text) => {
    if (!text) return '';
  
    let cleanedText = text
    .replace(/#\^#|#!#|\s+/g, ' ') // Remove special sequences and extra spaces
    .replace(/\|/g, '\n') // Replace pipe characters with new lines
    .replace(/(\d{2}-\w{3}-\d{4}), (\d{2}:\d{2}:\d{2})/, '$1, $2') // Ensure proper date-time formatting
    .replace(/INR (\d+\.\d{2})/, 'INR $1') // Ensure proper amount formatting
    .replace(/(\d+)% of total amount/, '$1% of the total amount') // Clarify percentage text
    .replace(/(\d{2}-\w{3}-\d{4})/, '$1'); // Ensure proper date formatting

  // Clean up any redundant spaces or formatting issues
  cleanedText = cleanedText
    .replace(/\s{2,}/g, ' ') // Remove extra spaces
    .trim(); // Remove leading and trailing spaces

  return cleanedText;
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
                                 <span>{new Date(policy.FromDate).toLocaleDateString()}</span> to{' '}
                             <span>{new Date(policy.ToDate).toLocaleDateString()}</span>:{' '}
                              <span> ₹{policy.Charge}</span>  charges.
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
                                 {cleanCancellationPolicy(room.CancellationPolicy)}
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
                      <span>{new Date(policy.FromDate).toLocaleDateString()}</span> to{' '}
                      <span>{new Date(policy.ToDate).toLocaleDateString()}</span>:{' '}
                      <span> ₹{policy.Charge} </span>  charges.
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
                                    {cleanCancellationPolicy(room.CancellationPolicy)}

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
                                  <div className="selected_rooms_summary">
                                  <span>Total Price: INR {totalPriceDoubleDeluxe.toFixed(2)}</span>
                                  
                                </div>
                                </div>
                               
                                <button onClick={roomblockHandler} className="reserve_button">Continue</button>
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
