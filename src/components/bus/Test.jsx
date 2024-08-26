import React, { useState, useEffect } from 'react';

export const Test = () => {
  const [busLayoutResponse, setBusLayoutResponse] = useState(null);

  useEffect(() => {
    // Retrieve BuslayoutResponse from localStorage when the component mounts
    const storedData = localStorage.getItem('BuslayoutResponse');
    if (storedData) {
      setBusLayoutResponse(JSON.parse(storedData));
    }
  }, []);

  return (
    <div>
      <h3>Bus Layout Response</h3>
      {/* Check if data exists and render accordingly */}
      {busLayoutResponse ? (
        <pre>{JSON.stringify(busLayoutResponse, null, 2)}</pre>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};
