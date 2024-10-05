/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendPostRequest } from '../API/loginAction';

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
`;

// Inject the keyframes into the document's stylesheet
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);

const ApplicationUrl = () => {
  const [loading, setLoading] = useState(true); // State to control loader visibility
  const [responseMessage, setResponseMessage] = useState(null); // State for API response
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const appname = params.get('app-name');
    const module = params.get('module');

    if (token && appname && module) {
      setTimeout(() => {
       dispatch(sendPostRequest({ appname, module, token ,navigate ,setLoading})) 
      }, 500);
    } else {
      setLoading(true); // Keep loader if parameters are missing
    }
  }, [location]);


  // Function to send POST request with token in headers and app_name, module in body  
  // const sendPostRequest = async (appname, module, token) => {
  //   try {
  //     const response = await fetch('https://sajyatra.sajpe.in/admin/api/auth-check', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}` // Pass token in the Authorization header
  //       },
  //       body: JSON.stringify({
  //         app_name: appname,
  //         module: module
  //       })
  //     });
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();

  //     if (data.result == false) {
  //       navigate('/signup');
  //     } else {
  //       if (data.module == 'bus') {
  //         navigate('/bus-search');
  //       }
  //       if (data.module == 'flight') {
  //         navigate('/flight-search');
  //       }
  //       if (data.module == 'hotel') {
  //         navigate('/hotel-search');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error in POST request:', error);
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      {loading && (
        <div>
          <h2>Processing Token...</h2>
          <div style={loaderStyle}></div>
        </div>
      )
      }
    </div>
  );
};

export default ApplicationUrl;









// useEffect(() => {
//   const params = new URLSearchParams(location.search);
//   const token = params.get('token');
//   const appName = params.get('app-name');  // Retrieve app-name from URL
//   const moduleName = params.get('module'); // Retrieve module from URL

//   if (token && appName && moduleName) {
//     console.log("Token received:", token);
//     console.log("App Name received:", appName);
//     console.log("Module Name received:", moduleName);

//     setTimeout(() => {
//       setLoading(false);  // Hide the loader once the token, app-name, and module are processed
//     }, 1000); // Simulate some delay
//   } else {
//     console.log('Required parameters (token, app-name, module) not found in the URL');
//     setLoading(true); // Keep the loader if parameters are missing
//   }
// }, [location, navigate]);



// useEffect(() => {
//   const fetchHeaders = async () => {
//     try {
//       const params = new URLSearchParams(location.search);
//       const token = params.get('token');
//       const appName = params.get('app-name');
//       const moduleName = params.get('module');

//       console.log('Token being sent in headers:', token);
//       console.log('App Name being sent in headers:', appName);
//       console.log('Module Name being sent in headers:', moduleName);

//       // Pass token, app-name, and module in the request headers
//       const response = await fetch(location.href, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'App-Name': appName,
//           'Module': moduleName
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const headers = response.headers;
//       const headersObj = {};
//       headers.forEach((value, key) => {
//         headersObj[key] = value;
//       });

//       setHeaders(headersObj);

//       // Log all headers along with token, app-name, and module
//       console.log('Headers received with token, app-name, and module:', {
//         ...headersObj,
//         token,
//         'app-name': appName,
//         module: moduleName
//       });

//     } catch (error) {
//       console.error('Error fetching headers:', error);
//     }
//   };

//   fetchHeaders();
// }, [location]);



