/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const loaderStyle = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

// Add keyframes in inline CSS format
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inject the keyframes into the document's stylesheet
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);

const ApplicationUrl = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // State to control loader visibility

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("Token received:", token);
      // localStorage.setItem('token', token);
      // Simulate some delay (e.g., token processing)
      setTimeout(() => {
        setLoading(false);  // Hide the loader once token is processed
        // navigate('/');      // Redirect to home or another page
      }, 1000); // 2-second delay to simulate processing
    } else {
      console.log('No token found in the URL');
      setLoading(true); // Hide loader if no token is found
    }
  }, [location, navigate]);

  return (
    <div>
      {loading ? (
        <div>
          <h2>Processing Token...</h2>
          {/* Inline loader style */}
          <div style={loaderStyle}></div>
        </div>
      ) : (
        <h2>Redirecting...</h2>
      )}
    </div>
  );
};

export default ApplicationUrl;
