import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import './BoardAndDrop.css';

const BoardAndDrop = ({ onBoardingSelect, onDroppingSelect }) => {
  const [showBoarding, setShowBoarding] = useState(false);
  const [showDropping, setShowDropping] = useState(false);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);
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
    setSelectedBoarding(point);
    onBoardingSelect(point);
  };

  const handleDroppingSelect = (point) => {
    setSelectedDropping(point);
    onDroppingSelect(point);
  };

  return (
    <div className="bording">
      <Accordion className="accordian_space">
        <Accordion.Item eventKey="0" className='bord'>
          <Accordion.Header onClick={() => setShowBoarding(!showBoarding)}>
            <h6>Boarding Points</h6>
          </Accordion.Header>
          <Accordion.Body>
            {showBoarding && (
              <div className="points-list">
                {boardingPoints.map(point => (
                  <div key={point.CityPointIndex} className="point-item" onClick={() => handleBoardingSelect(point)}>
                    <p>{point.CityPointName}</p>
                  </div>
                ))}
                {boardingPoints.length === 0 && <p>No Boarding Points Available</p>}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion className="accordian_space">
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={() => setShowDropping(!showDropping)}>
            <h6>Dropping Points</h6>
          </Accordion.Header>
          <Accordion.Body>
            {showDropping && (
              <div className="points-list">
                {droppingPoints.map(point => (
                  <div key={point.CityPointIndex} className="point-item" onClick={() => handleDroppingSelect(point)}>
                    <p>{point.CityPointName}</p>
                  </div>
                ))}
                {droppingPoints.length === 0 && <p>No Dropping Points Available</p>}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BoardAndDrop;
