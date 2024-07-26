import "./FlightLists.css"
import "./FlightDetails.css"
import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';


export default function FlightDetails() {

    const location = useLocation();
    const fareDataDetails = location.state?.fareData;
    console.log("fareDataDetails", fareDataDetails)



    const [activeTabFlightDetails, setActiveTabFlightDetails] = useState('flight');

    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [formDetails, setFormDetails] = useState([]);
    const [error, setError] = useState('');
    const [showTabs, setShowTabs] = useState(false);
    const [activeTab, setActiveTab] = useState('Seats');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMobileNumberChange = (e) => {
        setMobileNumber(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
        setError('');
    };
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        if (gender && firstName && lastName) {
            const newDetail = { gender, firstName, lastName, selected: false };
            setFormDetails([newDetail]);
            setGender('');
            setFirstName('');
            setLastName('');
            setError('');
        } else {
            setError('Please fill out all fields.');
        }
    };

    const handleDelete = () => {
        setFormDetails([]);
    };

    const toggleSelect = (index) => {
        setFormDetails(
            formDetails.map((detail, i) =>
                i === index ? { ...detail, selected: !detail.selected } : detail
            )
        );
    };

    const renderContent = () => {
        switch (activeTabFlightDetails) {
            case 'flight':
                return <div>
                    <div className="row flighttTabContent">
                        <div className="col-md-3 col-sm-6 flighttTabContentCol1">
                            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />
                            <p>Indigo Air</p>
                        </div>
                        <div className="col-md-3 col-sm-6 flighttTabContentCol2">
                            <p className="flighttTabContentCol2p1">Mumbai</p>
                            <h5>00:25</h5>
                            <p className="flighttTabContentCol2p2">Tue,July23</p>
                            <p className="flighttTabContentCol2p3">Chhatrapati Shivaji International Airport</p>
                        </div>
                        <div className="col-md-3 col-sm-6 flighttTabContentCol3">
                            <p>02h 10m</p>
                            <p>Economy</p>
                        </div>
                        <div className="col-md-3 col-sm-6 flighttTabContentCol4">
                            <p className="flighttTabContentCol2p1">New Delhi</p>
                            <h5>22:15</h5>
                            <p className="flighttTabContentCol2p2">Tue,July23</p>
                            <p className="flighttTabContentCol2p3">Indira Gandhi International Airport</p>
                        </div>

                    </div>
                </div>;
            case 'baggage':
                return <div>
                    <div className="row mt-4 mb-4 baggageTabRow">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Airline</th>
                                        <th scope="col">Passenger</th>
                                        <th scope="col">Check-in Baggage</th>
                                        <th scope="col">Cabin Baggage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Airline 1</td>
                                        <td>Adult</td>
                                        <td>01 Bag of 15 kg</td>
                                        <td>7 kg</td>
                                    </tr>

                                </tbody>
                            </table>
                            <p>The baggage information is just for reference. Please Check with airline before check-in. For more information, visit Website.</p>
                        </div>
                    </div>

                </div>;
            case 'fare':
                return <div>
                    <div className="row mt-4 mb-4 fareTabRow">
                        <div className="col-12">
                            <table className="table fare-bordered-table">
                                <thead>
                                    <tr>
                                        <td scope="col">Traveller</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Base Fare</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Taxes</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Total Fare</td>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 Adult</td>
                                        <td style={{ textAlign: 'end' }}>₹3665</td>
                                        <td style={{ textAlign: 'end' }}>₹551</td>
                                        <td style={{ textAlign: 'end' }}>₹4216</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ textAlign: 'end' }}>₹4216</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>;
            case 'cancellation':
                return <div>
                    <div className="row cancellationTabRow">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-sm-6 cancellationtable">
                                    <h6>Cancellation Charges</h6>
                                    <table className="table fare-bordered-table">
                                        <thead>
                                            <tr>
                                                <td scope="col">Before 4 hours Departure</td>
                                                <td scope="col">As per airlines policy</td>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Agency Fee</td>
                                                <td>₹500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-sm-6 cancellationtable">
                                    <h6>Reschedule Charges</h6>
                                    <table className="table fare-bordered-table">
                                        <thead>
                                            <tr>
                                                <td scope="col">Before 4 hours Departure</td>
                                                <td scope="col">As per airlines policy</td>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Agency Fee</td>
                                                <td>₹500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 'bold' }}>Terms & Conditions</h6>
                                <ul>
                                    <li>
                                        The charges will be on per passenger per sector
                                    </li>
                                    <li>
                                        Rescheduling Charges = Rescheduling/Change Penalty + Fare Difference (if applicable)
                                    </li>
                                    <li>
                                        Partial cancellation is not allowed on the flight tickets which are book under special discounted fares
                                    </li>
                                    <li>
                                        In case, the customer have not cancelled the ticket within the stipulated time or no show then only statutory taxes are refundable from the respective airlines For infants there is no baggage allowance
                                    </li>
                                    <li>
                                        In certain situations of restricted cases, no amendments and cancellation is allowed
                                    </li>
                                    <li>
                                        Penalty from airlines needs to be reconfirmed before any cancellation or amendments
                                    </li>
                                    <li>
                                        Penalty changes in airline are indicative and can be changed without any prior notice
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>;
            default:
                return <div>Flight Information</div>;
        }
    }


    // seats meals baggage tabs
    const renderSeatsTab = () => {
        return (
            <div className="seatsTabss">
                <h5>SELECT YOUR PREFERRED SEAT</h5>
                <div className="row seatsTabssRow">
                    <div className="col-lg-6 seatsTabssColImg">
                        <img
                            className="img-fluid"
                            src='/src/assets/images/flightseattss-removebg-preview.png'
                            alt="First slide"
                        />
                    </div>
                    <div className="col-lg-6 seatsTabssColText">
                        <div className="seat-selection">
                            {/* Example seats, you can customize the seats */}
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>
                            <button className="seat">
                                <img
                                    className="img-fluid"
                                    src='/src/assets/images/seat-2-removebg-preview.png'
                                    alt="First slide"
                                />
                                <h6>1A</h6>
                                <p>999</p>
                            </button>

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
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹290</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹300</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹300</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹300</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹435</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹450</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹450</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="meal-selection">
                    <div className="row">
                        <div className="col-md-4">
                            <p>2</p>
                            <h6>₹560</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input type="radio" id="vegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="vegMeal">Vegetarian Meal</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" id="nonVegMeal" name="meal" className="form-check-input" />
                                <label className="form-check-label" htmlFor="nonVegMeal">Non-Vegetarian Meal</label>
                            </div>
                        </div>
                        <div className="col-md-4 meal-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    const renderBaggageTab = () => {
        return (
            <div className="baggageTabbss">
                <h5>Select Your Baggage Option</h5>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>5 kg</p>
                            <h6>₹2250</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>10 kg</p>
                            <h6>₹4500</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>15 kg</p>
                            <h6>₹6750</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>20 kg</p>
                            <h6>₹9000</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>30 kg</p>
                            <h6>₹13500</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
                <div className="baggage-selection">
                <div className="row">
                        <div className="col-md-4">
                            <p>0 kg</p>
                            <h6>₹0</h6>
                        </div>
                        <div className="col-md-4">
                        <div className="form-check">
                        <input type="checkbox" id="carryOn" className="form-check-input" />
                        <label className="form-check-label" htmlFor="carryOn">Carry-On</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="checkedBag" className="form-check-input" />
                        <label className="form-check-label" htmlFor="checkedBag">Checked Bag</label>
                    </div>
                        </div>
                        <div className="col-md-4 baggagge-selectionbtn">
                            <div>
                            <button> + Add </button>
                            </div>
                        </div>
                    </div>


                    
                </div>
            </div>
        );
    };


    return (
        <>
            <section className='flightlistsec1'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <TiPlane className="mt-1" />
                            <p>New Delhi <span>(DEL) </span> </p>
                            <p>-</p>
                            <p>Banglore <span>(BLR)</span></p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaCalendarAlt className="mt-1" />
                            <p><span>Departure on Wed,</span> 17 July</p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaUser className="mt-1" />
                            <p>1 <span>Traveller , Economy</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flightDetailssec">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="fdetailspriceBox">
                                <p>You got the best price available!</p>
                                <div>
                                    <h6>Final Price</h6>
                                    <h5>₹630</h5>
                                </div>
                            </div>


                            <div className="row">
                                <div className="fligthReviewhed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Review Flight Details</h5>
                                </div>
                                <div className="col-12 ">
                                    <div className="fligthReviewBox">
                                        <div className="fligthReviewBoxHed">
                                            <div className="col-8 mt-3 fligthReviewBoxHedText">
                                                <MdOutlineFlightTakeoff />
                                                <h6>DEL - BOM</h6>
                                                <p>02h 10m</p>
                                            </div>
                                            <div className="col-4 fligthReviewBoxHedbttn">
                                                <button>Regular Deal</button>
                                            </div>
                                        </div>

                                        <div className="fligthReviewBoxHedMain">
                                            <div className="tabs">
                                                <button onClick={() => setActiveTabFlightDetails('flight')} className={activeTabFlightDetails === 'flight' ? 'active' : ''}>Flight</button>
                                                <button onClick={() => setActiveTabFlightDetails('baggage')} className={activeTabFlightDetails === 'baggage' ? 'active' : ''}>Baggage</button>
                                                <button onClick={() => setActiveTabFlightDetails('fare')} className={activeTabFlightDetails === 'fare' ? 'active' : ''}>Fare</button>
                                                <button onClick={() => setActiveTabFlightDetails('cancellation')} className={activeTabFlightDetails === 'cancellation' ? 'active' : ''}>Cancellation</button>
                                            </div>
                                            <div className="tab-content">
                                                {renderContent()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="fligthContactDethed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Contact Details</h5>
                                </div>
                                <div className="col-12">
                                    <div className="fligthContactDethedBox">
                                        <form>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email:</label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            className="form-control"
                                                            value={email}
                                                            onChange={handleEmailChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="mobileNumber">Mobile Number:</label>
                                                        <input
                                                            type="tel"
                                                            id="mobileNumber"
                                                            className="form-control"
                                                            value={mobileNumber}
                                                            onChange={handleMobileNumberChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <p> Your booking details will be sent to this email address and mobile number.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="fligthTravellerDethed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Enter Traveller Details</h5>
                                </div>
                                <div className="col-12">
                                    <div className="fligthTravellerDethedBox">
                                        <form>
                                            <h5>Adult 1</h5>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-6">
                                                    <label>Gender:</label>
                                                    <div className="form-group genderFormGrp">
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                type="radio"
                                                                id="male"
                                                                name="gender"
                                                                value="male"
                                                                className="form-check-input"
                                                                onChange={handleGenderChange}
                                                                required
                                                                checked={gender === 'male'}
                                                            />
                                                            <label className="form-check-label" htmlFor="male">Male</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                type="radio"
                                                                id="female"
                                                                name="gender"
                                                                value="female"
                                                                className="form-check-input"
                                                                onChange={handleGenderChange}
                                                                required
                                                                checked={gender === 'female'}
                                                            />
                                                            <label className="form-check-label" htmlFor="female">Female</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="firstName">First Name</label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            className="form-control"
                                                            onChange={handleFirstNameChange}
                                                            value={firstName}
                                                            required
                                                            placeholder="First & Middle Name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="lastName">Last Name</label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            className="form-control"
                                                            onChange={handleLastNameChange}
                                                            value={lastName}
                                                            required
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-md-6">
                                                    <div className="form-group formConfbtn">
                                                        <button className="btn btn-primary mt-4" onClick={handleConfirm}>
                                                            Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {error && <div className="text-danger mt-2">{error}</div>}

                                            {formDetails.length > 0 && (
                                                <div className="mt-4 col-md-6 formdettlsDesk">
                                                    {formDetails.map((detail, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-2">
                                                            <div className="flex-grow-1 formdettlsDeskdiv ml-2">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input selectDetInp"
                                                                    checked={detail.selected}
                                                                    onChange={() => toggleSelect(index)}
                                                                />
                                                                <div className="formdettlsDeskdivnmGen">
                                                                    <div>
                                                                        <strong>Gender:</strong> <span>{detail.gender}</span>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Name:</strong> <span>{detail.firstName} {detail.lastName}</span>
                                                                    </div>

                                                                </div>
                                                                <div>
                                                                    <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete()} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="col-md-4 mt-4">
                                                <div className="selectSeatMealDivBtn" onClick={() => setShowTabs(!showTabs)}>
                                                    Add Seats, Meals, Baggage & more
                                                </div>
                                            </div>

                                            {showTabs && (
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
                                            )}


                                            <div className="col-12 lastBtnssContinue">
                                                <h5>Fare Breakup <span>₹13465</span></h5>
                                                <button >Continue</button>
                                            </div>
                                        </form>



                                    </div>
                                </div>

                            </div>
                        

                        </div>
                        <div className="col-lg-3 fligthPriceDetailsss">
                        <div className="row">
                                <div className="fligthReviewhed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Price Details</h5>
                                </div>
                                <div className="col-12">
                                    <div className="fligthPriceDetailsBox">
                                        <div className="fligthPriceDetailsBoxDiv1">
                                            <p>Base Fare</p>
                                            <p>0</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv2">
                                            <p>Taxes</p>
                                            <p>0</p>
                                        </div>
                                        <hr></hr>
                                        <div className="fligthPriceDetailsBoxDiv3">
                                            <h6>Total Fare</h6>
                                            <p>₹0</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv4">
                                            <h6>Insurance (All Traveller)</h6>
                                            <p>₹249</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv5">
                                            <h6>Sub Total</h6>
                                            <p>₹249</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv6">
                                            <h6>Coupon Applied</h6>
                                            <p>₹100 OFF</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv7">
                                            <h5>You Pay</h5>
                                            <p>₹149</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv8">
                                            <img src="/src/assets/images/Low-Price-Guarantee-Offer.gif" className="img-fluid" />
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
