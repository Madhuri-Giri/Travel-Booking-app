/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
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



const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inject the keyframes into the document's stylesheet
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);



// const ApplicationUrl: React.FC = () => {
  const ApplicationUrl = () => {
    const [loading, setLoading] = useState(true); // State to control loader visibility
    const [headers, setHeaders] = useState(null); // State to store headers
    // const [headers, setHeaders] = useState<HeadersInit | null>(null); // State to store headers
  const headersObj = {};


  const location = useLocation();
  const navigate = useNavigate();
  console.log('navigate', location)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("Token received:", token);
  
      setTimeout(() => {
        setLoading(false);  // Hide the loader once token is processed
        // navigate('/');      // Redirect to home or another page
      }, 1000); // 2-second delay to simulate processing

      // Fetch headers
      // fetchHeaders();
    } else {
      console.log('No token found in the URL');
      setLoading(true); // Hide loader if no token is found
    }
  }, [location, navigate]);
  
  useEffect(() => {
     const fetchHeaders = async () => {
    try {
      const response = await fetch(location.href);
      const headers = response.headers;
      console.log('headers', headers, response)
      const headersObj = {}; // Use standard JavaScript object initialization
      headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      setHeaders(headersObj);
      console.log('Headers:', headersObj);

    } catch (error) {
      console.error('Error fetching headers:', error);
    }
  };
    fetchHeaders();
  }, []);
  

  const url = 'http://localhost:5173/token-receiver-url';

  async function getTokenFromHeader() {
    try {
      const response = await fetch(url, {
        method: 'GET', // or 'POST' depending on how the API works
        headers: {
          'Content-Type': 'application/json', // Adjust if needed
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Access token from the headers (replace 'Authorization' with the actual header name)
      const token = response.headers.get('Authorization'); // Adjust to your token header key
      console.log('Token from headers:', token);
      
      return token;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  }
  
  getTokenFromHeader();


  return (
    <>
    <div>

    <h3>Headers Data:</h3>
    <h3>{JSON.stringify(headers)}</h3>

      {/* {loading ? (
        <div>
          <h2>Processing Token...</h2>
          <div style={loaderStyle}></div>
        </div>
      ) : (
        <div>
          <h2>Redirecting...</h2>
          {headers && (
            <div>
              <h3>Request Headers:</h3>
              <h3>{headers}</h3>
              <pre>{JSON.stringify(headers, null, 2)}</pre>
            </div>
          )}
        </div>
      )} */}
    </div>
    </>
  );
};

export default ApplicationUrl;


