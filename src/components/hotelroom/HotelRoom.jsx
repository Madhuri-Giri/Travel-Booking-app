import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './HotelRoom.css';

// Define initialFormData here
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
  const [selectedHotel, setSelectedHotel] = useState([]);

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
    const rooms = JSON.parse(localStorage.getItem('selectedHotel')) || [];
    setSelectedHotel(rooms);
  }, []);

  const roomblockHandler = async (event) => {
    event.preventDefault();

    const requestData = {
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

      const data = await response.json();
      console.log('Block Response:', data.BlockRoomResult.HotelRoomsDetails);

      const rooms = data.BlockRoomResult.HotelRoomsDetails;
      const roomsJSON = JSON.stringify(rooms);
      localStorage.setItem('roomsData', roomsJSON); 
      
      navigate('/hotel-guest');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <div className="hotel_room_container">
        <h3>Select Room</h3>
        {loading && <p>Loading hotel rooms...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && hotelRooms.length === 0 && <p>No hotel room data available.</p>}
        {hotelRooms.length > 0 && !error && (
          <div>
            {hotelRooms.map((room, index) => (
              <div key={index} className="hotel_room_box">
                <h3>{room.RoomTypeName}</h3>
                <p>Price: INR {room.Price?.RoomPrice?.toFixed(2)}</p>
                <p>Day Rate: {room.DayRates?.map(dayRate => (
                  <span key={dayRate.Date}>
                    {new Date(dayRate.Date).toLocaleDateString()} - INR {dayRate.Amount}
                  </span>
                ))}</p>
                <p>Smoking Preference: {room.SmokingPreference}</p>
                <h5>Cancellation Policies:</h5>
                <ul>
                  {room.CancellationPolicies?.map((policy, index) => (
                    <li key={index}>
                      {policy.ChargeType === 1 ? 'Fixed Charge' : 'Percentage Charge'}: 
                      {policy.Currency} {policy.Charge} from {new Date(policy.FromDate).toLocaleDateString()} to {new Date(policy.ToDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
                <p><strong>Cancellation Policies:</strong> {room.CancellationPolicy}</p>
    
                <button onClick={roomblockHandler} className="reserve_button">Reserve</button>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default HotelRoom;
