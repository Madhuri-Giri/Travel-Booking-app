import { useLocation } from 'react-router-dom';
import "./FlightLists.css";

const FareQuote = () => {
    const location = useLocation();
    const fareData = location.state?.fareData;

    const publishedFare = fareData?.Fare?.BaseFare;

    return (
        <div className="fare-quote-container">
            {publishedFare ? (
                <div className="last">
                    <h6>₹{publishedFare}</h6>
                    <button>Proceed</button>
                </div>
            ) : (
                <p>No fare data available.</p>
            )}
        </div>
    );
}

export default FareQuote;
