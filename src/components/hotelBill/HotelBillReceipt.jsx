import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HotelBillReceipt = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    invoiceNumber: '',
    checkInDate: '',
    checkOutDate: '',
    noOfRoom: '',
    roomPrice: '',
    bookingId: '',
    numberOfAdult: '',
    hotelCode: '',
    hotelName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Hotel Bill Receipt</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="guestName">
            <Form.Label>Guest Name</Form.Label>
            <Form.Control
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="invoiceNumber">
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="checkInDate">
            <Form.Label>Check-In Date</Form.Label>
            <Form.Control
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="checkOutDate">
            <Form.Label>Check-Out Date</Form.Label>
            <Form.Control
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        
        <h2 className="my-4">Room Detail</h2>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="noOfRoom">
            <Form.Label>No of Room</Form.Label>
            <Form.Control
              type="number"
              name="noOfRoom"
              value={formData.noOfRoom}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="roomPrice">
            <Form.Label>Room Price</Form.Label>
            <Form.Control
              type="number"
              name="roomPrice"
              value={formData.roomPrice}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        
        <h2 className="my-4">Ticket Detail</h2>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="bookingId">
            <Form.Label>Booking ID</Form.Label>
            <Form.Control
              type="text"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="numberOfAdult">
            <Form.Label>Number of Adults</Form.Label>
            <Form.Control
              type="number"
              name="numberOfAdult"
              value={formData.numberOfAdult}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        
        <h2 className="my-4">Hotel Detail</h2>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="hotelCode">
            <Form.Label>Hotel Code</Form.Label>
            <Form.Control
              type="text"
              name="hotelCode"
              value={formData.hotelCode}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="hotelName">
            <Form.Label>Hotel Name</Form.Label>
            <Form.Control
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default HotelBillReceipt;
