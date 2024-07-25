// useGeolocation.js
import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const onSuccess = (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      };

      const onError = (error) => {
        setError("Geolocation access denied. Showing results without distance information.");
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return { position, error };
};

export default useGeolocation;
