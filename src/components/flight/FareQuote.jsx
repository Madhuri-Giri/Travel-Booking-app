import { useLocation, useNavigate , Link } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import "./FlightLists.css";

const FareQuote = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const fareData = location.state?.fareData;

    const formData = location.state?.formData;  // Using optional chaining to prevent errors if state is undefined


    // Check if formData exists
  if (!formData) {
    console.error('formData is undefined');
    return <div>Loading...</div>; // Or any other fallback UI
  }

    const publishedFare = fareData?.Fare?.BaseFare;
    console.log("fareData", fareData);
    console.log("publishedFare", publishedFare);

    const flightDeatilsFun = () => {
        navigate('/flight-details', { state: {fareData : fareData , formData: formData } });
    }


    return (
        <>

            <section className='flightlistsec1'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <TiPlane className="mt-1" />
                            <p> {formData.Segments[0].Origin} </p>
                            <p>-</p>
                            <p>{formData.Segments[0].Destination} </p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaCalendarAlt className="mt-1" />
                            <p><span>Departure on Wed,</span> 17 July</p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaUser className="mt-1" />
                            <p><span>Traveller {formData.AdultCount + formData.ChildCount + formData.InfantCount} , </span> <span>Economy</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="fare-quote-main">
                {/* {publishedFare ? (
                <div className="last">
                    <h6>₹{publishedFare}</h6>
                    <button>Proceed</button>
                </div>
            ) : (
                <p>No fare data available.</p>
            )} */}

                <section className='fare-quote-sec'>
                    <div className="container fare-quote-container">
                        <div className="row fare-quote-boxRow">
                            <div className="col-md-6 fare-quote-box">
                                <div className="row ">

                                    <div className='col-12 fareQuoteHed'>
                                        <h6>Departing Flight  : <span>Sat,jul 27</span></h6>
                                        <p> <span>Delhi</span> <span>Mumbai</span> </p>
                                    </div>
                                    <div className='col-12 fareQuotemain'>
                                        <h6 className='fareQuotemainh6'>SpiceJet</h6>
                                        <p className='fareQuotemainp1'>6:20</p>
                                        <p className='fareQuotemainp2'>Delhi : <span>Indira Gandhi</span></p>
                                        <p className='fareQuotemainp3'>Duration</p>
                                        <p className='fareQuotemainp4'>8:45</p>
                                        <p className='fareQuotemainp5'>Mumbai : <span>Chhatrapati shivaji</span></p>
                                    </div>

                                    {publishedFare ? (
                                        <div className="fareQuotemainLast col-12">
                                            <h5>Fare  <span>₹{publishedFare}</span></h5>
                                            <button onClick={flightDeatilsFun}>Proceed</button>
                                        </div>
                                    ) : (
                                        <p>No fare data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </>

    );
}

export default FareQuote;
