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

  const handleBoardingSelect = (point) => {
    if (point) {
      setSelectedBoardingPoint(point.CityPointName);
      onBoardingSelect(point); // Call the parent handler
    }
  };

  const handleDroppingSelect = (point) => {
    if (point) {
      setSelectedDroppingPoint(point.CityPointName);
      onDroppingSelect(point); // Call the parent handler
    }
  };

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

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BoardAndDrop;
