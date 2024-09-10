// const getFlightList = async () => {
//   setLoading(true);
//   try {
//     const response = await fetch('https://sajyatra.sajpe.in/admin/api/flight-search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Flight search API response: ", data);

//     localStorage.setItem('Flight-search', JSON.stringify(data));



//     const airlineCodes = data.Results.flatMap(result =>
//       result.flatMap(fareData =>
//         fareData.FareDataMultiple.flatMap(fare =>
//           fare.FareSegments.map(segment => segment.AirlineCode)
//         )
//       )
//     );
//     const filteredAirlineCodes = airlineCodes.filter(code => code !== "");

//     console.log("Airline Codes: ", filteredAirlineCodes);

//     const logos = await fetchAirlineLogos(filteredAirlineCodes);
//     console.log("Fetched Airline Logos: ", logos);

//     const logoMap = filteredAirlineCodes.reduce((acc, code, index) => {
//       acc[code] = logos[index] || '';
//       return acc;
//     }, {});

//     localStorage.setItem('Airline-Logos', JSON.stringify(logoMap));

//     navigate("/flight-list", { state: { data: data, formData: formData } });
//   } catch (error) {
//     toast.error('An error occurred during booking. Please try again.');
//     console.error('Error fetching flight data:', error);
//   } finally {
//     setLoading(false);
//   }
// };
