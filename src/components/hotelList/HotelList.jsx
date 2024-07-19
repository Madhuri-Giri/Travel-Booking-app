import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "./HotelList.css";
import { format } from 'date-fns';

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
    console.log('hotel list data:', searchResults);
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

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      
      <Container>
        <div className="hotel_list_container">
          <h2>Hotel List</h2>
          {error && <p>Error: {error}</p>}
          {searchResults.length > 0 ? (
            searchResults.map((hotel, index) => (
              <div key={index} className="hotel_card">
                <img src={hotel.HotelPicture} alt={hotel.HotelName} className="hotel_image" />
                <div className="hotel_info">
                  <h3>{hotel.HotelName}</h3>
                  <div>{renderStar(hotel.StarRating)}</div>
                  <p>{hotel.HotelAddress}</p>
                  <p>
                    {expandedIndex === index ? hotel.HotelDescription : `${hotel.HotelDescription.substring(0, 100)}...`}
                    <button onClick={() => toggleReadMore(index)} className="read_more_btn">
                      {expandedIndex === index ? "Read Less" : "Read More"}
                    </button>
                  </p>
                  <button className="view_desc_btn" onClick={() => handleViewDescription(index)}>View Description</button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading hotel data...</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default HotelList;
