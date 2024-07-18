import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardAndDrop.css';

const BoardAndDrop = () => {
  const navigate = useNavigate();

  const [showBoarding, setShowBoarding] = useState(true);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [error, setError] = useState(null);

  const handleShowBoarding = () => {
    setShowBoarding(true);
  };

  const handleShowDropping = () => {
    setShowBoarding(false);
  };



  useEffect(() => {
    const fetchBoardingData = async () => {
      try {
        const traceId = localStorage.getItem('traceId');
      const resultIndex = localStorage.getItem('resultIndex');

      if (!traceId || !resultIndex) {
        throw new Error('TraceId or ResultIndex not found in localStorage');
      }

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/addboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ResultIndex: resultIndex,
            TraceId: traceId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch boarding data.');
        }

        const data = await response.json();
        console.log('Add boarding response:', data);

        setBoardingPoints(data.BoardingPoints || []);
        setDroppingPoints(data.DroppingPoints || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching boarding data:', error);
        setError('Failed to fetch boarding data. Please try again later.');
      }
    };

    fetchBoardingData();
  }, []);

  const handleSelectBoarding = (index) => {
    setSelectedBoarding(index);
  };



  const handleSelectDropping = (index) => {
    setSelectedDropping(index);
   // navigate('/passanger-info');
 

  //  --------------------
  const passengersAlreadyAdded = localStorage.getItem('passengersAlreadyAdded');
    if (passengersAlreadyAdded) {
      navigate('/passenger-list');
    } else {
      localStorage.setItem('passengersAlreadyAdded', true);
      navigate('/passanger-info');
    }
  // ---------------------


  };

  


  const backHandlerList = () => {
    navigate('/buslist')
  }



  return (

    <>
     <div className='BordingDroping'>
      <div className="bord-drop">
        <h5><i style={{cursor:"pointer"}} onClick={backHandlerList} className="ri-arrow-left-s-line"></i> Select Boarding & Dropping Points</h5>

        <div className="DB-top">
          <p 
            className={`tab ${showBoarding ? 'active' : ''}`} 
            onClick={handleShowBoarding}
          >
            Boarding-Points
          </p>
          <p 
            className={`tab ${!showBoarding ? 'active' : ''}`} 
            onClick={handleShowDropping}
          >
            Dropping-Points
          </p>
        </div>

        {showBoarding ? (
          <div className="all-Bording-point">
            <p>ALL BOARDING POINTS</p>
            <div className="boring-last">
              {boardingPoints.map(point => (
                <div key={point.CityPointIndex} className="bord-last">
                  <div className="bd-one">
                    <span>{point.CityPointTime}</span>
                    <span>{point.CityPointName}</span>
                  </div>
                  <div className="bd-one">
                    <span>{point.CityPointLocation}</span>
                    <span>{point.CityPointLandmark}</span>
                  </div>
                  <div className="bd-two">
                    <input 
                      type="radio" 
                      name="boarding"
                      checked={selectedBoarding === point.CityPointIndex} 
                      onChange={() => handleSelectBoarding(point.CityPointIndex)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="all-Droping-point">
            <p>ALL DROPPING POINTS</p>
            <div className="boring-last">
              {droppingPoints.map(point => (
                <div key={point.CityPointIndex} className="bord-last">
                  <div className="bd-one">
                    <span>{point.CityPointTime}</span>
                    <span>{point.CityPointName}</span>
                  </div>
                  <div className="bd-one">
                    <span>{point.CityPointLocation}</span>
                    <span>{point.CityPointLandmark}</span>
                  </div>
                  <div className="bd-two">
                    <input 
                      type="radio" 
                      name="dropping"
                      checked={selectedDropping === point.CityPointIndex} 
                      onChange={() => handleSelectDropping(point.CityPointIndex)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>

    
    </>

    


  );
};

export default BoardAndDrop;

