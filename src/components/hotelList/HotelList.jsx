import "./HotelList.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hotel list data:", searchResults);
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
  
      console.log("Request data:", requestData);
  
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
      console.log("Hotel details response:", data);
  
      if (data && data.HotelInfoResult && data.HotelInfoResult.HotelDetails) {
        
        navigate("/hotel-description", { state: { hotelDetails: data.HotelInfoResult.HotelDetails } });
      } else {
        setError(data.message || "No hotel details found.");
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      setError("Failed to fetch hotel details. Please try again later.");
    }
  };

  return (
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
          <button onClick={fetchHotelInfo}>Search</button>
        </div>


        <div className="listResult">
          {error && <p className="errorMessage">{error}</p>}
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div key={hotel.HotelCode} className="searchItem">
                <img src={hotel.HotelPicture} alt={hotel.HotelName}   className="hotelImg" />
                <div className="hotelDescription">
                  <h1 className="hotelTitle">{hotel.HotelName}</h1>
                  <span className="hotelDistance">{hotel.HotelAddress}</span>
                  <span className="hotelTaxi">
                    {hotel.freeTaxi
                      ? "Free airport taxi"
                      : "No free airport taxi"}
                  </span>
                  <span className="Features">
                    {hotel.features || "No special features"}
                  </span>
                  <span className="Cancel">
                    {hotel.freeCancellation
                      ? "Free cancellation"
                      : "No free cancellation"}
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
                    <button onClick={() => fetchHotelInfo(index)}  className="CheckButton">
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
  );
};

export default HotelList;
