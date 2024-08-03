// generatePDF.js
import jsPDF from 'jspdf';

export const GeneratePdf = (hotelName, roomQuantity, price, roomType, checkInDate, checkOutDate) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Booking Bill', 14, 22);
  
  // Add hotel details
  doc.setFontSize(12);
  doc.text(`Hotel Name: ${hotelName}`, 14, 40);
  doc.text(`Room Quantity: ${roomQuantity}`, 14, 50);
  doc.text(`Price: ${price}`, 14, 60);
  doc.text(`Room Type: ${roomType}`, 14, 70);
  doc.text(`Check-In Date: ${checkInDate}`, 14, 80);
  doc.text(`Check-Out Date: ${checkOutDate}`, 14, 90);

  // Save the PDF
  doc.save('booking-bill.pdf');
};
