import "./HotelList.css";
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar} from "@fortawesome/free-solid-svg-icons";
import useGeolocation from "./UseGeolocation";
import haversineDistance from "./HaversineDistance";
import ReactPaginate from 'react-paginate';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import { RiTimerLine } from "react-icons/ri";
import EnterOtp from '../popUp/EnterOtp';
import Timer from '../timmer/Timer';

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
  // const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('name');
  const { position: userPosition, error: geoError } = useGeolocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [destination, setDestination] = useState("");

  // IGST Rate
  // const IGST_RATE = 0.18; // 18% IGST

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const hotelsPerPage = 9;
  const [pageCount, setPageCount] = useState(0);

  const [showOtpOverlay, setShowOtpOverlay] = useState(false);
  
  useEffect(() => {
    const totalPages = Math.ceil(hotels.length / hotelsPerPage);
    setPageCount(totalPages);
  }, [hotels]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * hotelsPerPage;
  const currentHotels = hotels.slice(offset, offset + hotelsPerPage);


  // ---------------------------------------------

  // const [timer, setTimer] = useState(600000); // 10 minutes in milliseconds
  const navigate = useNavigate();

  // useEffect(() => {
  //   const endTime = localStorage.getItem('h-timerEndTime');
  //   const now = Date.now();
    
  //   let remainingTime = endTime ? parseInt(endTime) - now : 600000;

  //   // Log the remaining time to check if it's calculated correctly
  //   console.log('Initial remaining time:', remainingTime);

  //   if (remainingTime <= 0) {
  //     navigate('/hotel-search'); // Redirect if the timer has already expired
  //     return;
  //   }

  //   setTimer(remainingTime);

  //   const countdown = setInterval(() => {
  //     setTimer((prev) => {
  //       const updatedTime = prev - 1000;

  //       // Log the updated time to check if it's decreasing as expected
  //       console.log('Updated time:', updatedTime);

  //       if (updatedTime <= 0) {
  //         clearInterval(countdown);
  //         localStorage.removeItem('h-timerEndTime'); // Clean up localStorage
  //         navigate('/hotel-search'); // Redirect when the timer expires
  //         return 0;
  //       }

  //       // Update end time in localStorage
  //       localStorage.setItem('h-timerEndTime', Date.now() + updatedTime);
  //       return updatedTime;
  //     });
  //   }, 1000);

  //   return () => clearInterval(countdown); // Clean up interval on component unmount
  // }, [navigate]);

  // const formatTime = (milliseconds) => {
  //   const totalSeconds = Math.floor(milliseconds / 1000);
  //   const minutes = Math.floor(totalSeconds / 60);
  //   const seconds = totalSeconds % 60;
  //   return `${minutes} min ${seconds} sec left`;
  // };


  // ----------------------------------------------

  const navigateSearch = () => {
    navigate('/hotel-search');
  };

  // ----------------for filter----------------

  const filterHotelsByDestination = (hotels, destination) => {
    if (!destination) return hotels;
    return hotels.filter(hotel =>
      hotel.HotelName.toLowerCase().includes(destination.toLowerCase())
    );
  };
  

  useEffect(() => {
    let filteredHotels = filterHotelsByDestination(searchResults || [], destination);
    
    // Sort the filtered hotels based on the selected option
    const sortedHotels = [...filteredHotels];
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
  }, [searchResults, destination, sortOption, userPosition]);
  

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setHotels(searchResults);
    } else {
      setError("No hotel details found.");
    }
  }, [searchResults]);

  // -----------API start --------------------

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

// --------------



const HandelHotelInfo = async (index) => {
  const loginId = localStorage.getItem('loginId');
  console.log('Current loginId:', loginId);
  
  await useridHandler();

  if (!loginId) {
    console.log('No loginId found after fetching user details');
    setShowOtpOverlay(true);
    return;
  }

  await fetchHotelInfo(destination, index);
};


  const closeOtpOverlay = () => {
    setShowOtpOverlay(false); 
  };

  const useridHandler = async () => {

  const loginId = localStorage.getItem('loginId');
     
    try {
      const requestBody = {
        user_id:loginId , 
      };
  
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/user-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const data = await response.json();
      
      console.log('User details:', data);
      if (data.result && data.transaction) {
        localStorage.setItem('transactionId', data.transaction.id);
        localStorage.setItem('transactionNum', data.transaction.transaction_num);
        // localStorage.setItem('transactionNumHotel', data.transaction.transaction_num);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };
  
  // ----------------Api End------------------
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

  // Function to calculate IGST
  // const calculateIGST = (price) => price * IGST_RATE;
  // const calculateTotalPrice = (price) => price - calculateIGST(price);

  const [inputs, setInputs] = useState({
    
    checkIn: null,
    checkOut: null,
   
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setInputs((values) => ({ ...values, [name]: date }));
  };


  return (
    <>
      <CustomNavbar />
      
      <Timer />
      {/* <div className="timer">
          <div> <p><RiTimerLine /> Redirecting in {formatTime(timer)}...</p> </div>
        </div> */}

      <section className="hotelMainsec">
        
        <div className="listContainer">
          <div className="listWrapper">
            <Container>
              {/* New section start */}
              <Row>
                <Col lg={3} className="listSearchcol">
                  <div className="listSearch">
                    <h1 className="listTitle">Search Your Hotels </h1>
                    <div className="listItem">
                      <label>Destination</label>
                      <input
                      type="text"
                       className="destination-input"
                       placeholder="Enter hotel  name"
                       value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                                  />

                    </div>

                    <div className="listItem">
                      <label>Check-in Date</label>
                      <DatePicker className="list_in" selected={inputs.checkIn} 
                       onChange={(date) => handleDateChange(date, "checkIn")} 
                       dateFormat="dd/MM/yyyy" 
                         placeholderText="Select check-in date"
                               minDate={new Date()} 
                         />
                    </div>

                    <div className="listItem">
                      <label>Check-out Date</label>
                      <DatePicker className="list_in" selected={inputs.checkOut} 
                       onChange={(date) => handleDateChange(date, "checkOut")} 
                          dateFormat="dd/MM/yyyy" 
                         placeholderText="Select check-out date" 
                           minDate={inputs.checkIn || new Date()} 
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
                    <button onClick={HandelHotelInfo}>Search</button>
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
                                {/* ₹{calculateTotalPrice(hotel.Price?.OfferedPriceRoundedOff || 0).toFixed(2)} */}
                                ₹{(hotel.Price?.OfferedPriceRoundedOff || 0).toFixed(2)}
                              </span>
                                <div>
                              <span className="hotelTax"> No Includes taxes and fees</span>
                              <button onClick={()=>HandelHotelInfo(index)} className="CheckButton">
                                See Details
                              </button>
                              </div>
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
          <EnterOtp showModal={showOtpOverlay} onClose={() => setShowOtpOverlay(false)} />
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
