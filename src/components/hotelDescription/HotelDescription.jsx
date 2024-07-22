import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './HotelDescription.css';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

const renderStar = (rating) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} size="lg" color="#FFD700" />
    );
  }
  return stars;
};

const trimText = (text = '', maxLength = 200) => {
  if (typeof text !== 'string') return ''; // Ensure text is a string
  const cleanText = text.replace(/<[^>]+>/g, '').replace(/(?:\r\n|\r|\n)/g, ' ');
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText;
};

const HotelDescription = () => {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hotel = JSON.parse(localStorage.getItem('selectedHotel'));

  const fetchData = async () => {
    const traceId = localStorage.getItem('traceId');
    const srdvType = localStorage.getItem('srdvType');
    const srdvIndex = localStorage.getItem('srdvIndex');
    const resultIndex = "9";

    try {
      const requestData = {
        NoOfRooms: 1,
        CheckInDate: format(new Date('2020-04-30'), 'dd/MM/yyyy'),
        MaxRating: 5,
        NoOfNights: 1,
        CityId: '130443',
        TraceId: traceId,
        SrdvType: srdvType,
        SrdvIndex: srdvIndex,
        ResultIndex: resultIndex,
        HotelCode: "92G|DEL"
      };

      console.log('Request Data:', requestData);

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hotel rooms. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response Data:', data);

      if (data && data.GetHotelRoomResult && data.GetHotelRoomResult.HotelRoomsDetails && data.GetHotelRoomResult.HotelRoomsDetails.length > 0) {
        setHotelRooms(data.GetHotelRoomResult.HotelRoomsDetails);
        localStorage.setItem('hotelRooms', JSON.stringify(data.GetHotelRoomResult.HotelRoomsDetails));
        setError(null);
      } else {
        setError(data.message || 'No hotel rooms found.');
      }
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
      setError('Failed to fetch hotel rooms. Please try again later.');
    }
  };

  useEffect(() => {
    if (hotel) {
      fetchData();
    } else {
      navigate('/hotel-list');
    }
  }, [hotel, navigate]);

  const handleAddRoomClick = () => {
    navigate('/hotel-room');
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className='hotel_description_container'>
        <h2>{hotel.HotelName || 'Hotel Name Unavailable'}</h2>
        <div>{renderStar(hotel.StarRating || 0)}</div>
        <p>{parse(trimText(hotel.HotelDescription || 'No description available'))}</p>
        <button className='add_room_btn' onClick={handleAddRoomClick}>Add Room</button>
        {error && <p className='error_message'>{error}</p>} 
      </div>
    </Container>
  );
};

export default HotelDescription;
