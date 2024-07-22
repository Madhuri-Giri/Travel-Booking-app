import "./HotelList.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";


const renderStar = (rating) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} size="lg" color="#FFD700" />
    );
  }
  return stars;
};

const HotelList = () => {
  const location = useLocation();
  const { searchResults } = location.state || {};
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  const traceId = localStorage.getItem('traceId');
  const srdvType = localStorage.getItem('srdvType');
  const srdvIndex = localStorage.getItem('srdvIndex');
  const resultIndex = "9";

  useEffect(() => {
    console.log('Hotel list data:', searchResults);
    if (searchResults && searchResults.length > 0) {
      setHotels(searchResults);
    } else {
      setError('No hotel details found.');
    }
  }, [searchResults]);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        console.log('Fetching hotel details with traceId:', traceId, 'resultIndex:', resultIndex, 'srdvType:', srdvType, 'srdvIndex:', srdvIndex);

        const rooms = 1;
        const checkInDate = new Date('2020/04/30');
        const noOfNights = 1;
        const searchQuery = '130443';

        const requestData = {
          NoOfRooms: rooms,
          CheckInDate: format(checkInDate, 'dd/MM/yyyy'),
          MaxRating: 5,
          NoOfNights: noOfNights,
          CityId: searchQuery,
          TraceId: traceId,
          SrdvType: srdvType,
          SrdvIndex: srdvIndex,
          ResultIndex: resultIndex,
          HotelCode: "92G|DEL"
        };

        console.log('Request data:', requestData);

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log('Hotel details response:', data);

        if (response.ok) {
          if (data && data.HotelInfoResult && data.HotelInfoResult.HotelDetails) {
            setHotels([data.HotelInfoResult.HotelDetails]);
            setError(null);
          } else {
            setError(data.message || 'No hotel details found.');
          }
        } else {
          setError('Failed to fetch hotel details. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to fetch hotel details. Please try again later.');
      }
    };

    if (traceId && srdvType && srdvIndex) {
      fetchHotelInfo();
    }
  }, [traceId, srdvType, srdvIndex, resultIndex]);

  const handleViewDescription = (index) => {
    const hotel = hotels[index];

    if (!hotel) {
      setError('Hotel details are incomplete. Cannot navigate to hotel room.');
      return;
    }

    localStorage.setItem('selectedHotel', JSON.stringify(hotel));
    navigate('/hotel-description');
  };

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="listSearch">
          <h1 className="listTitle">Search</h1>
          <div className="listItem">
            <label>Destination</label>
            <input placeholder={location.state?.destination || ""} type="text" />
          </div>
          <div className="listItem">
            <label>Check-in Date</label>
            <DatePicker
              selected={location.state?.date?.[0]?.startDate || new Date()}
              onChange={(date) => {}}
              minDate={new Date()}
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="listItem">
            <label>Check-out Date</label>
            <DatePicker
              selected={location.state?.date?.[0]?.endDate || new Date()}
              onChange={(date) => {}}
              minDate={new Date()}
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="listItem">
            <label>Options</label>
            <div className="listOptions">
              <div className="listOptionItem">
                <span className="listOptionText">
                  Min price <small>per night</small>
                </span>
                <input type="number" className="listOptionInput" />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">
                  Max price <small>per night</small>
                </span>
                <input type="number" className="listOptionInput" />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Adult</span>
                <input
                  type="number"
                  min={1}
                  className="listOptionInput"
                  placeholder={location.state?.options?.adult || 1}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Children</span>
                <input
                  type="number"
                  min={0}
                  className="listOptionInput"
                  placeholder={location.state?.options?.children || 0}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Room</span>
                <input
                  type="number"
                  min={1}
                  className="listOptionInput"
                  placeholder={location.state?.options?.room || 1}
                />
              </div>
            </div>
          </div>
          <button>Search</button>
        </div>
        <div className="listResult">
          {error && <p className="errorMessage">{error}</p>}
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div key={hotel.id} className="searchItem">
                <img
                  src={hotel.HotelPicture}
                  alt={hotel.HotelName}
                  className="hotelImg"
                />
                <div className="hotelDescription">
                  <h1 className="hotelTitle">{hotel.HotelName}</h1>
                  <span className="hotelDistance">{hotel.HotelAddress}</span>
                  <span className="hotelTaxi">{hotel.freeTaxi ? "Free airport taxi" : ""}</span>
                  {/* <span className="Subtitle">{hotel.HotelDescription}</span> */}
                  <span className="Features">{hotel.features}</span>
                  <span className="Cancel">{hotel.freeCancellation ? "Free cancellation" : ""}</span>
                  <span className="CancelSubtitle">
                    You can cancel later, so lock in this great price today!
                  </span>
                </div>
                <div className="Details">
                  <div className="hotelRating">
                    <span>{renderStar(hotel.StarRating)}</span>
                
                  </div>
                  <div className="DetailTexts">
                    <span className="hotelPrice"> INR{hotel.RoomPrice}</span>
                    <span className="hotelTax">Includes taxes and fees</span>
                    <button onClick={() => handleViewDescription(index)} className="CheckButton">See Details</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="noHotelsMessage">No hotels available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelList;
