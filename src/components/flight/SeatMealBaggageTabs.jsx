import React, { useState, useEffect } from 'react';
import "./FlightDetails.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import "./SeatMealBaggage.css";

const SeatMealBaggageTabs = () => {
    const location = useLocation();
    const { fareDataDetails } = location.state || {};
    const navigate = useNavigate();
    const [seatData, setSeatData] = useState([]);
    const [activeTab, setActiveTab] = useState('Seats');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBaggage, setSelectedBaggage] = useState(null);
    const [timer, setTimer] = useState(600000);


    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve the base fare from local storage
        const savedFare = localStorage.getItem('selectedFlightBaseFare');

        // Set the totalFare state, converting it to a number
        if (savedFare) {
            setTotalPrice(parseFloat(savedFare));
        }
    }, []);

    const seatPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const mealPrice = 0; // Replace with actual meal price logic if applicable
    const baggagePrice = selectedBaggage?.Price || 0;

    // Calculate the final total price
    const finalTotalPrice = seatPrice + mealPrice + baggagePrice;

    // Save the final total price to local storage
    localStorage.setItem('finalTotalPrice', finalTotalPrice.toFixed(2));



    const ssrData = [
        { Weight: 15, Price: 100, AirlineCode: "SG", FlightNumber: "8269", WayType: 1, Code: "BOF1SeKey276", Currency: "INR", Description: "Bag Out First with 1 Bag", Destination: "BOM", Origin: "DEL" },
        { Weight: 20, Price: 200, AirlineCode: "SG", FlightNumber: "8269", WayType: 1, Code: "BOF2SeKey276", Currency: "INR", Description: "Bag Out First with 2 Bag", Destination: "BOM", Origin: "DEL" }
    ];

    const formData = {
        AdultCount: 1,
        ChildCount: 0,
        InfantCount: 0
    };

    const totalCount = formData.AdultCount + formData.ChildCount + formData.InfantCount;

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

    useEffect(() => {
        const savedBaggage = JSON.parse(localStorage.getItem('selectedBaggage')) || null;
        setSelectedBaggage(savedBaggage);
    }, []);

    const formatTimers = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec left`;
    };

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

    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    const handleBaggageClick = (baggage) => {
        setSelectedBaggage(baggage);
        localStorage.setItem('selectedBaggage', JSON.stringify(baggage));
    };






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



    const [mealData, setMealData] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);


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
        setSelectedMeal(meal);
    };


    const renderMealsTab = () => (
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
    );




    const renderBaggageTab = () => {
        const baggageData = getSsrApiData();

        return (
            <div className="baggageTab">
                <h5>Select Your Baggage Option</h5>
                {baggageData.map((baggage, index) => (
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
                ))}


                <div className="meal-last">
                    <button onClick={reviewHandler}>Continue</button>
                </div>



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
                        <div className="f-fare">
                            <p>Seat: ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0).toFixed(2)}</p>
                            <p>Meal:</p>
                            <p>Baggage: ₹{selectedBaggage?.Price || '0'}</p>
                            <p>Total Price (Seat, Meal, Baggage): ₹{finalTotalPrice.toFixed(2)}</p>
                            <h5 className='totalPricee'>Total Fare : <span>₹{totalPrice.toFixed(2)}</span></h5>
                        </div>
                    </div>


                </div>


            </div>
            <Footer />
        </>
    );
};

export default SeatMealBaggageTabs;
