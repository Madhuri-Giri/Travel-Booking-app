// import React, { useState ,useEffect } from 'react';
// import "./FlightDetails.css"
// import { useLocation, useNavigate } from 'react-router-dom';
// import { RiTimerLine } from "react-icons/ri";
// import CustomNavbar from '../../pages/navbar/CustomNavbar';
// import Footer from '../../pages/footer/Footer';

// const SeatMealBaggageTabs = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { state } = location;
//     const { seatData, ssrData, formData } = state || {}; // Destructure state

//     // console.log('Seat Data:', seatData);
//     // console.log('SSR Data:', ssrData);
//     // console.log('formData:', formData);

//     // Calculate the total count
//     const totalCount = formData.AdultCount + formData.ChildCount + formData.InfantCount;
//     // console.log("Total travller", totalCount);


//     const [activeTab, setActiveTab] = useState('Seats');

//     const renderSeatsTab = () => {
//         return (
//             <div className="seatsTabss">
//                 <h5>SELECT YOUR PREFERRED SEAT</h5>
//                 <div className="row seatsTabssRow">
//                     <div className="col-lg-4 seatsTabssColImg">
//                         <img
//                             className="img-fluid"
//                             src='/src/assets/images/flightseattss-removebg-preview.png'
//                             alt="First slide"
//                         />
//                     </div>
//                     <div className="col-lg-8">
//                         <div className="seatsTabssColText">
//                             <div className="seat-selection row">
//                                 {seatData.map((seat) => (
//                                     <div key={seat.id} className="col-md-2 col-3">
//                                         <button className="f-seat">
//                                             <h6>{seat.seatNumber}</h6>
//                                             <img
//                                                 className="img-fluid"
//                                                 src='/src/assets/images/seat-2-removebg-preview.png'
//                                                 alt="Seat"
//                                             />
//                                             <p>₹{seat.price}</p>
//                                         </button>
//                                     </div>
//                                 ))}
//                                 {/* {seatData.map((seat) => (
//                                 <div key={seat.id} className="col-3">
//                                     <button className="f-seat">
//                                         <h6>{seat.seatNumber}</h6>
//                                         <img
//                                             className="img-fluid"
//                                             src='/src/assets/images/seat-2-removebg-preview.png'
//                                             alt="Seat"
//                                         />
//                                         <p>₹{seat.price}</p>
//                                     </button>
//                                 </div>
//                             ))} */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         );
//     };

//     const renderMealsTab = () => {
//         return (
//             <div className="MealsTabss">
//                 <h5>Select Your Meal</h5>
//                 {/* Meal selection code */}
//             </div>
//         );
//     };

//     const renderBaggageTab = () => {
//         return (
//             <div className="baggageTabbss">
//                 <h5>Select Your Baggage Option</h5>
//                 {ssrData.map((ssr, index) => (
//                     <div key={index} className="baggage-selection">
//                         <div className="row">
//                             <div className="col-md-6">
//                                 <p>{ssr.Weight} kg</p>
//                                 <h6>₹{ssr.Price}</h6>
//                             </div>
//                             {/* <div className="col-md-4">
//                                 <div className="form-check">
//                                     <input type="checkbox" id={`carryOn${index}`} className="form-check-input" />
//                                     <label className="form-check-label" htmlFor={`carryOn${index}`}>Carry-On</label>
//                                 </div>
//                                 <div className="form-check">
//                                     <input type="checkbox" id={`checkedBag${index}`} className="form-check-input" />
//                                     <label className="form-check-label" htmlFor={`checkedBag${index}`}>Checked Bag</label>
//                                 </div>
//                             </div> */}
//                             <div className="col-md-6 baggagge-selectionbtn">
//                                 <div>
//                                     <button>+ Add</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     };


//     // for timerss----------------------------------
//     const [timer, setTimer] = useState(600000);

//     useEffect(() => {
//         const countdown = setInterval(() => {
//             setTimer((prev) => prev - 50); // Decrease timer by 50 milliseconds each tick
//         }, 50); // Interval of 50 milliseconds

//         if (timer <= 0) {
//             clearInterval(countdown);
//             alert("Your Session is Expired");
//             navigate('/flight-search');
//         }

//         return () => clearInterval(countdown);
//     }, [timer, navigate]);

//     const formatTimers = (milliseconds) => {
//         const totalSeconds = Math.floor(milliseconds / 1000);
//         const minutes = Math.floor(totalSeconds / 60);
//         const seconds = totalSeconds % 60;
//         return `${minutes} min ${seconds} sec left`;
//     };

//     // const fareDataDetails = localStorage.getItem('fareDataDetails');
//     // const reviewHandler = () => {
//     //     if (fareDataDetails) {
//     //         navigate('/flight-review', { state: { fareDataDetails } });
//     //     } else {
//     //         console.error('fareDataDetails is undefined');
//     //     }
//     // }

//     // for timerss----------------------------------

//     return (
//         <>
//         <CustomNavbar/>
//             {/* timerrr-------------------  */}
//             <div className="timer-FlightLists">
//                 <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
//             </div>
//             {/* timerrr-------------------  */}

//             <div className="container-fluid selectSeatMealCont">
//                 <div className='container'>
//                     <div className="row selectSeatMealContROW">
//                         <div className="col-12">
//                             <div className="mt-4 selectSeatMealDivBtnTabss">
//                                 <ul className="nav nav-tabs">
//                                     <li className="nav-item">
//                                         <a
//                                             className={`nav-link ${activeTab === 'Seats' ? 'active' : ''}`}
//                                             onClick={() => setActiveTab('Seats')}
//                                         >
//                                             Seats
//                                         </a>
//                                     </li>
//                                     <li className="nav-item">
//                                         <a
//                                             className={`nav-link ${activeTab === 'Meals' ? 'active' : ''}`}
//                                             onClick={() => setActiveTab('Meals')}
//                                         >
//                                             Meals
//                                         </a>
//                                     </li>
//                                     <li className="nav-item">
//                                         <a
//                                             className={`nav-link ${activeTab === 'Baggage' ? 'active' : ''}`}
//                                             onClick={() => setActiveTab('Baggage')}
//                                         >
//                                             Baggage
//                                         </a>
//                                     </li>
//                                 </ul>

//                                 <div className="tab-content mt-4">
//                                     {activeTab === 'Seats' && renderSeatsTab()}
//                                     {activeTab === 'Meals' && renderMealsTab()}
//                                     {activeTab === 'Baggage' && renderBaggageTab()}
//                                 </div>
//                             </div>
//                         </div>

//                         <div class="col-12 lastBtnssContinue">
//                             <h5>Fare Breakup <span>₹13465</span></h5>
//                             <button>Continue</button>
//                             {/* <button onClick={reviewHandler}>Continue</button> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer/>
//         </>
//     );
// };

// export default SeatMealBaggageTabs;



// --------------------------------------------new data-------------------------------------------------------------------



import React, { useState, useEffect } from 'react';
import "./FlightDetails.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import "./SeatMealBaggage.css"

const SeatMealBaggageTabs = () => {
    const location = useLocation();
    const { fareDataDetails } = location.state || {}; // Use optional chaining
    // console.log("seatmealbaggage fareDataDetails", fareDataDetails);


    const navigate = useNavigate();
    const [seatData, setSeatData] = useState([]);
    const [activeTab, setActiveTab] = useState('Seats');
    const [selectedSeats, setSelectedSeats] = useState([]);

    const ssrData = [
        { Weight: 15, Price: 1000 },
        { Weight: 20, Price: 1500 }
    ];

    const formData = {
        AdultCount: 1,
        ChildCount: 0,
        InfantCount: 0
    };

    const totalCount = formData.AdultCount + formData.ChildCount + formData.InfantCount;

    const [timer, setTimer] = useState(600000);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => prev - 50);
        }, 50);

        if (timer <= 0) {
            clearInterval(countdown);
            alert("Your Session is Expired");
            navigate('/flight-search');
        }

        return () => clearInterval(countdown);
    }, [timer, navigate]);

    useEffect(() => {
        handleSeatMapApi();
    }, []);

    useEffect(() => {
        const savedSeats = JSON.parse(localStorage.getItem('flightSelectedSeats')) || [];
        setSelectedSeats(savedSeats);
    }, []);

    const formatTimers = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec left`;
    };


    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const reviewHandler = () => {
        // Ensure fareDataDetails is defined before navigating
        if (fareDataDetails) {
            // setLoading(true);
            setTimeout(() => {
                navigate('/flight-review', { state: { fareDataDetails } });
            }, 1000);
        } else {
            console.error('fareDataDetails is undefined');
        }
    }


    const handleSeatMapApi = async () => {
        const result = await seatMapApi();
        if (result) {
            setSeatData(parseSeatMapData(result));
        }
    };

    const seatMapApi = async () => {


        const FtraceId = localStorage.getItem('F-TraceId');
        const FresultIndex = localStorage.getItem('F-ResultIndex');
        const FsrdvType = localStorage.getItem('F-SrdvType');
        const FsrdvIndex = localStorage.getItem('F-SrdvIndex');


        const url = 'https://sajyatra.sajpe.in/admin/api/seatmap';



        const payload = {
            SrdvIndex: FsrdvIndex,
            ResultIndex: FresultIndex,
            TraceId: parseInt(FtraceId),
            SrdvType: FsrdvType,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('seatMapData', JSON.stringify(data));
            console.log('seatMapResponse', data)
            return data;
        } catch (error) {
            console.error('Error fetching seat map:', error);
            return null;
        }
    };

    const getSeatMapDataFromLocalStorage = () => {
        const data = localStorage.getItem('seatMapData');
        return data ? JSON.parse(data) : null;
    };


    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleSsrApi = async () => {
        const result = await ssrApiHandler();

        if (result) {
            console.log('SSR API Response:', result);

            // setSsrData(result);
        }
    };


    const ssrApiHandler = async () => {

        const FtraceId = localStorage.getItem('F-TraceId');
        const FresultIndex = localStorage.getItem('F-ResultIndex');
        const FsrdvType = localStorage.getItem('F-SrdvType');
        const FsrdvIndex = localStorage.getItem('F-SrdvIndex');


        const url = 'https://sajyatra.sajpe.in/admin/api/ssr';
        const payload = {
            SrdvIndex: FsrdvIndex,
            ResultIndex: FresultIndex,
            TraceId: parseInt(FtraceId),
            SrdvType: FsrdvType,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('ssrApiData', JSON.stringify(data))
            console.log('SSR API Response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching SSR API:', error);
            return null;
        }
    };


    const getSsrApiData = () => {
        const ssrApiData = localStorage.getItem('ssrApiData');
        if (ssrApiData) {
            const parsedData = JSON.parse(ssrApiData);
            // Extract Baggage information
            if (parsedData.Baggage && parsedData.Baggage[0]) {
                return parsedData.Baggage[0]; // Assuming first element is what you want
            }
        }
        console.log('No SSR API data found in localStorage');
        return [];
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------


    const parseSeatMapData = (data) => {
        if (!data || !data.Results || !data.Results.length) return [];

        const seats = [];
        const rows = data.Results[0].Seats;

        Object.keys(rows).forEach(rowKey => {
            const row = rows[rowKey];
            Object.keys(row).forEach(columnKey => {
                const seat = row[columnKey];
                seats.push({
                    seatNumber: seat.SeatNumber,
                    price: seat.Amount,
                    isBooked: seat.IsBooked,
                    isLegroom: seat.IsLegroom,
                    isAisle: seat.IsAisle
                });
            });
        });

        return seats;
    };

    const handleSeatClick = (seat) => {
        // Check if the seat is already in the selectedSeats array
        const isAlreadySelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);

        let updatedSeats;

        if (isAlreadySelected) {
            // If the seat is already selected, remove it
            updatedSeats = selectedSeats.filter(s => s.seatNumber !== seat.seatNumber);
        } else {
            // If the seat is not selected, add it
            updatedSeats = [...selectedSeats, seat];
        }

        // Update state and local storage
        setSelectedSeats(updatedSeats);
        localStorage.setItem('flightSelectedSeats', JSON.stringify(updatedSeats));
    };

    // Function to calculate total price of selected seats
    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    const renderSeatsTab = () => (
        <div className="seatsTabss">
            <h5>SELECT YOUR PREFERRED SEAT</h5>
            {/* ------------------------ */}
            <div className="seaat-price">
                <h6>Selected Seats: ({selectedSeats.map(seat => seat.seatNumber).join(', ')})</h6>
                <h6>Total Price: (₹{calculateTotalPrice()})</h6>

            </div>
            {/* ------------------------ */}

            <div className="row seatsTabssRow">
                <div className="col-lg-4 seatsTabssColImg">
                    <img
                        className="img-fluid"
                        src='/src/assets/images/flightseattss-removebg-preview.png'
                        alt="Seats"
                    />
                </div>
                <div className="col-lg-8">
                    <div className="seatsTabssColText">
                        <div className="seat-selection row">
                            {seatData.map((seat, index) => (
                                <div key={index} className="col-md-2 col-3">
                                    <button
                                        className={`f-seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.find(s => s.seatNumber === seat.seatNumber) ? 'selected' : ''}`}
                                        onClick={() => handleSeatClick(seat)}
                                    >
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMealsTab = () => (
        <div className="MealsTabss">
            <h5>Select Your Meal</h5>
        </div>
    );

    const [selectedBaggage, setSelectedBaggage] = useState(null);

    const handleBaggageClick = (baggage) => {
        setSelectedBaggage(baggage.Weight === selectedBaggage?.Weight ? null : baggage);
    };

    const renderBaggageTab = () => {
        const baggageData = getSsrApiData();

        return (
            <div className="baggageTabbss">
                <h5>Select Your Baggage Option</h5>
                {baggageData.map((baggage, index) => (
                    <div key={index} className="baggage-selection">
                        <div className="row">
                            <div className="col-md-6">
                                <p>{baggage.Weight} kg</p>  {/* Weight or Description */}
                                <h6>₹{baggage.Price}</h6>
                            </div>
                            <div className="col-md-6 baggagge-selectionbtn">
                                <div>
                                    <button
                                        className={selectedBaggage?.Weight === baggage.Weight ? 'btn-added' : 'btn-add'}
                                        onClick={() => handleBaggageClick(baggage)}
                                    >
                                        {selectedBaggage?.Weight === baggage.Weight ? '✓ Added' : '+ Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            <CustomNavbar />
            <div className="timer-FlightLists">
                <div>
                    <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p>
                </div>
            </div>

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
                                            <button style={{ border: 'none', backgroundColor: "none" }} onClick={handleSeatMapApi}>Seats</button>
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
                                            <button style={{ border: 'none', backgroundColor: "none" }} onClick={handleSsrApi}> Baggage</button>
                                        </a>
                                    </li>




                                </ul>
                            </div>

                        </div>



                        <div className="tab-content">
                            {activeTab === 'Seats' && renderSeatsTab()}
                            {activeTab === 'Meals' && renderMealsTab()}
                            {activeTab === 'Baggage' && renderBaggageTab()}
                        </div>
                    </div>

                    <div className="meal-last">
                        <button onClick={reviewHandler}>Continue</button>
                    </div>

                </div>


            </div>
            <Footer />
        </>
    );
};

export default SeatMealBaggageTabs;
