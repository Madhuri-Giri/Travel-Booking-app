import "./FlightLists.css"
import "./FlightDetails.css"
import React from 'react'
import { useEffect, useRef, useState, } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { RiTimerLine } from "react-icons/ri";
// import TimerFlight from '../timmer/TimerFlight';

export default function FlightDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Add loading state

    //   ----------------------------------------------------
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve the base fare from local storage
        const savedFare = localStorage.getItem('selectedFlightBaseFare');

        // Set the totalFare state, converting it to a number
        if (savedFare) {
            setTotalPrice(parseFloat(savedFare));
        }
    }, []);

    const location = useLocation();
    const fareData = location.state?.fareData;
    const formData = location.state?.formData;

    const [fareDataDetails, setFareDataDetails] = useState(fareData);
    // console.log("fareDataDetails", fareDataDetails);

    // function for date convert into day month date--------------------------------------
    const convertformatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { day: 'numeric', weekday: 'long', month: 'long' }).format(date);
    };

    const departDatee = formData.Segments[0].PreferredDepartureTime;
    const convertformattedDate = convertformatDate(departDatee);
    // console.log("Formatted Date:", convertformattedDate);
    // function for date convert into day month date--------------------------------------

    // func for duration convert hpur minute---------------------
    const convertMinutesToHoursAndMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };
    // func for duration convert hpur minute---------------------

    useEffect(() => {
        if (fareData) {
            setFareDataDetails(fareData);
            localStorage.setItem('fareDataDetails', JSON.stringify(fareData));
        } else {
            const savedFareData = localStorage.getItem('fareDataDetails');
            if (savedFareData) {
                setFareDataDetails(JSON.parse(savedFareData));
            }
        }
    }, [fareData]);

    useEffect(() => {
        if (!fareDataDetails) {
            console.error('fareDataDetails is undefined');
        }
    }, [fareDataDetails]);


    const segment = fareDataDetails.Segments[0][0];
    // console.log("segment", segment);

    const origin = segment.Origin;
    const destination = segment.Destination;
    const airline = segment.Airline;
    const depTime = new Date(segment.DepTime);
    const arrTime = new Date(segment.ArrTime);
    const fare = fareDataDetails.Fare; // Get the fare data
    const baseFare = fare.BaseFare;
    const tax = fare.Tax;
    const totalFare = baseFare + tax;

    const formatTime = (date) => {
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    };

    const formatDate = (date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };


    const reviewHandler = () => {
        // Ensure fareDataDetails is defined before navigating
        if (fareDataDetails) {
            console.log('Navigating to flight-review with fareDataDetails:', fareDataDetails); // Debugging log
            setLoading(true);
            setTimeout(() => {
                navigate('/flight-review', { state: { fareDataDetails } });
            }, 1000);
        } else {
            console.error('fareDataDetails is undefined');
            alert('Error: fareDataDetails is not available.');
        }
    };



    const toggleSelect = (index, type) => {
        if (type === 'adult') {
            const updatedDetails = confirmedAdultDetails.map((detail, i) =>
                i === index ? { ...detail, selected: !detail.selected } : detail
            );
            setConfirmedAdultDetails(updatedDetails);
            console.log("adultPassengerDetails", updatedDetails);
            localStorage.setItem('adultPassengerDetails', JSON.stringify(updatedDetails));


        } else if (type === 'child') {
            const updatedDetails = confirmedChildDetails.map((detail, i) =>
                i === index ? { ...detail, selected: !detail.selected } : detail
            );
            setConfirmedChildDetails(updatedDetails);
            console.log("childPassengerDetails", updatedDetails);
            localStorage.setItem('childPassengerDetails', JSON.stringify(updatedDetails));

        } else if (type === 'infant') {
            const updatedDetails = confirmedInfantDetails.map((detail, i) =>
                i === index ? { ...detail, selected: !detail.selected } : detail
            );
            setConfirmedInfantDetails(updatedDetails);
            console.log("infantPassengerDetails", updatedDetails);
            localStorage.setItem('infantPassengerDetails', JSON.stringify(updatedDetails));
        }
        checkButtonDisabled();
    };


    // ----------------------logic for total traveller forms---------------------------------------
    const [activeTabFlightDetails, setActiveTabFlightDetails] = useState('flight');
    const [showTabs, setShowTabs] = useState(false);
    const [adultCount, setAdultCount] = useState(formData.AdultCount);
    const [childCount, setChildCount] = useState(formData.ChildCount);
    const [infantCount, setInfantCount] = useState(formData.InfantCount);
    const initialDetail = {
        gender: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNo: '',
        passportExpiry: '',
        passportIssueDate: '',
        addressLine1: '',
        city: '',
        countryCode: '',
        countryName: '',
        contactNo: '',
        email: ''
    };
    const [adultDetails, setAdultDetails] = useState(Array(adultCount).fill(initialDetail));
    const [childDetails, setChildDetails] = useState(Array(childCount).fill(initialDetail));
    const [infantDetails, setInfantDetails] = useState(Array(infantCount).fill(initialDetail));
    const [confirmedAdultDetails, setConfirmedAdultDetails] = useState([]);
    const [confirmedChildDetails, setConfirmedChildDetails] = useState([]);
    const [confirmedInfantDetails, setConfirmedInfantDetails] = useState([]);
    const [error, setError] = useState('');

    const [isContinueDisabled, setIsContinueDisabled] = useState(true);

    const checkButtonDisabled = () => {
        const allAdultsConfirmed = confirmedAdultDetails.every(detail => detail.selected);
        const allChildrenConfirmed = confirmedChildDetails.every(detail => detail.selected);
        const allInfantsConfirmed = confirmedInfantDetails.every(detail => detail.selected);

        // Set the button disabled state based on the confirmation status of all details
        setIsContinueDisabled(!(allAdultsConfirmed && allChildrenConfirmed && allInfantsConfirmed));
    };

    // Use useEffect to call checkButtonDisabled whenever confirmed details change
    useEffect(() => {
        checkButtonDisabled();
    }, [confirmedAdultDetails, confirmedChildDetails, confirmedInfantDetails]);

    const handleInputChange = (e, index, type, field) => {
        const { value } = e.target;
        let details;

        if (type === 'adult') {
            details = [...adultDetails];
        } else if (type === 'child') {
            details = [...childDetails];
        } else if (type === 'infant') {
            details = [...infantDetails];
        }

        details[index] = {
            ...details[index],
            [field]: value
        };

        if (type === 'adult') {
            setAdultDetails(details);
        } else if (type === 'child') {
            setChildDetails(details);
        } else if (type === 'infant') {
            setInfantDetails(details);
        }
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const dob = new Date(dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const handleConfirm = (e, index, type) => {
        e.preventDefault();
    
        // Select the correct details array based on the type
        let details = type === 'adult' ? [...adultDetails] : type === 'child' ? [...childDetails] : [...infantDetails];
    
        // Define the fields and their labels for validation
        const fieldsToCheck = {
            gender: 'Gender',
            firstName: 'First Name',
            lastName: 'Last Name',
            dateOfBirth: 'Date of Birth',
            addressLine1: 'Address Line 1',
            city: 'City',
            contactNo: 'Contact No',
            email: 'Email',
            // Passport No, Passport Expiry, Passport Issue Date, Country Code are not validated
        };
    
        // Initialize errors for the current detail at the specified index
        let newErrors = {};
        Object.keys(fieldsToCheck).forEach(field => {
            if (!details[index][field]) {
                newErrors[field] = `${fieldsToCheck[field]} is required.`;
            }
        });
    
        // Perform age validation
        const age = calculateAge(details[index].dateOfBirth);
    
        if (type === 'adult' && age < 18) {
            newErrors.dateOfBirth = 'Adult age must be 18 years or older.';
        } else if (type === 'child' && (age < 0 || age > 17)) {
            newErrors.dateOfBirth = 'Child age must be between 0 and 17 years.';
        } else if (type === 'infant' && (age < 0 || age > 2)) {
            newErrors.dateOfBirth = 'Infant age must be between 0 and 2 years.';
        }
    
        // Check if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            // Update the error state with new errors for this type and index
            setErrors(prevErrors => ({
                ...prevErrors,
                [type]: {
                    ...prevErrors[type],
                    [index]: newErrors
                }
            }));
        } else {
            // Clear errors if all fields are valid
            setErrors(prevErrors => ({
                ...prevErrors,
                [type]: {
                    ...prevErrors[type],
                    [index]: {}
                }
            }));
    
            // Add the confirmed detail to the appropriate confirmed details array
            const newDetail = { ...details[index], selected: true };
    
            if (type === 'adult') {
                const updatedAdults = [...confirmedAdultDetails, newDetail];
                setConfirmedAdultDetails(updatedAdults);
                localStorage.setItem('adultPassengerDetails', JSON.stringify(updatedAdults)); // Save to local storage
            } else if (type === 'child') {
                const updatedChildren = [...confirmedChildDetails, newDetail];
                setConfirmedChildDetails(updatedChildren);
                localStorage.setItem('childPassengerDetails', JSON.stringify(updatedChildren)); // Save to local storage
            } else if (type === 'infant') {
                const updatedInfants = [...confirmedInfantDetails, newDetail];
                setConfirmedInfantDetails(updatedInfants);
                localStorage.setItem('infantPassengerDetails', JSON.stringify(updatedInfants)); // Save to local storage
            }
    
            // Clear form fields after confirmation
            resetFormFields(type);
    
            // Check and update the button disabled state if needed
            checkButtonDisabled();
        }
    };
    
    // Function to reset form fields after confirmation
    const resetFormFields = (type) => {
        if (type === 'adult') {
            setAdultDetails(prevDetails => prevDetails.map(detail => ({
                gender: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                passportNo: '',
                passportExpiry: '',
                passportIssueDate: '',
                addressLine1: '',
                city: '',
                countryCode: '',
                countryName: '',
                contactNo: '',
                email: '',
            })));
        } else if (type === 'child') {
            setChildDetails(prevDetails => prevDetails.map(detail => ({
                gender: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                passportNo: '',
                passportExpiry: '',
                passportIssueDate: '',
                addressLine1: '',
                city: '',
                countryCode: '',
                countryName: '',
                contactNo: '',
                email: '',
            })));
        } else if (type === 'infant') {
            setInfantDetails(prevDetails => prevDetails.map(detail => ({
                gender: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                passportNo: '',
                passportExpiry: '',
                passportIssueDate: '',
                addressLine1: '',
                city: '',
                countryCode: '',
                countryName: '',
                contactNo: '',
                email: '',
            })));
        }
    };
    const handleDelete = (type, index) => {
        if (type === 'adult') {
            setConfirmedAdultDetails(confirmedAdultDetails.filter((_, i) => i !== index));
        } else if (type === 'child') {
            setConfirmedChildDetails(confirmedChildDetails.filter((_, i) => i !== index));
        } else if (type === 'infant') {
            setConfirmedInfantDetails(confirmedInfantDetails.filter((_, i) => i !== index));
        }
        checkButtonDisabled();
    };

    const renderConfirmedDetails = (details, type) => (
        <div className="row">
            <div className="mt-4 col-md-12 formdettlsDesk" style={{ display: details.length > 0 ? 'block' : 'none' }}>
                {details.map((detail, index) => (
                    <div key={index} className="d-flex align-items-start mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input selectDetInp"
                            checked={detail.selected}
                            onChange={() => toggleSelect(index, type)}
                            style={{ marginTop: '10px' }}
                        />
                        <div className="flex-grow-1 formdettlsDeskdiv ml-2">
                            <div className="formdettlsDeskdivnmGen">
                                <div><strong>Gender:</strong> <span>{detail.gender}</span></div>
                                <div><strong>Name:</strong> <span>{detail.firstName} {detail.lastName}</span></div>
                                <div><strong>Date of Birth:</strong> <span>{detail.dateOfBirth}</span></div>
                            </div>
                            <div className="mt-2">
                                <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete(type, index)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // State for handling errors
    const [errors, setErrors] = useState({
        adult: [],
        child: [],
        infant: [],
    });

    const renderFormFields = (count, type) => {
        const details = type === 'adult' ? adultDetails : type === 'child' ? childDetails : infantDetails;

        return Array.from({ length: count }, (_, index) => {
            const fieldErrors = errors[type]?.[index] || {};

            return (
                <div key={`${type}-${index}`} className="row userFormFill">
                    <div className="col-12">
                        <label>Gender: <span className="text-danger">*</span> </label>
                        <div className="form-group genderFormGrp">
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    id={`${type}-male-${index}`}
                                    name={`gender-${type}-${index}`}
                                    value="male"
                                    className="form-check-input"
                                    onChange={(e) => handleInputChange(e, index, type, 'gender')}
                                />
                                <label className="form-check-label" htmlFor={`${type}-male-${index}`}>Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    id={`${type}-female-${index}`}
                                    name={`gender-${type}-${index}`}
                                    value="female"
                                    className="form-check-input"
                                    onChange={(e) => handleInputChange(e, index, type, 'gender')}
                                />
                                <label className="form-check-label" htmlFor={`${type}-female-${index}`}>Female</label>
                            </div>
                            {fieldErrors.gender && <div className="text-danger">{fieldErrors.gender}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`firstName-${type}-${index}`}>First Name <span className="text-danger">*</span> </label>
                            <input
                                type="text"
                                id={`firstName-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'firstName')}
                                value={details[index]?.firstName || ''}
                                placeholder="First & Middle Name"
                            />
                            {fieldErrors.firstName && <div className="text-danger">{fieldErrors.firstName}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`lastName-${type}-${index}`}>Last Name <span className="text-danger">*</span> </label>
                            <input
                                type="text"
                                id={`lastName-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'lastName')}
                                value={details[index]?.lastName || ''}
                                placeholder="Last Name"
                            />
                            {fieldErrors.lastName && <div className="text-danger">{fieldErrors.lastName}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`dateOfBirth-${type}-${index}`}>Date of Birth <span className="text-danger">*</span> </label>
                            <DatePicker
                                id={`dateOfBirth-${type}-${index}`}
                                selected={details[index]?.dateOfBirth ? new Date(details[index]?.dateOfBirth) : null}
                                onChange={(date) => handleInputChange({ target: { value: date.toISOString().split('T')[0] } }, index, type, 'dateOfBirth')}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                maxDate={new Date()} // Prevent future dates
                                placeholderText="Select Date of Birth"
                            />
                            {fieldErrors.dateOfBirth && <div className="text-danger">{fieldErrors.dateOfBirth}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`passportNo-${type}-${index}`}>Passport No (Optional)</label>
                            <input
                                type="text"
                                id={`passportNo-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'passportNo')}
                                value={details[index]?.passportNo || ''}
                                placeholder="Passport No " // Updated placeholder
                            />
                            {fieldErrors.passportNo && <div className="text-danger">{fieldErrors.passportNo}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`passportExpiry-${type}-${index}`}>PassportExpiry      (Optional)</label>
                            <DatePicker
                                id={`passportExpiry-${type}-${index}`}
                                selected={details[index]?.passportExpiry ? new Date(details[index]?.passportExpiry) : null}
                                onChange={(date) => handleInputChange({ target: { value: date ? date.toISOString().split('T')[0] : '' } }, index, type, 'passportExpiry')}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                minDate={new Date()} // Optional: set minimum date to today
                                placeholderText="Select Passport Expiry Date"
                            />
                            {fieldErrors.passportExpiry && <div className="text-danger">{fieldErrors.passportExpiry}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`passportIssueDate-${type}-${index}`}>Passport Issue (Optional)</label>
                            <DatePicker
                                id={`passportIssueDate-${type}-${index}`}
                                selected={details[index]?.passportIssueDate ? new Date(details[index]?.passportIssueDate) : null}
                                onChange={(date) => handleInputChange({ target: { value: date ? date.toISOString().split('T')[0] : '' } }, index, type, 'passportIssueDate')}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                maxDate={new Date()} // Prevent future dates
                                placeholderText="Select Passport Issue Date"
                            />
                            {fieldErrors.passportIssueDate && <div className="text-danger">{fieldErrors.passportIssueDate}</div>}
                        </div>
                    </div>


                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`addressLine1-${type}-${index}`}>Address Line 1 <span className="text-danger">*</span> </label>
                            <input
                                type="text"
                                id={`addressLine1-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'addressLine1')}
                                value={details[index]?.addressLine1 || ''}
                                placeholder="Address Line 1"
                            />
                            {fieldErrors.addressLine1 && <div className="text-danger">{fieldErrors.addressLine1}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`city-${type}-${index}`}>City <span className="text-danger">*</span> </label>
                            <input
                                type="text"
                                id={`city-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'city')}
                                value={details[index]?.city || ''}
                                placeholder="City"
                            />
                            {fieldErrors.city && <div className="text-danger">{fieldErrors.city}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`countryCode-${type}-${index}`}>Country Code (Optional) </label>
                            <input
                                type="text"
                                id={`countryCode-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'countryCode')}
                                value={details[index]?.countryCode || ''}
                                placeholder="Country Code "
                            />
                            {fieldErrors.countryCode && <div className="text-danger">{fieldErrors.countryCode}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`countryName-${type}-${index}`}>Country Name (Optional) </label>
                            <input
                                type="text"
                                id={`countryName-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'countryName')}
                                value={details[index]?.countryName || ''}
                                placeholder="Country Name"
                            />
                            {fieldErrors.countryName && <div className="text-danger">{fieldErrors.countryName}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`contactNo-${type}-${index}`}>Contact No <span className="text-danger">*</span> </label>
                            <input
                                type="text"
                                id={`contactNo-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'contactNo')}
                                value={details[index]?.contactNo || ''}
                                placeholder="Contact No"
                            />
                            {fieldErrors.contactNo && <div className="text-danger">{fieldErrors.contactNo}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor={`email-${type}-${index}`}>Email <span className="text-danger">*</span> </label>
                            <input
                                type="email"
                                id={`email-${type}-${index}`}
                                className="form-control"
                                onChange={(e) => handleInputChange(e, index, type, 'email')}
                                value={details[index]?.email || ''}
                                placeholder="Email"
                            />
                            {fieldErrors.email && <div className="text-danger">{fieldErrors.email}</div>}
                        </div>
                    </div>
                    <div className="form-group formConfbtn">
                        <button className="btn btn-primary mt-4" onClick={(e) => handleConfirm(e, index, type)}>
                            Confirm
                        </button>
                    </div>
                </div>
            );
        });
    };


    // Other parts of the code remain unchanged



    // ----------------------logic for total traveller forms---------------------------------------


    // flight review details tabs--------------------------------------------------------
    const renderContent = () => {
        switch (activeTabFlightDetails) {
            case 'flight':
                return <div>
                    <div className="row flighttTabContent">
                        <div className="col-md-2 col-2 flighttTabContentCol1">
                            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />
                            <p>{airline.AirlineName}</p>
                        </div>
                        <div className="col-md-4 col-3 flighttTabContentCol2">
                            <div>
                                <p className="flighttTabContentCol2p1">{origin.CityName}</p>
                                <h5>{formatTime(depTime)}</h5>
                                <p className="flighttTabContentCol2p2">{formatDate(depTime)}</p>
                                <p className="flighttTabContentCol2p3">{origin.AirportName}</p>
                            </div>
                        </div>
                        <div className="col-md-1 col-3 flighttTabContentCol3">
                            <p className="flighttTabContentCol3p1">{convertMinutesToHoursAndMinutes(segment.Duration)}</p>
                            <p className="flighttTabContentCol3p2">{segment.CabinClassName}</p>
                        </div>
                        <div className="col-md-5 col-4 flighttTabContentCol4">
                            <div>
                                <p className="flighttTabContentCol2p1">{destination.CityName}</p>
                                <h5>{formatTime(arrTime)}</h5>
                                <p className="flighttTabContentCol2p2">{formatDate(arrTime)}</p>
                                <p className="flighttTabContentCol2p3">{destination.AirportName}</p>
                            </div>
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
                                        <td>{airline.AirlineCode}</td>
                                        <td>Adult</td>
                                        <td>{segment.Baggage}</td>
                                        <td>{segment.CabinBaggage}</td>
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
                                        <td style={{ textAlign: 'end' }}>₹{baseFare.toFixed(2)}</td>
                                        <td style={{ textAlign: 'end' }}>₹{tax.toFixed(2)}</td>
                                        <td style={{ textAlign: 'end' }}>₹{totalFare.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ textAlign: 'end' }}>₹{totalFare.toFixed(2)}</td>
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
    // flight review details tabs--------------------------------------------------------


    // func for seat meal , baggage checkbox----------------------------------
    const handleCheckboxChange = () => {
        setShowTabs(!showTabs);
    };
    // func for seat meal , baggage checkbox----------------------------------

    // seat meal checkbox is selected continue buton goto seat meal tab page ---------------------
    // but seat meal is not selected only traveller form selected then goto review page-------------------------------
    const handleButtonClick = () => {
        if (showTabs) {
            setLoading(true);
            setTimeout(() => {
                navigate('/seat-meal-baggage', { state: { fareDataDetails } });
            }, 1000);
        } else {
            reviewHandler();
        }
    };
    //if seat meal checkbox is selected continue buton goto seat meal tab page ---------------------
    // else seat meal is not selected only traveller form selected then goto review page-------------------------------



    // for timerss----------------------------------
    //     const [timer, setTimer] = useState(0);
    //   useEffect(() => {
    //     const updateTimer = () => {
    //       const endTime = localStorage.getItem('F-timerEndTime');
    //       const now = Date.now();

    //       if (endTime) {
    //         const remainingTime = endTime - now;

    //         if (remainingTime <= 0) {
    //           localStorage.removeItem('F-timerEndTime');
    //           navigate('/flight-search');
    //         } else {
    //           setTimer(remainingTime);
    //         }
    //       } else {
    //         navigate('/flight-search');
    //       }
    //     };

    //     updateTimer();

    //     const interval = setInterval(updateTimer, 1000); 

    //     return () => clearInterval(interval);
    //   }, [navigate]);
    //   const formatTimers = (milliseconds) => {
    //     const totalSeconds = Math.floor(milliseconds / 1000);
    //     const minutes = Math.floor(totalSeconds / 60);
    //     const seconds = totalSeconds % 60;
    //     return `${minutes} min ${seconds} sec left`;
    //   };

    // for timerss----------------------------------

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <CustomNavbar />
            {/* <TimerFlight/> */}


            {/* timerrr-------------------  */}
            {/* <div className="timer-FlightLists">
                <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
            </div> */}
            {/* timerrr-------------------  */}

            <section className='flightlistsec1'>
                <div className="container-fluid">
                    <div className="row flightlistsec1Row">
                        <div className="col-12 flightlistsec1MainCol">
                            <div className="d-flex flightlistsec1col">
                                <TiPlane className="mt-1" />
                                <p> {formData.Segments[0].Origin} </p>
                                <p>-</p>
                                <p>{formData.Segments[0].Destination} </p>
                            </div>
                            <div className="d-flex flightlistsec1col">
                                <FaCalendarAlt className="mt-1" />
                                <p><span>Departure on</span> {convertformattedDate}</p>
                            </div>
                            <div className="d-flex flightlistsec1col">
                                <FaUser className="mt-1" />
                                <p><span>Traveller {formData.AdultCount + formData.ChildCount + formData.InfantCount} , </span> <span>Economy</span></p>
                            </div>
                        </div>
                        {/* <div className="col-2 search-functinality">
                            <button onClick={navigateSearch}><i className="ri-pencil-fill"></i>Modify</button>
                        </div> */}
                    </div>
                </div>
            </section>

            <section className="flightDetailssec">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-9">
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
                                                <h6>{origin.CityName} - {destination.CityName}</h6>
                                                <p>{segment.Duration}m</p>
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
                                <div className="fligthTravellerDethed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Enter Traveller Details</h5>
                                </div>


                                <div className="col-12">
                                    <div className="fligthTravellerDethedBox">
                                        <form>
                                            <div className="row userFormFill">
                                                {adultCount > 0 && (
                                                    <>
                                                        <h5>Adults {adultCount}</h5>
                                                        <fieldset>
                                                            {renderFormFields(adultCount, 'adult')}
                                                            {renderConfirmedDetails(confirmedAdultDetails, 'adult')}
                                                        </fieldset>
                                                    </>
                                                )}
                                                {childCount > 0 && (
                                                    <>
                                                        <h5>Children {childCount}</h5>
                                                        <fieldset>
                                                            {renderFormFields(childCount, 'child')}
                                                            {renderConfirmedDetails(confirmedChildDetails, 'child')}
                                                        </fieldset>
                                                    </>
                                                )}
                                                {infantCount > 0 && (
                                                    <>
                                                        <h5>Infants {infantCount}</h5>
                                                        <fieldset>
                                                            {renderFormFields(infantCount, 'infant')}
                                                            {renderConfirmedDetails(confirmedInfantDetails, 'infant')}
                                                        </fieldset>
                                                    </>
                                                )}
                                            </div>
                                            {/* {error && 
                                            <div className="text-danger mt-2" aria-live="assertive">{error}</div>
                                            } */}

                                            {/* code for tabs seat meals--------- */}
                                            <div className="row seatMealBaggageTabRow">
                                                <div className="col-lg-6 seatMealBaggageTabbtn">
                                                    <input
                                                        type="checkbox"
                                                        id="seatMealCheckbox"
                                                        className="form-check-input"
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="seatMealCheckbox">
                                                        Add Seats, Meals, Baggage & more
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-12 lastBtnssContinue">
                                                <h5>Fare Breakup <span>₹{totalPrice.toFixed(2)}</span></h5>                                                <button
                                                    onClick={handleButtonClick}
                                                    disabled={isContinueDisabled}
                                                    style={{
                                                        color: isContinueDisabled ? '#ccc' : 'white',
                                                        backgroundColor: isContinueDisabled ? '#f0f0f0' : '#00b7eb',
                                                        cursor: isContinueDisabled ? 'not-allowed' : 'pointer',
                                                        border: 'none',
                                                        padding: '10px 20px',
                                                        borderRadius: '5px',
                                                        transition: 'background-color 0.3s',
                                                    }}
                                                >
                                                    {showTabs ? 'Proceed to Seat Select' : 'Continue'}
                                                </button>
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
                                            <p>₹{baseFare.toFixed(2)}</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv2">
                                            <p>Taxes</p>
                                            <p>₹{tax.toFixed(2)}</p>
                                        </div>
                                        <hr></hr>
                                        <div className="fligthPriceDetailsBoxDiv3">
                                            <h6>Total Fare</h6>
                                            <p>₹{totalFare.toFixed(2)}</p>
                                        </div>
                                        {/* <div className="fligthPriceDetailsBoxDiv4">
                                            <h6>Insurance (All Traveller)</h6>
                                            <p>₹249</p>
                                        </div> */}
                                        {/* <div className="fligthPriceDetailsBoxDiv5">
                                            <h6>Sub Total</h6>
                                            <p>₹249</p>
                                        </div> */}
                                        {/* <div className="fligthPriceDetailsBoxDiv6">
                                            <h6>Coupon Applied</h6>
                                            <p>₹100 OFF</p>
                                        </div> */}
                                        <div className="fligthPriceDetailsBoxDiv7">
                                            <h5>You Pay</h5>
                                            <p>₹{totalFare.toFixed(2)}</p>
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
            <Footer />
        </>
    )
}









