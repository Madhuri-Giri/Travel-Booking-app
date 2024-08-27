// const blockHandler = async (event) => {
//   event.preventDefault();

//   // Retrieve selectedBusSeatData from localStorage
//   const selectedBusSeatData = JSON.parse(localStorage.getItem('selectedBusSeatData')) || [];
//   console.log('Selected Bus Seat Data:', selectedBusSeatData); // Log selected bus seat data

//   // Check if there are enough passengers for the selected seats
//   if (passengerCount < selectedBusSeatData.length) {
//     // Map seat data to passengersData
//     const passengersData = selectedBusSeatData.map(seat => ({
//       LeadPassenger: true,
//       Title: 'Mr',
//       FirstName: formData.firstName,
//       LastName: formData.lastName,
//       Email: 'tani@gmail.com',
//       Phoneno: '9999999999',
//       Gender: formData.gender,
//       IdType: null,
//       Idnumber: null,
//       Address: formData.address,
//       Age: formData.age,
//       Seat: {
//         ColumnNo: seat.ColumnNo,
//         Height: seat.Height,
//         IsLadiesSeat: seat.IsLadiesSeat,
//         IsMalesSeat: seat.IsMalesSeat,
//         IsUpper: seat.IsUpper,
//         RowNo: seat.RowNo,
//         SeatFare: seat.Price?.BasePrice || 0,
//         SeatIndex: seat.SeatIndex || 0,
//         SeatName: seat.SeatName || '',
//         SeatStatus: seat.SeatStatus || false,
//         SeatType: seat.SeatType || 1,
//         Width: seat.Width || 0,
//         Price: {
//           CurrencyCode: seat.Price?.CurrencyCode || "INR",
//           BasePrice: seat.Price?.BasePrice || 400,
//           Tax: seat.Price?.Tax || 0,
//           OtherCharges: seat.Price?.OtherCharges || 0,
//           Discount: seat.Price?.Discount || 0,
//           PublishedPrice: seat.Price?.PublishedPrice || 400,
//           PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff || 400,
//           OfferedPrice: seat.Price?.OfferedPrice || 380,
//           OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff || 380,
//           AgentCommission: seat.Price?.AgentCommission || 20,
//           AgentMarkUp: seat.Price?.AgentMarkUp || 0,
//           TDS: seat.Price?.TDS || 8,
//           GST: seat.Price?.GST || {
//             CGSTAmount: 0,
//             CGSTRate: 0,
//             CessAmount: 0,
//             CessRate: 0,
//             IGSTAmount: 0,
//             IGSTRate: 18,
//             SGSTAmount: 0,
//             SGSTRate: 0,
//             TaxableAmount: 0
//           }
//         },
//       },
//     }));

//     console.log('Passengers Data:', passengersData); // Log passenger data

//     // Prepare request data
//     const requestData = {
//       ResultIndex: '1',
//       TraceId: '1',
//       BoardingPointId: 1,
//       DroppingPointId: 1,
//       RefID: '1',
//       Passenger: passengersData,
//     };

//     console.log('Request Data:', requestData); // Log request data

//     try {
//       // Make the API request
//       const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-block', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       // Check if the response is okay
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // Parse and log the response data
//       const data = await response.json();
//       console.log('Block Response:', data);

//       // Save busSavedId to localStorage
//       const busSavedId = data.result.saved_bookings.id;
//       localStorage.setItem('busSavedId', busSavedId);

//       // Update passengers list and reset form
//       const newPassenger = {
//         FirstName: formData.firstName,
//         LastName: formData.lastName,
//         Gender: formData.gender,
//         Address: formData.address,
//         Age: formData.age,
//       };

//       const updatedPassengers = [...passengers, newPassenger];
//       setPassengers(updatedPassengers);
//       setPassengerCount(updatedPassengers.length);
//       setFormData(initialFormData);

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   } else {
//     alert("All selected seats must have corresponding passengers.");
//   }
// };








// // -----------------------------------
// const bookHandler = async () => {
//   try {

   
     

//     const bookingPayload = {
//       ResultIndex: "1",
//       TraceId: "1",
//       BoardingPointId: 1,
//       DroppingPointId: 1,
//       RefID: "1",
//       transaction_num: transactionNoBus ,
//       bus_booking_id: [busSavedId] ,
//       transaction_id: transaction_id,
//       Passenger: [
//         {
//           LeadPassenger: true,
//           PassengerId: 0,
//           Title: "Mr",
//           FirstName: "Amit",
//           LastName: "Singh",
//           Email: "amit@srdvtechnologies.com",
//           Phoneno: "9643737502",
//           Gender: "1",
//           IdType: null,
//           IdNumber: null,
//           Address: "Modinagar",
//           Age: "22",
//           Seat: {
//             ColumnNo: "001",
//             Height: 1,
//             IsLadiesSeat: false,
//             IsMalesSeat: false,
//             IsUpper: false,
//             RowNo: "000",
//             SeatFare: 400,
//             SeatIndex: 2,
//             SeatName: "2",
//             SeatStatus: true,
//             SeatType: 1,
//             Width: 1,
//             Price: {
//               CurrencyCode: "INR",
//               BasePrice: 400,
//               Tax: 0,
//               OtherCharges: 0,
//               Discount: 0,
//               PublishedPrice: 400,
//               PublishedPriceRoundedOff: 400,
//               OfferedPrice: 380,
//               OfferedPriceRoundedOff: 380,
//               AgentCommission: 20,
//               AgentMarkUp: 0,
//               TDS: 8,
//               GST: {
//                 CGSTAmount: 0,
//                 CGSTRate: 0,
//                 CessAmount: 0,
//                 CessRate: 0,
//                 IGSTAmount: 0,
//                 IGSTRate: 18,
//                 SGSTAmount: 0,
//                 SGSTRate: 0,
//                 TaxableAmount: 0
//               }
//             }
//           }
//         },
//         {
//           LeadPassenger: false,
//           PassengerId: 0,
//           Title: "Mr",
//           FirstName: "ramesh",
//           LastName: "Tomar",
//           Email: "ramesh@srdvtechnologies.com",
//           Phoneno: "1234567890",
//           Gender: "1",
//           IdType: null,
//           IdNumber: null,
//           Address: "Modinagar",
//           Age: "28",
//           Seat: {
//             ColumnNo: "002",
//             Height: 1,
//             IsLadiesSeat: false,
//             IsMalesSeat: false,
//             IsUpper: false,
//             RowNo: "000",
//             SeatFare: 400,
//             SeatIndex: 3,
//             SeatName: "3",
//             SeatStatus: true,
//             SeatType: 1,
//             Width: 1,
//             Price: {
//               CurrencyCode: "INR",
//               BasePrice: 400,
//               Tax: 0,
//               OtherCharges: 0,
//               Discount: 0,
//               PublishedPrice: 400,
//               PublishedPriceRoundedOff: 400,
//               OfferedPrice: 380,
//               OfferedPriceRoundedOff: 380,
//               AgentCommission: 20,
//               AgentMarkUp: 0,
//               TDS: 8,
//               GST: {
//                 CGSTAmount: 0,
//                 CGSTRate: 0,
//                 CessAmount: 0,
//                 CessRate: 0,
//                 IGSTAmount: 0,
//                 IGSTRate: 18,
//                 SGSTAmount: 0,
//                 SGSTRate: 0,
//                 TaxableAmount: 0
//               }
//             }
//           }
//         }
//       ]
//     };




//     const response = await fetch('https://sajyatra.sajpe.in/admin/api/seat-book', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(bookingPayload),
//     });

//     const responseBody = await response.json();
//     console.log('Bus Book Response:', responseBody);

//     if (!response.ok) {
//       console.error('Failed to book seats. Status:', response.status, 'Response:', responseBody);
//       throw new Error(`Failed to book seats. Status: ${response.status}`);
//     }

//     if (responseBody.Error && responseBody.Error.ErrorCode !== 0) {
//       console.error('Booking failed:', responseBody.Error.ErrorMessage);
//       toast.error(`Booking failed: ${responseBody.Error.ErrorMessage}`);
//     } else {
//       toast.success('Booking successful!');

//       localStorage.setItem('busTikitDetails', JSON.stringify(responseBody));

//       setTimeout(() => {
//         navigate('/booking-history', { state: { bookingDetails: responseBody } });
//       }, 2000);
//     }
//   } catch (error) {
//     console.error('Error during booking:', error.message);
//     toast.error('An error occurred during booking. Please try again.');
//   }
// };