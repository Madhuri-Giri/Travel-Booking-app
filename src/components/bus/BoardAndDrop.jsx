import React, { useState, useEffect } from 'react';
import './BoardAndDrop.css';

const BoardAndDrop = ({ onBoardingSelect, onDroppingSelect }) => {
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardingData = async () => {
      try {
        const traceId = localStorage.getItem('traceId');
        const storedBusDetails = localStorage.getItem('selectedBusDetails');

        if (!traceId) {
          throw new Error('TraceId not found in localStorage');
        }

        let selectedBusResult = null;

        if (storedBusDetails) {
          const parsedBusDetails = JSON.parse(storedBusDetails);
          selectedBusResult = parsedBusDetails.selctedBusResult;

          console.log('Selected Bus Result:', selectedBusResult);
        } else {
          throw new Error('No bus details found in localStorage');
        }

        if (!selectedBusResult) {
          throw new Error('SelectedBusResult not found in bus details');
        }

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/add-boarding-point', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ResultIndex: selectedBusResult,
            TraceId: traceId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch boarding data.');
        }

        const data = await response.json();
        // console.log('bord and drop', data);

        setBoardingPoints(data.GetBusRouteDetailResult?.BoardingPointsDetails || []);
        setDroppingPoints(data.GetBusRouteDetailResult?.DroppingPointsDetails || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching boarding data:', error);
        setError('Failed to fetch boarding data. Please try again later.');
      }
    };
    fetchBoardingData();
  }, []);

  // const handleBoardingSelect = (point) => {
  //   if (point) {
  //     setSelectedBoardingPoint(point.CityPointName);
  //     localStorage.setItem('selectedBoardingPointIndex', point.CityPointIndex); // Store CityPointIndex
  //     localStorage.setItem('BordCityPointLocation', point.CityPointLocation      )
  //     onBoardingSelect(point); 
  //   }
  // };

  const handleBoardingSelect = (point) => {
    if (point) {
      setSelectedBoardingPoint(point.CityPointName);
      localStorage.setItem('selectedBoardingPointIndex', point.CityPointIndex); 
      localStorage.setItem('BordCityPointLocation', point.CityPointLocation); 
      onBoardingSelect(point); 
    }
  };
  const handleDroppingSelect = (point) => {
    if (point) {
      setSelectedDroppingPoint(point.CityPointName);
      localStorage.setItem('selectedDroppingPointIndex', point.CityPointIndex); 
      localStorage.setItem('DropCityPointLocation', point.CityPointLocation); 
      onDroppingSelect(point); 
    }
  };
  

  // const handleDroppingSelect = (point) => {
  //   if (point) {
  //     setSelectedDroppingPoint(point.CityPointName);
  //     localStorage.setItem('selectedDroppingPointIndex', point.CityPointIndex); // Store CityPointIndex
  //     localStorage.setItem('DropCityPointLocation', point.CityPointLocation      )

  //     onDroppingSelect(point); // Call the parent handler
  //   }
  // };

  return (
    <div className="bording">
      <div className="container">
        <div className="row">
          <div className="select col-12">
            <label htmlFor="boarding-select" className="form-label"></label>
            <select
              id="boarding-select"
              className="form-select"
              value={selectedBoardingPoint}
              onChange={(e) => handleBoardingSelect(boardingPoints.find(point => point.CityPointName === e.target.value))}
            >
              <option value="" disabled>Select Boarding Point</option>
              {boardingPoints.map(point => (
                <option key={point.CityPointIndex} value={point.CityPointName}>{point.CityPointName}</option>
              ))}
            </select>
          </div>

          <div className="select col-12">
            <label htmlFor="dropping-select" className="form-label"></label>
            <select
              id="dropping-select"
              className="form-select"
              value={selectedDroppingPoint}
              onChange={(e) => handleDroppingSelect(droppingPoints.find(point => point.CityPointName === e.target.value))}
            >
              <option value="" disabled>Select Dropping Point</option>
              {droppingPoints.map(point => (
                <option key={point.CityPointIndex} value={point.CityPointName}>{point.CityPointName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message text-danger">{error}</div>}
    </div>
  );
};

export default BoardAndDrop;
