// import React, { useState } from 'react';
// // import Modal from 'react-modal'; // Import React Modal
// import './RoughFlightlist.css'; // Your custom styles if any

// // Required for accessibility, sets the app root element
// // Modal.setAppElement('#root');

// const RoughFlightlist = () => {
//   // State to control the modal's visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Function to open the modal
//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   // Function to close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="RoughFlightlist">
//       {/* Button to trigger modal */}
//       <button onClick={openModal} className="open-modal-btn">
//         Open Modal
//       </button>

//       {/* Modal Component from react-modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal} // Closes the modal when clicking outside of it or pressing ESC
//         contentLabel="Example Modal"
//         className="modal" // Custom class for modal content (optional)
//         overlayClassName="modal-overlay" // Custom class for the overlay background (optional)
//       >
//         <h2>Modal Title</h2>
//         <p>This is a modal example using React Modal!</p>
//         <button onClick={closeModal} className="close-modal-btn">
//           Close Modal
//         </button>
//       </Modal>
//     </div>
//   );
// };

// export default RoughFlightlist;
