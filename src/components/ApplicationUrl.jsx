/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendPostRequest } from '../API/loginAction';
import Loading from '../pages/loading/Loading';
import "./ApplicationUrl.css";

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
      // Dispatch the request with a timeout for simulation
      setTimeout(() => {
        dispatch(sendPostRequest({ 
          appname, 
          module, 
          token, 
          navigate, 
          setLoading, 
          setResponseMessage 
        }));
      }, 1000);
    } else {
      setLoading(false); // If parameters are missing, stop loading and show error
    }
  }, [location, dispatch, navigate]);

  if (loading) {
    return <Loading />;
  }

  // If loading is complete and there's an error in response, display "Something went wrong"
  if (!responseMessage) {
    return (
      <section className='seomethingsentwrong'>
      <div>
        <h5>Something went wrong.</h5>
      </div>
      </section>
    );
  }
};

export default ApplicationUrl;
