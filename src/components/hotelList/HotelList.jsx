import "./HotelList.css";
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import useGeolocation from "./UseGeolocation";
import haversineDistance from "./HaversineDistance";
import ReactPaginate from 'react-paginate';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";

// Rating star Logic
const renderStar = (rating) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    // const color = i <= rating ? "#FFD700": "#d3d3d3"; 
    const color = i <= rating ? "#ffe234" : "#d3d3d3";
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

  // IGST Rate
  const IGST_RATE = 0.18; // 18% IGST

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const hotelsPerPage = 9;
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const totalPages = Math.ceil(hotels.length / hotelsPerPage);
    setPageCount(totalPages);
  }, [hotels]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * hotelsPerPage;
  const currentHotels = hotels.slice(offset, offset + hotelsPerPage);

  const [timer, setTimer] = useState(600000);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 50);
    }, 50);

    if (timer <= 0) {
      clearInterval(countdown);
      navigate('/hotel-search');
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
    navigate('/hotel-search');
  };

  // ----------------for filter----------------
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


// API Integration for checking user login or not
// const checkUserLogin = async () => {
//   const user_id = localStorage.getItem("loginId");
//   if (!user_id) {
//     navigate('/enter-number', { state: { returnTo: '/hotel-list' } });
//     return false;
//   }

//   try {
//     const response = await fetch("https://sajyatra.sajpe.in/admin/api/user-detail", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({ user_id }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Full API response:', data.transaction.transaction_num); // Log the full response for debugging
     
//     // Check if the expected fields are present in the response
//     if (data.transaction.transaction_num) {
//       localStorage.setItem("transactionId", data.transaction.transaction_num);

//       return true;
//     } else {
//       throw new Error("User details fetch failed: Missing transaction_id or success flag.");
//     }
//   } catch (error) {
//     console.error("Error fetching user login details:", error);
//     return false;
//   }
// };


  // -----------API start --------------------

  const fetchHotelInfo = async (index) => {

    // const isLoggedIn = await checkUserLogin();
    // if (!isLoggedIn) return;

    const hotel = hotels[index];
    try {
      const requestData = {
        ResultIndex: "9",
        SrdvIndex: "SrdvTB",
        SrdvType: "SingleTB",
        HotelCode: "92G|DEL",
        TraceId: "1",
      };

      const response = await fetch("https://sajyatra.sajpe.in/admin/api/hotel-info", {
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
        console.log('hotel-info API Response:', data.HotelInfoResult.HotelDetails);
        // Save hotel details in local storage
        localStorage.setItem("hotelDetails", JSON.stringify(data.HotelInfoResult.HotelDetails));

        navigate("/hotel-description", { state: { hotelDetails: data.HotelInfoResult.HotelDetails } });
      } else {
        setError(data.message || "No hotel details found.");
      }
    } catch (error) {
      setError("Failed to fetch hotel details. Please try again later.");
    }
  };


  // ----------------Api End------------------
  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
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

  // Function to calculate IGST
  const calculateIGST = (price) => price * IGST_RATE;
  const calculateTotalPrice = (price) => price - calculateIGST(price);

  return (
    <>
      <CustomNavbar />

      {/* <div className="con">
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
                      onChange={() => { }} dateFormat="dd/MM/yyyy" placeholderText="Select check-in date" />
                  </div>

                  <div className="form-field_filter">
                    <label className="form_lable_filter" htmlFor="checkOut">Check-Out Date:</label>
                    <DatePicker className="form_in_filter" selected={location.state?.date?.[0]?.endDate || new Date()}
                      onChange={() => { }} dateFormat="dd/MM/yyyy" placeholderText="Select check-out date" />
                  </div>

                  <div className="form-field_filter" ref={dropdownRef}>
                    <label className="form_lable_filter">Sort by:</label>
                    <div className="dropdown">
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
                      <FontAwesomeIcon icon={faAngleDown} className="dropdown-icon" />
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
                </div>
              </form>
            </div>
          </section>
        </Container>
      </div> */}
      <div className="timer timer-FlightLists">
          {/* <p>Redirecting in {formatTime(timer)}...</p> */}
          <div> <p><RiTimerLine /> Redirecting in {formatTime(timer)}...</p> </div>
        </div>

      <section className="hotelMainsec">
        
        <div className="listContainer">
          <div className="listWrapper">
            <Container>
              {/* New section start */}
              <Row>
                <Col lg={3} className="listSearchcol">

                  <div className="listSearch">

                    <h1 className="listTitle">Search Your Hotels ....</h1>
                    <div className="listItem">
                      <label>Destination</label>
                      <input
                        placeholder={location.state?.destination || ""}
                        type="text"
                      />
                    </div>
                    <div className="listItem">
                      <label>Check-in Date</label>
                      <DatePicker className="date_picker"
                        selected={location.state?.date?.[0]?.startDate || new Date()}
                        onChange={(date) => { }}
                        minDate={new Date()}
                        dateFormat="MM/dd/yyyy"
                      />
                    </div>
                    <div className="listItem">
                      <label>Check-out Date</label>
                      <DatePicker className="date_picker"
                        selected={location.state?.date?.[0]?.endDate || new Date()}
                        onChange={(date) => { }}
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
                              className="radioButton"
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
                              className="radioButton"
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
                              className="radioButton"
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
                              className="radioButton"
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
                              className="radioButton"
                            />
                            Distance
                          </label>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { /* Add your search functionality here */ }}>Search</button>
                  </div>

                </Col>
                {/* Section End */}

                {/* New section Start */}
                <Col lg={9} className="listResultcol">
                  <div className="listResult">
                    {geoError && <p className="errorMessage">{geoError}</p>}
                    {error && <p className="errorMessage">{error}</p>}
                    {hotels.length > 0 ? (
                      currentHotels.map((hotel, index) => (
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
                                ₹{calculateTotalPrice(hotel.Price?.OfferedPriceRoundedOff || 0).toFixed(2)}
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
                </Col>
                {/* End new section */}
              </Row>
            </Container>
          </div>
        </div>

        <div className="paginationContainer">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </div>
        <Footer />

      </section>

    </>
  );
};

export default HotelList;
