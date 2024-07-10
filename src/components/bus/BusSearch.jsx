import { useRef } from 'react';
import BusMainImg from "../../assets/images/busMainImg.png";
import "./BusSearch.css";
import BusGurantee from './BusGurantee';

const BusSearch = () => {
  const dateInputRef = useRef(null);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className='BusSearch'>
        <div className="bus-search">
{/* -------------------------------------------------------- */}
          <div className="B-main">
            <div className="B-main-top">
              <img src={BusMainImg} alt="" />
            </div>
            <div className="B-main-btm">
              <div className="sarch-tab">
                <div className="one">
                  <div className="ipt">
                    <label>From</label>
                    <div className="input-content">
                      <i className="ri-map-pin-line"></i>
                      <input type="text" placeholder='Starting Point' />
                    </div>
                  </div>
                </div>
                <div className="one">
                  <div className="ipt">
                    <label>To</label>
                    <div className="input-content">
                      <i className="ri-map-pin-line"></i>
                      <input type="text" placeholder='Destination' />
                    </div>
                  </div>
                </div>
                <div className="one">
                  <div className="ipt">
                    <label>Departure Date</label>
                    <div className="input-content">
                      <i className="ri-calendar-2-line" onClick={handleIconClick}></i>
                      <input
                        type="date"
                        placeholder=''
                        ref={dateInputRef}
                        className="date-input"
                        min={today} 
                      />
                    </div>
                  </div>
                </div>
                <div className="search-bus-btn">
                  <label>Search Bus</label>
                  <button>Search Buses</button>
                </div>
              </div>
            </div>
          </div>

{/* --------------------------------------------------------- */}
<BusGurantee />
        </div>
      </div>
    </>
  );
}

export default BusSearch;
