import React, { useState ,useEffect } from 'react';
import "./FlightDetails.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';

const SeatMealBaggageTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { seatData, ssrData, formData } = state || {}; // Destructure state

    // console.log('Seat Data:', seatData);
    // console.log('SSR Data:', ssrData);
    // console.log('formData:', formData);

    // Calculate the total count
    const totalCount = formData.AdultCount + formData.ChildCount + formData.InfantCount;
    // console.log("Total travller", totalCount);


    const [activeTab, setActiveTab] = useState('Seats');

    const renderSeatsTab = () => {
        return (
            <div className="seatsTabss">
                <h5>SELECT YOUR PREFERRED SEAT</h5>
                <div className="row seatsTabssRow">
                    <div className="col-lg-4 seatsTabssColImg">
                        <img
                            className="img-fluid"
                            src='/src/assets/images/flightseattss-removebg-preview.png'
                            alt="First slide"
                        />
                    </div>
                    <div className="col-lg-8">
                        <div className="seatsTabssColText">
                            <div className="seat-selection row">
                                {seatData.map((seat) => (
                                    <div key={seat.id} className="col-md-2 col-3">
                                        <button className="f-seat">
                                            <h6>{seat.seatNumber}</h6>
                                            <img
                                                className="img-fluid"
                                                src='/src/assets/images/seat-2-removebg-preview.png'
                                                alt="Seat"
                                            />
                                            <p>₹{seat.price}</p>
                                        </button>
                                    </div>
                                ))}
                                {/* {seatData.map((seat) => (
                                <div key={seat.id} className="col-3">
                                    <button className="f-seat">
                                        <h6>{seat.seatNumber}</h6>
                                        <img
                                            className="img-fluid"
                                            src='/src/assets/images/seat-2-removebg-preview.png'
                                            alt="Seat"
                                        />
                                        <p>₹{seat.price}</p>
                                    </button>
                                </div>
                            ))} */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    const renderMealsTab = () => {
        return (
            <div className="MealsTabss">
                <h5>Select Your Meal</h5>
                {/* Meal selection code */}
            </div>
        );
    };

    const renderBaggageTab = () => {
        return (
            <div className="baggageTabbss">
                <h5>Select Your Baggage Option</h5>
                {ssrData.map((ssr, index) => (
                    <div key={index} className="baggage-selection">
                        <div className="row">
                            <div className="col-md-6">
                                <p>{ssr.Weight} kg</p>
                                <h6>₹{ssr.Price}</h6>
                            </div>
                            {/* <div className="col-md-4">
                                <div className="form-check">
                                    <input type="checkbox" id={`carryOn${index}`} className="form-check-input" />
                                    <label className="form-check-label" htmlFor={`carryOn${index}`}>Carry-On</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" id={`checkedBag${index}`} className="form-check-input" />
                                    <label className="form-check-label" htmlFor={`checkedBag${index}`}>Checked Bag</label>
                                </div>
                            </div> */}
                            <div className="col-md-6 baggagge-selectionbtn">
                                <div>
                                    <button>+ Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    // for timerss----------------------------------
    const [timer, setTimer] = useState(600000);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => prev - 50); // Decrease timer by 50 milliseconds each tick
        }, 50); // Interval of 50 milliseconds

        if (timer <= 0) {
            clearInterval(countdown);
            alert("Your Session is Expired");
            navigate('/flight-search');
        }

        return () => clearInterval(countdown);
    }, [timer, navigate]);

    const formatTimers = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec left`;
    };

    // for timerss----------------------------------

    return (
        <>
        <CustomNavbar/>
            {/* timerrr-------------------  */}
            <div className="timer-FlightLists">
                <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
            </div>
            {/* timerrr-------------------  */}

            <div className="container-fluid selectSeatMealCont">
                <div className='container'>
                    <div className="row selectSeatMealContROW">
                        <div className="col-12">
                            <div className="mt-4 selectSeatMealDivBtnTabss">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${activeTab === 'Seats' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('Seats')}
                                        >
                                            Seats
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${activeTab === 'Meals' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('Meals')}
                                        >
                                            Meals
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${activeTab === 'Baggage' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('Baggage')}
                                        >
                                            Baggage
                                        </a>
                                    </li>
                                </ul>

                                <div className="tab-content mt-4">
                                    {activeTab === 'Seats' && renderSeatsTab()}
                                    {activeTab === 'Meals' && renderMealsTab()}
                                    {activeTab === 'Baggage' && renderBaggageTab()}
                                </div>
                            </div>
                        </div>

                        <div class="col-12 lastBtnssContinue">
                            <h5>Fare Breakup <span>₹13465</span></h5>
                            <button>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default SeatMealBaggageTabs;
