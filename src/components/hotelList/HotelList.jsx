import "./HotelList.css";
import {Container} from 'react-bootstrap'
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import useGeolocation from "./UseGeolocation";
import haversineDistance from "./HaversineDistance";

const renderStar = (rating) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    const color = i <= rating ? "#FFD700" : "#d3d3d3"; 
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} size="lg" color={color} />
    );
  }
  return stars;
};

const HotelList = () => {
  const location = useLocation();
  const { searchResults } = location.state || {};
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('name');
  const { position: userPosition, error: geoError } = useGeolocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const sortedHotels = [...hotels];
    switch (sortOption) {
      case 'name':
        sortedHotels.sort((a, b) => a.HotelName.localeCompare(b.HotelName));
        break;
      case 'rating':
        sortedHotels.sort((a, b) => b.StarRating - a.StarRating);
        break;
      case 'price-asc':
        sortedHotels.sort((a, b) => (a.Price?.OfferedPriceRoundedOff || 0) - (b.Price?.OfferedPriceRoundedOff || 0));
        break;
      case 'price-desc':
        sortedHotels.sort((a, b) => (b.Price?.OfferedPriceRoundedOff || 0) - (a.Price?.OfferedPriceRoundedOff || 0));
        break;
      case 'distance':
        if (userPosition) {
          sortedHotels.sort((a, b) => {
            const distanceA = haversineDistance(userPosition, {
              latitude: parseFloat(a.Latitude),
              longitude: parseFloat(a.Longitude),
            });
            const distanceB = haversineDistance(userPosition, {
              latitude: parseFloat(b.Latitude),
              longitude: parseFloat(b.Longitude),
            });
            return distanceA - distanceB;
          });
        }
        break;
      default:
        break;
    }
    setHotels(sortedHotels);
  }, [sortOption, userPosition]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setHotels(searchResults);
    } else {
      setError("No hotel details found.");
    }
  }, [searchResults]);

  const fetchHotelInfo = async (index) => {
    const hotel = hotels[index];
    try {
      const requestData = {
        ResultIndex: "9",
        SrdvIndex: "SrdvTB",
        SrdvType: "SingleTB",
        HotelCode: "92G|DEL",
        TraceId: "1",
      };
  
      const response = await fetch("/api/admin/api/hotel-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
  
      if (data && data.HotelInfoResult && data.HotelInfoResult.HotelDetails) {
        navigate("/hotel-description", { state: { hotelDetails: data.HotelInfoResult.HotelDetails } });
      } else {
        setError(data.message || "No hotel details found.");
      }
    } catch (error) {
      setError("Failed to fetch hotel details. Please try again later.");
    }
  };
  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
    <Container>
    <section className="sec_book_filter">
        <div className="hotel_booking_filter">
          <form>
            <div className="form-row_filter">
              <div className="form-field_filter">
                <label className="form_lable_filter" htmlFor="cityOrHotel">Destination: </label>
                <input className="form_in_filter" type="text" id="cityOrHotel" name="cityOrHotel"
                  placeholder="Enter city or hotel name" defaultValue={location.state?.destination || ""} />
              </div>

              <div className="form-field_filter">
                <label className="form_lable_filter" htmlFor="checkIn">Check-In Date: </label>
                <DatePicker className="form_in_filter" selected={location.state?.date?.[0]?.startDate || new Date()} 
                  onChange={() => {}} dateFormat="dd/MM/yyyy" placeholderText="Select check-in date" />
              </div>

              <div className="form-field_filter">
                <label className="form_lable_filter" htmlFor="checkOut">Check-Out Date:</label>
                <DatePicker className="form_in_filter" selected={location.state?.date?.[0]?.endDate || new Date()} 
                  onChange={() => {}} dateFormat="dd/MM/yyyy" placeholderText="Select check-out date" />
              </div>

              <div className="form-field_filter" ref={dropdownRef}>
                <label className="form_lable_filter" htmlFor="sortOptions">Sort by:</label>
                <input
                  type="text"
                  id="sortOptions"
                  name="sortOptions"
                  className="form_in"
                  placeholder="Select sort option"
                  value={sortOption}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  readOnly
                />
                {isDropdownOpen && (
                  <ul className="sortDropdown">
                    <li onClick={() => handleSortOptionChange('name')}>Name</li>
                    <li onClick={() => handleSortOptionChange('rating')}>Rating</li>
                    <li onClick={() => handleSortOptionChange('price-asc')}>Price: Low to High</li>
                    <li onClick={() => handleSortOptionChange('price-desc')}>Price: High to Low</li>
                    <li onClick={() => handleSortOptionChange('distance')}>Distance</li>
                  </ul>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
      </Container>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="listTitle">Search</h1>
            <div className="listItem">
              <label>Destination</label>
              <input
                placeholder={location.state?.destination || ""}
                type="text"
              />
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
            <div className="listFilter">
              <h5>Sort by:</h5>
              <div className="listFilterOptions">
                <div className="listFilterOption">
                  <label>
                    <input
                      type="radio"
                      name="sortOption"
                      value="name"
                      checked={sortOption === "name"}
                      onChange={(e) => setSortOption(e.target.value)}
                    />
                    Name
                  </label>
                </div>
                <div className="listFilterOption">
                  <label>
                    <input
                      type="radio"
                      name="sortOption"
                      value="rating"
                      checked={sortOption === "rating"}
                      onChange={(e) => setSortOption(e.target.value)}
                    />
                    Rating
                  </label>
                </div>
                <div className="listFilterOption">
                  <label>
                    <input
                      type="radio"
                      name="sortOption"
                      value="price-asc"
                      checked={sortOption === "price-asc"}
                      onChange={(e) => setSortOption(e.target.value)}
                    />
                    Price: Low to High
                  </label>
                </div>
                <div className="listFilterOption">
                  <label>
                    <input
                      type="radio"
                      name="sortOption"
                      value="price-desc"
                      checked={sortOption === "price-desc"}
                      onChange={(e) => setSortOption(e.target.value)}
                    />
                    Price: High to Low
                  </label>
                </div>
                <div className="listFilterOption">
                  <label>
                    <input
                      type="radio"
                      name="sortOption"
                      value="distance"
                      checked={sortOption === "distance"}
                      onChange={(e) => setSortOption(e.target.value)}
                    />
                    Distance
                  </label>
                </div>
              </div>
            </div>
            <button onClick={() => { /* Add your search functionality here */ }}>Search</button>
          </div>

          <div className="listResult">
            {geoError && <p className="errorMessage">{geoError}</p>}
            {error && <p className="errorMessage">{error}</p>}
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <div key={hotel.HotelCode} className="searchItem">
                  <img src={hotel.HotelPicture} alt={hotel.HotelName} className="hotelImg" />
                  <div className="hotelDescription">
                    <h1 className="hotelTitle">{hotel.HotelName}</h1>
                    <span className="hotelDistance">{hotel.HotelAddress}</span>
                    {userPosition && hotel.Latitude && hotel.Longitude && (
                      <span className="hotelDistance">
                        {Math.round(haversineDistance(userPosition, {
                          latitude: parseFloat(hotel.Latitude),
                          longitude: parseFloat(hotel.Longitude),
                        }))} km from you
                      </span>
                    )}
                    <span className="hotelTaxi">
                      {hotel.freeTaxi ? "Free airport taxi" : "No free airport taxi"}
                    </span>
                    {/* <span className="Features">
                      {hotel.features || "No special features"}
                    </span> */}
                    <span className="Cancel">
                      {hotel.freeCancellation ? "Free cancellation" : "No free cancellation"}
                    </span>
                    <span className="CancelSubtitle">
                      You can cancel later, so lock in this great price today!
                    </span>
                  </div>
                  <div className="Details">
                    <span className="hotelRating">{renderStar(hotel.StarRating)}</span>
                    <div className="DetailTexts">
                      <span className="hotelPrice">
                        INR {hotel.Price?.OfferedPriceRoundedOff || "N/A"}
                      </span>
                      <span className="hotelTax">Includes taxes and fees</span>
                      <button onClick={() => fetchHotelInfo(index)} className="CheckButton">
                        See Details
                      </button>
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
    </>
  );
};

export default HotelList;
