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

// Add keyframes in inline CSS format
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



// // const ApplicationUrl = () => {

// //   const [loading, setLoading] = useState(true); // State to control loader visibility
// //   // const [headers, setHeaders] = useState<HeadersInit | null>(null); // State to store headers
// //   const location = useLocation();
// //   const navigate = useNavigate();



// //   // const location = useLocation();
// //   // const navigate = useNavigate();

// //   // const [loading, setLoading] = useState(true); // State to control loader visibility

// //   // useEffect(() => {
// //   //   const params = new URLSearchParams(location.search);
// //   //   const token = params.get('token');

// //   //   if (token) {
// //   //     console.log("Token received:", token);
// //   //     // localStorage.setItem('token', token);
// //   //     // Simulate some delay (e.g., token processing)
// //   //     setTimeout(() => {
// //   //       setLoading(false);  // Hide the loader once token is processed
// //   //       // navigate('/');      // Redirect to home or another page
// //   //     }, 1000); // 2-second delay to simulate processing
// //   //   } else {
// //   //     console.log('No token found in the URL');
// //   //     setLoading(true); // Hide loader if no token is found
// //   //   }
// //   // }, [location, navigate]);


// //   useEffect(() => {


// //     const fetchHeaders = async () => {
// //       try {
// //         const response = await fetch(location.href);
// //         const headers = response.headers;
// //         // // const headersObj: HeadersInit = {};
// //         // headers.forEach((value, key) => {
// //         //   headersObj[key] = value;
// //         // });
// //         // setHeaders(headersObj);
// //         console.log('headers',headers);
        
// //       } catch (error) {
// //         console.error('Error fetching headers:', error);
// //       }
// //     };

// //     fetchHeaders();


// //   }, []);







// //   return (
// //     <div>
// //       {loading ? (
// //         <div>
// //           <h2>Processing Token...</h2>
// //           {/* Inline loader style */}
// //           <div style={loaderStyle}></div>
// //         </div>
// //       ) : (
// //         <h2>Redirecting...</h2>
// //       )}
// //     </div>
// //   );
// // };

// // export default ApplicationUrl;

