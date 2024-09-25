/* eslint-disable no-unused-vars */
// src/components/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoaderBus = () => {
  return (
    <div style={loaderStyles}>
      <ClipLoader color={'#36d7b7'} size={150} />
    </div>
  );
};

// Inline styles for loader
const loaderStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Full page height
};

export default LoaderBus;
