import "./FlightLists.css"
import "./FlightDetails.css"
import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Loading from '../../pages/loading/Loading'; // Import the Loading component

export default function FlightDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Add loading state

    //   ----------------------------------------------------


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


    // --------------------------------------seat and meal api--------------------------------------------

    // const [ssrData, setSsrData] = useState([]);

    // useEffect(() => {
    //     const storedData = localStorage.getItem('FlightssrResponse');
    //     if (storedData) {
    //         const parsedData = JSON.parse(storedData);
    //         const flattenedBaggage = parsedData.Baggage.flat();
    //         setSsrData(flattenedBaggage);
    //     } else {
    //         ssrHandler();
    //     }
    // }, []);

    // const ssrHandler = async () => {
    //     // const traceId = localStorage.getItem('FlightTraceId2');
    //     // const resultIndex = localStorage.getItem('FlightResultIndex2');
    //     // const srdvType = localStorage.getItem('FlightSrdvType');
    //     // const srdvIndex = localStorage.getItem('FlightSrdvIndex2');

    //     // if (!traceId || !resultIndex) {
    //     //     console.error('TraceId or ResultIndex not found in local storage');
    //     //     return;
    //     // }

    //     const payload = {
    //         SrdvIndex: "2",
    //         ResultIndex: "4-6779374091_3DELBOMSG8269~11368130584707711" ,
    //         TraceId: "157631" ,
    //         SrdvType:  "MixAPI",
    //     };

    //     try {
    //         const response = await fetch('https://sajyatra.sajpe.in/admin/api/ssr', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const ssrData = await response.json();
    //         console.log('ssr Api:', ssrData);

    //         if (ssrData && ssrData.Baggage) {
    //             localStorage.setItem('FlightssrResponse', JSON.stringify(ssrData));
    //             const flattenedBaggage = ssrData.Baggage.flat();
    //             setSsrData(flattenedBaggage);
    //         } else {
    //             console.error('No baggage data found in response');
    //         }
    //     } catch (error) {
    //         console.error('SSr API call failed:', error);
    //     }
    // };

    // const [seatData, setSeatData] = useState([]);

    // console.log("ssrData", ssrData);
    // console.log("seatData", seatData);

    //   useEffect(() => {
    //     const flightData = localStorage.getItem('FlightsitMap');
    //     if (flightData) {
    //         const parsedData = JSON.parse(flightData);

    //         if (parsedData?.Results?.[0]?.Seats) {
    //             const seatsArray = [];

    //             for (const row in parsedData.Results[0].Seats) {
    //                 const rowData = parsedData.Results[0].Seats[row];

    //                 for (const column in rowData) {
    //                     const seat = rowData[column];
    //                     seatsArray.push({
    //                         seatNumber: seat.SeatNumber,
    //                         price: seat.Amount,
    //                         isBooked: seat.IsBooked,
    //                         imgSrc: '/src/assets/images/seat-2-removebg-preview.png'
    //                     });
    //                 }
    //             }

    //             setSeatData(seatsArray);
    //         } else {
    //             console.warn('Seats data is undefined or missing.');
    //             setSeatData([]);
    //         }
    //     } else {
    //         console.warn('No flight data found in localStorage.');
    //         setSeatData([]);
    //     }
    // }, []);


    // const seatmap = async () => {

    //     // const traceId = localStorage.getItem('FlightTraceId2');
    //     // const resultIndex = localStorage.getItem('FlightResultIndex2');
    //     // const srdvType = localStorage.getItem('FlightSrdvType');
    //     // const srdvIndex = localStorage.getItem('FlightSrdvIndex2');

    //     // if (!traceId || !resultIndex) {
    //     //     console.error('TraceId or ResultIndex not found in local storage');
    //     //     return;
    //     // }

    //     const payload = {
    //         SrdvIndex: "2",
    //         ResultIndex: "4-6779374091_3DELBOMSG8269~11368130584707711" ,
    //         TraceId: "157631" ,
    //         SrdvType:  "MixAPI",
    //     };

    //     try {
    //         const response = await fetch('https://sajyatra.sajpe.in/admin/api/seatmap', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const seatData = await response.json();
    //         console.log('Seat Map Respose:', seatData);

    //         localStorage.setItem('FlightsitMap', JSON.stringify(seatData))

    //     } catch (error) {
    //         console.error('API call failed:', error);
    //     }
    // }

    const reviewHandler = () => {
        // Ensure fareDataDetails is defined before navigating
        if (fareDataDetails) {
            setLoading(true);
            setTimeout(() => {
                navigate('/flight-review', { state: { fareDataDetails } });
            }, 1000);
        } else {
            console.error('fareDataDetails is undefined');
        }
    }

    // ----------------------------------------------seat and meal api------------------------------------


    // ----------------------logic for total traveller forms---------------------------------------
    //     const [activeTabFlightDetails, setActiveTabFlightDetails] = useState('flight');
    //     const [showTabs, setShowTabs] = useState(false);
    //     const [adultCount, setAdultCount] = useState(formData.AdultCount);
    //     const [childCount, setChildCount] = useState(formData.ChildCount);
    //     const [infantCount, setInfantCount] = useState(formData.InfantCount);
    //     const [adultDetails, setAdultDetails] = useState(Array(adultCount).fill({ gender: '', firstName: '', lastName: '' }));
    //     const [childDetails, setChildDetails] = useState(Array(childCount).fill({ gender: '', firstName: '', lastName: '' }));
    //     const [infantDetails, setInfantDetails] = useState(Array(infantCount).fill({ gender: '', firstName: '', lastName: '' }));
    //     const [confirmedAdultDetails, setConfirmedAdultDetails] = useState([]);
    //     const [confirmedChildDetails, setConfirmedChildDetails] = useState([]);
    //     const [confirmedInfantDetails, setConfirmedInfantDetails] = useState([]);
    //  const [error, setError] = useState('');
    //     const [isContinueDisabled, setIsContinueDisabled] = useState(true);
    //     const checkButtonDisabled = () => {
    //         const allAdultsConfirmed = confirmedAdultDetails.every(detail => detail.selected);
    //         const allChildrenConfirmed = confirmedChildDetails.every(detail => detail.selected);
    //         const allInfantsConfirmed = confirmedInfantDetails.every(detail => detail.selected);
    //         setIsContinueDisabled((allAdultsConfirmed && allChildrenConfirmed && allInfantsConfirmed));
    //     };
    //     const handleInputChange = (e, index, type, field) => {
    //         const { value } = e.target;
    //         let details;

    //         if (type === 'adult') {
    //             details = [...adultDetails];
    //         } else if (type === 'child') {
    //             details = [...childDetails];
    //         } else if (type === 'infant') {
    //             details = [...infantDetails];
    //         }


    //         details[index] = {
    //             ...details[index],
    //             [field]: value
    //         };

    //         if (type === 'adult') {
    //             setAdultDetails(details);
    //         } else if (type === 'child') {
    //             setChildDetails(details);
    //         } else if (type === 'infant') {
    //             setInfantDetails(details);
    //         }

    //     };
    //     const handleConfirm = (e, index, type) => {
    //         e.preventDefault();
    //         let details;

    //         if (type === 'adult') {
    //             details = [...adultDetails];
    //         } else if (type === 'child') {
    //             details = [...childDetails];
    //         } else if (type === 'infant') {
    //             details = [...infantDetails];
    //         }

    //         const { gender, firstName, lastName } = details[index];
    //         if (gender && firstName && lastName) {
    //             setError('');
    //             const newDetail = { ...details[index], selected: false };
    //             if (type === 'adult') {
    //                 setConfirmedAdultDetails([...confirmedAdultDetails, newDetail]);
    //             } else if (type === 'child') {
    //                 setConfirmedChildDetails([...confirmedChildDetails, newDetail]);
    //             } else if (type === 'infant') {
    //                 setConfirmedInfantDetails([...confirmedInfantDetails, newDetail]);
    //             }
    //             checkButtonDisabled();
    //         } else {
    //             setError(`Please fill out all fields for ${type} ${index + 1}.`);
    //         }

    //         console.log("setConfirmedAdultDetails", setConfirmedAdultDetails);

    //     };
    //     const handleDelete = (type, index) => {
    //         if (type === 'adult') {
    //             setConfirmedAdultDetails(confirmedAdultDetails.filter((_, i) => i !== index));
    //         } else if (type === 'child') {
    //             setConfirmedChildDetails(confirmedChildDetails.filter((_, i) => i !== index));
    //         } else if (type === 'infant') {
    //             setConfirmedInfantDetails(confirmedInfantDetails.filter((_, i) => i !== index));
    //         }
    //         checkButtonDisabled();
    //     };
    //     const renderFormFields = (count, type) => {
    //         const details = type === 'adult' ? adultDetails : type === 'child' ? childDetails : infantDetails;

    //         return Array.from({ length: count }, (_, index) => (
    //             <div key={`${type}-${index}`} className="row userFormFill">
    //                 <div className="col-md-3 ">
    //                     <label>Gender:</label>
    //                     <div className="form-group genderFormGrp">
    //                         <div className="form-check form-check-inline">
    //                             <input
    //                                 type="radio"
    //                                 id={`${type}-male-${index}`}
    //                                 name={`gender-${type}-${index}`}
    //                                 value="male"
    //                                 className="form-check-input"
    //                                 onChange={(e) => handleInputChange(e, index, type, 'gender')}
    //                                 required
    //                             />
    //                             <label className="form-check-label" htmlFor={`${type}-male-${index}`}>Male</label>
    //                         </div>
    //                         <div className="form-check form-check-inline">
    //                             <input
    //                                 type="radio"
    //                                 id={`${type}-female-${index}`}
    //                                 name={`gender-${type}-${index}`}
    //                                 value="female"
    //                                 className="form-check-input"
    //                                 onChange={(e) => handleInputChange(e, index, type, 'gender')}
    //                                 required
    //                             />
    //                             <label className="form-check-label" htmlFor={`${type}-female-${index}`}>Female</label>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className="col-md-3 ">
    //                     <div className="form-group">
    //                         <label htmlFor={`firstName-${type}-${index}`}>First Name</label>
    //                         <input
    //                             type="text"
    //                             id={`firstName-${type}-${index}`}
    //                             className="form-control"
    //                             onChange={(e) => handleInputChange(e, index, type, 'firstName')}
    //                             value={details[index]?.firstName || ''}
    //                             required
    //                             placeholder="First & Middle Name"
    //                         />
    //                     </div>
    //                 </div>
    //                 <div className="col-md-3 ">
    //                     <div className="form-group">
    //                         <label htmlFor={`lastName-${type}-${index}`}>Last Name</label>
    //                         <input
    //                             type="text"
    //                             id={`lastName-${type}-${index}`}
    //                             className="form-control"
    //                             onChange={(e) => handleInputChange(e, index, type, 'lastName')}
    //                             value={details[index]?.lastName || ''}
    //                             required
    //                             placeholder="Last Name"
    //                         />
    //                     </div>
    //                 </div>
    //                 <div className="col-md-3 ">
    //                     <div className="form-group formConfbtn">
    //                         <button className="btn btn-primary mt-4" onClick={(e) => handleConfirm(e, index, type)}>
    //                             Confirm
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         ));
    //     };

    //     const renderConfirmedDetails = (details, type) => (
    //         <div className="row ">
    //             <div className="mt-4 col-md-6 formdettlsDesk" style={{ display: details.length > 0 ? 'block' : 'none' }}>
    //                 {details.map((detail, index) => (
    //                     <div key={index} className="d-flex align-items-center mb-2">
    //                         <div className="flex-grow-1 formdettlsDeskdiv ml-2">
    //                             <input
    //                                 type="checkbox"
    //                                 className="form-check-input selectDetInp"
    //                                 checked={detail.selected}
    //                                 onChange={() => toggleSelect(index, type)}
    //                             />
    //                             <div className="formdettlsDeskdivnmGen">
    //                                 <div>
    //                                     <strong>Gender:</strong> <span>{detail.gender}</span>
    //                                 </div>
    //                                 <div>
    //                                     <strong>Name:</strong> <span>{detail.firstName} {detail.lastName}</span>
    //                                 </div>
    //                             </div>
    //                             <div>
    //                                 <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete(type, index)} />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>

    //         </div>

    //     );

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
        setIsContinueDisabled((allAdultsConfirmed && allChildrenConfirmed && allInfantsConfirmed));
    };

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

    const handleConfirm = (e, index, type) => {
        e.preventDefault();
        let details;

        if (type === 'adult') {
            details = [...adultDetails];
        } else if (type === 'child') {
            details = [...childDetails];
        } else if (type === 'infant') {
            details = [...infantDetails];
        }

        const { gender, firstName, lastName, dateOfBirth, passportNo, passportExpiry, passportIssueDate, addressLine1, city, countryCode, countryName, contactNo, email } = details[index];

        // Check for all fields
        if (gender && firstName && lastName && dateOfBirth && passportNo && passportExpiry && passportIssueDate && addressLine1 && city && countryCode && countryName && contactNo && email) {
            setError('');
            const newDetail = { ...details[index], selected: false };
            if (type === 'adult') {
                setConfirmedAdultDetails([...confirmedAdultDetails, newDetail]);
            } else if (type === 'child') {
                setConfirmedChildDetails([...confirmedChildDetails, newDetail]);
            } else if (type === 'infant') {
                setConfirmedInfantDetails([...confirmedInfantDetails, newDetail]);
            }
            checkButtonDisabled();
        } else {
            setError(`Please fill out all fields for ${type} ${index + 1}.`);
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
                                {/* <div><strong>Passport No:</strong> <span>{detail.passportNo}</span></div> */}
                                {/* <div><strong>Passport Expiry:</strong> <span>{detail.passportExpiry}</span></div> */}
                                {/* <div><strong>Passport Issue Date:</strong> <span>{detail.passportIssueDate}</span></div> */}
                                {/* <div><strong>Address Line 1:</strong> <span>{detail.addressLine1}</span></div> */}
                                {/* <div><strong>City:</strong> <span>{detail.city}</span></div> */}
                                {/* <div><strong>Country Code:</strong> <span>{detail.countryCode}</span></div> */}
                                {/* <div><strong>Country Name:</strong> <span>{detail.countryName}</span></div> */}
                                {/* <div><strong>Contact No:</strong> <span>{detail.contactNo}</span></div> */}
                                {/* <div><strong>Email:</strong> <span>{detail.email}</span></div> */}
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
    const renderFormFields = (count, type) => {
        const details = type === 'adult' ? adultDetails : type === 'child' ? childDetails : infantDetails;

        return Array.from({ length: count }, (_, index) => (
            <div key={`${type}-${index}`} className="row userFormFill">
                <div className="col-md-3">
                    <label>Gender:</label>
                    <div className="form-group genderFormGrp">
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id={`${type}-male-${index}`}
                                name={`gender-${type}-${index}`}
                                value="male"
                                className="form-check-input"
                                onChange={(e) => handleInputChange(e, index, type, 'gender')}
                                required
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
                                required
                            />
                            <label className="form-check-label" htmlFor={`${type}-female-${index}`}>Female</label>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`firstName-${type}-${index}`}>First Name</label>
                        <input
                            type="text"
                            id={`firstName-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'firstName')}
                            value={details[index]?.firstName || ''}
                            required
                            placeholder="First & Middle Name"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`lastName-${type}-${index}`}>Last Name</label>
                        <input
                            type="text"
                            id={`lastName-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'lastName')}
                            value={details[index]?.lastName || ''}
                            required
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`dateOfBirth-${type}-${index}`}>Date of Birth</label>
                        <input
                            type="date"
                            id={`dateOfBirth-${type}-${index}`}
                            className="form-control"
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            onChange={(e) => handleInputChange(e, index, type, 'dateOfBirth')}
                            value={details[index]?.dateOfBirth || ''}
                            max={new Date().toISOString().split("T")[0]} // Prevent future dates
                            required
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`passportNo-${type}-${index}`}>Passport No</label>
                        <input
                            type="text"
                            id={`passportNo-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'passportNo')}
                            value={details[index]?.passportNo || ''}
                            required
                            placeholder="Passport No"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`passportExpiry-${type}-${index}`}>Passport Expiry</label>
                        <input
                            type="date"
                            id={`passportExpiry-${type}-${index}`}
                            className="form-control"
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            onChange={(e) => handleInputChange(e, index, type, 'passportExpiry')}
                            value={details[index]?.passportExpiry || ''}
                            min={new Date().toISOString().split("T")[0]} // Prevent past dates
                            required
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`passportIssueDate-${type}-${index}`}>Passport Issue Date</label>
                        <input
                            type="date"
                            id={`passportIssueDate-${type}-${index}`}
                            className="form-control"
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            onChange={(e) => handleInputChange(e, index, type, 'passportIssueDate')}
                            value={details[index]?.passportIssueDate || ''}
                            max={new Date().toISOString().split("T")[0]} // Prevent future dates
                            required
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`addressLine1-${type}-${index}`}>Address Line 1</label>
                        <input
                            type="text"
                            id={`addressLine1-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'addressLine1')}
                            value={details[index]?.addressLine1 || ''}
                            required
                            placeholder="Address Line 1"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`city-${type}-${index}`}>City</label>
                        <input
                            type="text"
                            id={`city-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'city')}
                            value={details[index]?.city || ''}
                            required
                            placeholder="City"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`countryCode-${type}-${index}`}>Country Code</label>
                        <input
                            type="text"
                            id={`countryCode-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'countryCode')}
                            value={details[index]?.countryCode || ''}
                            required
                            placeholder="Country Code"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`countryName-${type}-${index}`}>Country Name</label>
                        <input
                            type="text"
                            id={`countryName-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'countryName')}
                            value={details[index]?.countryName || ''}
                            required
                            placeholder="Country Name"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`contactNo-${type}-${index}`}>Contact No</label>
                        <input
                            type="text"
                            id={`contactNo-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'contactNo')}
                            value={details[index]?.contactNo || ''}
                            required
                            placeholder="Contact No"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor={`email-${type}-${index}`}>Email</label>
                        <input
                            type="email"
                            id={`email-${type}-${index}`}
                            className="form-control"
                            onChange={(e) => handleInputChange(e, index, type, 'email')}
                            value={details[index]?.email || ''}
                            required
                            placeholder="Email"
                        />
                    </div>
                </div>
                {/* <div className="col-md-3"> */}
                    <div className="form-group formConfbtn">
                        <button className="btn btn-primary mt-4" onClick={(e) => handleConfirm(e, index, type)}>
                            Confirm
                        </button>
                    </div>
                {/* </div> */}
            </div>
        ));
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

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <CustomNavbar />
            {/* timerrr-------------------  */}
            <div className="timer-FlightLists">
                <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
            </div>
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
                                            {error && <div className="text-danger mt-2" aria-live="assertive">{error}</div>}

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
                                                <h5>Fare Breakup <span>₹{totalFare.toFixed(2)}</span></h5>
                                                <button
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










