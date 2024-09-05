import React, { useState, useEffect } from 'react';
import "./FlightDetails.css";
import { useLocation, useNavigate } from 'react-router-dom';
// import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import "./SeatMealBaggage.css";
import FlightSeat from "../../assets/images/FlightSeat.png"
import FlightImg from "../../assets/images/flightImgg.png"

const SeatMealBaggageTabs = () => {
    const location = useLocation();
    const { fareDataDetails } = location.state || {};
    const navigate = useNavigate();
    const [seatData, setSeatData] = useState([]);
    const [activeTab, setActiveTab] = useState('Seats');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBaggage, setSelectedBaggage] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);

    // const [timer, setTimer] = useState(600000);


    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve the base fare from local storage
        const savedFare = localStorage.getItem('selectedFlightBaseFare');

        // Set the totalFare state, converting it to a number
        if (savedFare) {
            setTotalPrice(parseFloat(savedFare));
        }
    }, []);

    useEffect(() => {
        // Clear selections and prices from local storage
        localStorage.removeItem('flightSelectedSeats');
        localStorage.removeItem('selectedBaggage');
        localStorage.removeItem('selectedMeal');
        localStorage.removeItem('finalTotalPrice');
        
        // Reset state
        setSelectedSeats([]);
        setSelectedBaggage(null);
        setSelectedMeal(null);

        // Optionally, reset total price based on base fare
        const savedFare = localStorage.getItem('selectedFlightBaseFare');
        if (savedFare) {
            setTotalPrice(parseFloat(savedFare));
        }
    }, []);

    const seatPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const mealPrice = selectedMeal?.Price ||  0; 
    const baggagePrice = selectedBaggage?.Price || 0;

    const finalTotalPrice = seatPrice + mealPrice + baggagePrice;

    // Save the final total price to local storage
    localStorage.setItem('finalTotalPrice', finalTotalPrice.toFixed(2));



   

    const formData = {
        AdultCount: 1,
        ChildCount: 0,
        InfantCount: 0
    };

    const totalCount = formData.AdultCount + formData.ChildCount + formData.InfantCount;

   

    useEffect(() => {
        handleSeatMapApi();
    }, []);

    useEffect(() => {
        const savedSeats = JSON.parse(localStorage.getItem('flightSelectedSeats')) || [];
        setSelectedSeats(savedSeats);
    }, []);

    useEffect(() => {
        const savedBaggage = JSON.parse(localStorage.getItem('selectedBaggage')) || null;
        setSelectedBaggage(savedBaggage);
    }, []);

//  ------------------------------------




    const reviewHandler = () => {
        if (fareDataDetails) {
            setTimeout(() => {
                navigate('/flight-review', { state: { fareDataDetails } });
            }, 1000);
        } else {
            console.error('fareDataDetails is undefined');
        }
    };

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
            console.log('Seat map Response', data)
            localStorage.setItem('seatMapData', JSON.stringify(data));
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

    const handleSsrApi = async () => {
        const result = await ssrApiHandler();

        if (result) {
            console.log('SSR API Response:', result);
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
            localStorage.setItem('ssrApiData', JSON.stringify(data));
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
            if (parsedData.Baggage && parsedData.Baggage[0]) {
                return parsedData.Baggage[0]; // Assuming the first element is what you want
            }
        }
        console.log('No SSR API data found in localStorage');
        return [];
    };

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

  

    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

   



    const handleSeatClick = (seat) => {
        const isAlreadySelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);

        let updatedSeats;

        if (isAlreadySelected) {
            updatedSeats = selectedSeats.filter(s => s.seatNumber !== seat.seatNumber);
        } else {
            updatedSeats = [...selectedSeats, seat];
        }

        setSelectedSeats(updatedSeats);
        localStorage.setItem('flightSelectedSeats', JSON.stringify(updatedSeats));
    };


    useEffect(() => {
        localStorage.removeItem('flightSelectedSeats');
        setSelectedSeats([]);  
    }, []);

// -------------------------------------------------------------------------------------------------------------------------

    const renderSeatsTab = () => (
        <div className="seatsTabss">
            <h5>SELECT YOUR PREFERRED SEAT</h5>
    
            <div className="seaat-price">
                <h6>Selected Seats: ({selectedSeats.map(seat => seat.seatNumber).join(', ')})</h6>
                <h6>Total Price: (₹{calculateTotalPrice()})</h6>
            </div>
    
            <div className="row seatsTabssRow">
                <div className="col-lg-4 seatsTabssColImg">
                    <img
                        className="img-fluid"
                        src={FlightImg}
                        alt="Seats"
                    />
                </div>
                <div className="col-lg-8">
                    <div className="seatsTabssColText">
                        {seatData.length > 0 ? (
                            <div className="seat-selection row">
                                {seatData.map((seat, index) => (
                                    <div key={index} className="col-md-2 col-3 unkown">
                                        <button
                                            className={`f-seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.find(s => s.seatNumber === seat.seatNumber) ? 'selected' : ''}`}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            <h6>{seat.seatNumber}</h6>
                                            <img
                                                className="img-fluid"
                                                src={FlightSeat}
                                                alt="Seat"
                                            />
                                            <p>₹{seat.price}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{color:"red"}}> Seat data is not available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
// -------------------------------------------------------------------------------------------------------------------------




    const [mealData, setMealData] = useState([]);


    useEffect(() => {
        const storedData = localStorage.getItem('ssrApiData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const mealDynamic = parsedData?.MealDynamic?.[0] || [];
            const formattedMealData = mealDynamic.map(meal => ({
                Name: meal.Description,
                Price: meal.Price
            }));
            setMealData(formattedMealData);
        }
    }, []);

    const handleMealClick = (meal) => {
        if (selectedMeal?.Name === meal.Name) {
            // Deselect if already selected
            setSelectedMeal(null);
            localStorage.removeItem('selectedMeal');
        } else {
            // Select the clicked meal
            setSelectedMeal(meal);
            localStorage.setItem('selectedMeal', JSON.stringify(meal));
        }
    };



    const renderMealsTab = () => (
        <div className="mealsTab">
            <h5>Select Your Meal Option</h5>
            {mealData.length > 0 ? (
                mealData.map((meal, index) => (
                    <div key={index} className="meal-selection">
                        <div className="row">
                            <div className="col-md-6">
                                <p>{meal.Name}</p>
                                <h6>₹{meal.Price}</h6>
                            </div>
                            <div className="col-md-6 meal-selectionbtn">
                                <div>
                                    <button
                                        className={selectedMeal?.Name === meal.Name ? 'btn-added' : 'btn-add'}
                                        onClick={() => handleMealClick(meal)}
                                    >
                                        {selectedMeal?.Name === meal.Name ? '✓ Added' : '+ Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: "red" }}>No meal data found</p>
            )}
        </div>
    );
    

    const handleBaggageClick = (baggage) => {
        // Toggle the baggage selection
        if (selectedBaggage?.Weight === baggage.Weight) {
            setSelectedBaggage(null); 
            localStorage.removeItem('selectedBaggage'); 
        } else {
            setSelectedBaggage(baggage); // Select the clicked baggage
            localStorage.setItem('selectedBaggage', JSON.stringify(baggage)); 
        }
    };
    



    const renderBaggageTab = () => {
        const baggageData = getSsrApiData();
    
        return (
            <div className="baggageTab">
                <h5>Select Your Baggage Option</h5>
                {baggageData.length > 0 ? (
                    baggageData.map((baggage, index) => (
                        <div key={index} className="baggage-selection">
                            <div className="row">
                                <div className="col-md-6">
                                    <p>{baggage.Weight} kg</p>
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
                    ))
                ) : (
                    <p style={{color:"red"}}> Baggage data is not available.</p>
                )}
            </div>
        );
    };
    


    return (
        <>
            <CustomNavbar />
            {/* <div className="timer-FlightLists">
                <div>
                    <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p>
                </div>
            </div> */}

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

{/* ------------------------------------------ */}

                        <div className="f-fare row mt-3">
                            <div className="col-md-3">
                                <p>Seat: ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0).toFixed(2)}</p>
                            </div>
                            <div className="col-md-3">
                                <p>Meal: ₹{mealPrice.toFixed(2)}</p>
                            </div>
                            <div className="col-md-3">
                                <p>Baggage: ₹{selectedBaggage?.Price || '0'}</p>
                            </div>
                            <div className="col-md-3">
                                <p style={{fontWeight:"500"}}>Total Price (Seat, Meal, Baggage): ₹{finalTotalPrice.toFixed(2)}</p>
                            </div>
                            <div>
                            <div className="meal-last">
                            <h5 className='totalPricee'>Total Fare : <span>₹{totalPrice.toFixed(2)}</span></h5>
                                <button onClick={reviewHandler}>Continue</button>
                            </div>
                            </div>
                        </div>

{/* --------------------------------------------------- */}

                        
                    </div>


                </div>


            </div>
            <Footer />
        </>
    );
};

export default SeatMealBaggageTabs;
