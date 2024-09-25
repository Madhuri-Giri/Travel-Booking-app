import React from 'react'
import { useNavigate } from 'react-router-dom';

const Sajyatra = () => {
   
    const appName = "sajyatra";
    const token = "12345abcde"; 

    const handleNavigation = () => {
        const url = `/sajyatra?token=${encodeURIComponent(token)}&appName=${encodeURIComponent(appName)}`;
       
      };

  return (
    <div>
      app
    </div>
  );
};


export default Sajyatra
