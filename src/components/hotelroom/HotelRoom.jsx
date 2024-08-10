import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Accordion } from 'react-bootstrap';
import './HotelRoom.css';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";

const initialFormData = {
  firstName: '',
  lastName: '',
  // Add other form fields as needed
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
    checkInDate: '2024-08-01',  // Example static date, replace with actual date
    checkOutDate: '2024-08-07'  // Example static date, replace with actual date
  };


  const roomblockHandler = async (event) => {
    event.preventDefault();

    const requestData = {
      // payload/parameter here
      ResultIndex: "9",
      HotelCode: "92G|DEL",
      HotelName: "The Manor",
      GuestNationality: "IN",
      NoOfRooms: "1",
      ClientReferenceNo: 0,
      IsVoucherBooking: true,
      HotelRoomsDetails: [
        {
          ChildCount: 0,
          RequireAllPaxDetails: false,
          RoomId: 0,
          RoomStatus: 0,
          RoomIndex: 4,
          RoomTypeCode: "211504640|4|1",
          RoomTypeName: "Deluxe Room",
          RatePlanCode: "230104963",
          RatePlan: 13,
          InfoSource: "FixedCombination",
          SequenceNo: "EA~~341089~4",
          DayRates: [
            {
              Amount: 12325,
              Date: "2019-09-28T00:00:00"
            }
          ],
          SupplierPrice: null,
          Price: {
            CurrencyCode: "INR",
            RoomPrice: 12325,
            Tax: 3113.3,
            ExtraGuestCharge: 0,
            ChildCharge: 0,
            OtherCharges: 26,
            Discount: 2175,
            PublishedPrice: 15464.3,
            PublishedPriceRoundedOff: 15464,
            OfferedPrice: 15464.3,
            OfferedPriceRoundedOff: 15464,
            AgentCommission: 0,
            AgentMarkUp: 0,
            ServiceTax: 4.68,
            TDS: 0,
            ServiceCharge: 0,
            TotalGSTAmount: 4.68,
            GST: {
              CGSTAmount: 0,
              CGSTRate: 0,
              CessAmount: 0,
              CessRate: 0,
              IGSTAmount: 4.68,
              IGSTRate: 18,
              SGSTAmount: 0,
              SGSTRate: 0,
              TaxableAmount: 26
            }
          },
          HotelPassenger: [
            {
              Title: "Mr",
              FirstName: formData.firstName,
              MiddleName: null,
              LastName: formData.lastName,
              Phoneno: "9999999999",
              Email: "test@email.com",
              PaxType: "1",
              LeadPassenger: true,
              PassportNo: null,
              PassportIssueDate: null,
              PassportExpDate: null,
              PAN: "XXXXXXXXXX"
            },
            {
              Title: "Mstr",
              FirstName: "FirstName",
              MiddleName: null,
              LastName: "LastName",
              Phoneno: "9999999999",
              Email: "test@email.com",
              PaxType: "2",
              LeadPassenger: false,
              Age: "8",
              PassportNo: null,
              PassportIssueDate: null,
              PassportExpDate: null,
              PAN: "XXXXXXXXXX"
            }
          ],
          RoomPromotion: "Member’s exclusive price",
          Amenities: [
            "Breakfast Buffet"
          ],
          SmokingPreference: "0",
          BedTypes: [
            {
              BedTypeCode: "13",
              BedTypeDescription: "1 double bed"
            }
          ],
          HotelSupplements: [],
          LastCancellationDate: "2019-09-17T00:00:00",
          CancellationPolicies: [
            {
              Charge: 100,
              ChargeType: 2,
              Currency: "INR",
              FromDate: "2019-09-18T00:00:00",
              ToDate: "2019-09-26T23:59:59"
            },
            {
              Charge: 100,
              ChargeType: 2,
              Currency: "INR",
              FromDate: "2019-09-27T00:00:00",
              ToDate: "2019-09-29T23:59:59"
            },
            {
              Charge: 100,
              ChargeType: 2,
              Currency: "INR",
              FromDate: "2019-09-28T00:00:00",
              ToDate: "2019-09-29T00:00:00"
            }
          ],
          CancellationPolicy: "Deluxe Room#^#100.00% of total amount will be charged, If cancelled between 18-Sep-2019 00:00:00 and 26-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 27-Sep-2019 00:00:00 and 29-Sep-2019 23:59:59.|100.00% of total amount will be charged, If cancelled between 28-Sep-2019 00:00:00 and 29-Sep-2019 00:00:00.|#!#",
          Inclusion: [
            "Breakfast Buffet"
          ],
          BedTypeCode: "13",
          Supplements: null
        }
      ],
      ArrivalTime: "2019-09-28T00:00:00",
      IsPackageFare: true,
      SrdvType: "SingleTB",
      SrdvIndex: "SrdvTB",
      TraceId: "1"
    };

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
      console.log('hotel-block API Response:', res.BlockRoomResult);
      const rooms = res.BlockRoomResult;
      const roomsJSON = JSON.stringify(rooms);
      localStorage.setItem('hotelBlock', roomsJSON);
      localStorage.setItem('selectedRoomsData', JSON.stringify(selectedRoomsData)); // Store updated room data
      navigate('/hotel-guest')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --------------End API Integration-----------------

  const singleDeluxeRooms = hotelRooms.filter(room => room.RoomTypeName === 'SINGLE DELUXE');
  const doubleDeluxeRooms = hotelRooms.filter(room => room.RoomTypeName === 'DOUBLE Deluxe');

  return (
    <>
      <CustomNavbar />

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
                                    {room.CancellationPolicies.map((policy, idx) => (
                                      <p key={idx}>
                                        {policy.FromDate} to {policy.ToDate}: {policy.Charge}% will be charged.
                                      </p>
                                    ))}
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
                                    {room.CancellationPolicies.map((policy, idx) => (
                                      <p key={idx}>
                                        {policy.FromDate} to {policy.ToDate}: {policy.Charge}% will be charged.
                                      </p>
                                    ))}
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
