import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Token = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = 'abcd12345'; 
    const name = 'sajpe'; 

    const url = `https://sajyatra.sajpe.in/api/validate-user?name=${encodeURIComponent(name)}`;

    if (token) {
      // Make the GET request
      axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        console.log(response.data); 
        if (response.data.success) {
          setMessage('Login successful');
          navigate('/login'); 
        } else {
          setMessage('Failed to validate user');
        }
      })
      .catch((error) => {
        console.error('Error during API call', error);
        setMessage('Failed to validate user');
      });
    } else {
      setMessage('Token not found');
    }
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default Token;
