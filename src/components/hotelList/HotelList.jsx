import "./HotelList.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import ratingStar from '../../../src/assets/images/star_img.png'
const HotelList = () => {
  const location = useLocation();

  const navigate = useNavigate();
const detailHandler = () => {
  navigate('/hotel-description')
}
  
  
  const defaultState = {
    destination: '',
    date: [{ startDate: new Date(), endDate: new Date() }],
    options: { adult: 1, children: 0, room: 1 },
  };

  
  const parseDate = (dateStr) => {
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate) ? new Date() : parsedDate;
  };

  const [destination, setDestination] = useState(location.state?.destination || defaultState.destination);
  const [startDate, setStartDate] = useState(parseDate(location.state?.date?.[0]?.startDate) || defaultState.date[0].startDate);
  const [endDate, setEndDate] = useState(parseDate(location.state?.date?.[0]?.endDate) || defaultState.date[0].endDate);
  const [options, setOptions] = useState(location.state?.options || defaultState.options);

  useEffect(() => {
    if (!location.state) {
      setDestination(defaultState.destination);
      setStartDate(defaultState.date[0].startDate);
      setEndDate(defaultState.date[0].endDate);
      setOptions(defaultState.options);
    }
  }, [location.state]);

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="listSearch">
          <h1 className="listTitle">Search</h1>
          <div className="listItem">
            <label>Destination</label>
            <input placeholder={destination} type="text" />
          </div>
          <div className="listItem">
            <label>Check-in Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="listItem">
            <label>Check-out Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
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
                  placeholder={options.adult}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Children</span>
                <input
                  type="number"
                  min={0}
                  className="listOptionInput"
                  placeholder={options.children}
                />
              </div>
              <div className="listOptionItem">
                <span className="listOptionText">Room</span>
                <input
                  type="number"
                  min={1}
                  className="listOptionInput"
                  placeholder={options.room}
                />
              </div>
            </div>
          </div>
          <button>Search</button>
        </div>
        <div className="listResult">
        <div className="searchItem">
      <img
        src="https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg"
        alt=""
        className="hotelImg"
      />
      <div className="hotelDescription">
        <h1 className="hotelTitle">Tower Street Apartments</h1>
        <span className="hotelDistance">500m from center</span>
        <span className="hotelTaxi">Free airport taxi</span>
        <span className="Subtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="Features">
          Entire studio • 1 bathroom • 21m² 1 full bed
        </span>
        <span className="Cancel">Free cancellation </span>
        <span className="CancelSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="Details">
        <div className="hotelRating">
          <span>Excellent</span>
          <img className="rating_star" src={ratingStar} alt="rating" />
        </div>
        <div className="DetailTexts">
          <span className="hotelPrice"> ₹1658.17</span>
          <span className="hotelTax">Includes taxes and fees</span>
          <button  onClick={detailHandler} className="CheckButton">See Details</button>
        </div>
      </div>
    </div>

    <div className="searchItem">
      <img
        src="https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg"
        alt=""
        className="hotelImg"
      />
      <div className="hotelDescription">
        <h1 className="hotelTitle">Tower Street Apartments</h1>
        <span className="hotelDistance">500m from center</span>
        <span className="hotelTaxi">Free airport taxi</span>
        <span className="Subtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="Features">
          Entire studio • 1 bathroom • 21m² 1 full bed
        </span>
        <span className="Cancel">Free cancellation </span>
        <span className="CancelSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="Details">
        <div className="hotelRating">
          <span>Excellent</span>
          <img className="rating_star" src={ratingStar} alt="rating" />
        </div>
        <div className="DetailTexts">
          <span className="hotelPrice"> ₹1658.17</span>
          <span className="hotelTax">Includes taxes and fees</span>
          <button  onClick={detailHandler} className="CheckButton">See Details</button>
        </div>
      </div>
    </div>

    <div className="searchItem">
      <img
        src="https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg"
        alt=""
        className="hotelImg"
      />
      <div className="hotelDescription">
        <h1 className="hotelTitle">Tower Street Apartments</h1>
        <span className="hotelDistance">500m from center</span>
        <span className="hotelTaxi">Free airport taxi</span>
        <span className="Subtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="Features">
          Entire studio • 1 bathroom • 21m² 1 full bed
        </span>
        <span className="Cancel">Free cancellation </span>
        <span className="CancelSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="Details">
        <div className="hotelRating">
          <span>Excellent</span>
          <img className="rating_star" src={ratingStar} alt="rating" />
        </div>
        <div className="DetailTexts">
          <span className="hotelPrice"> ₹1658.17</span>
          <span className="hotelTax">Includes taxes and fees</span>
          <button onClick={detailHandler} className="CheckButton">See Details</button>
        </div>
      </div>
    </div>


        </div>
      </div>
    </div>
  );
};

export default HotelList;
