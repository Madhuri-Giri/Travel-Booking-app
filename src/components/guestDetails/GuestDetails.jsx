import { useState } from 'react';
import './GuestDetails.css';
import { Container } from 'react-bootstrap';

const mockData = [
  {
    name: "Hotel Amraid",
    paragraph: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, veniam.",
    heading: "Check-in",
    heading1: "Check-out",
    heading2: "Your Payment Summary",
    price: "₹4480"
  }
];

const GuestDetails = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Container>
      <div className='guest_details_container'>
        <h2 className="section_title">Guest Detail</h2>
        {mockData.map((guest, index) => (
          <div key={index} className='guest_details_card'>
            <h3 className="card_title">{guest.name}</h3>
            <p>{guest.paragraph}</p>
            <div className="info_section">
              <h3>{guest.heading}</h3>
              <p>Tue 25 Jun 2024</p>
            </div>
            <div className="info_section">
              <h3>{guest.heading1}</h3>
              <p>Total length of nights: 2</p>
            </div>
            <div className="info_section">
              <h3>You selected</h3>
              <p>3 rooms for 2 adults</p>
            </div>
            <div className="info_section">
              <h3>{guest.heading2}</h3>
              <p>Original price {guest.price}</p>
            </div>
          </div>
        ))}
        <div className="guest_details_form">
          <h2 className="form_title">Enter your details</h2>
          <form onSubmit={submitHandler}>
            <div className="guest_detail">
              <label>Enter Your First Name</label>
              <div className="guest">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter Your First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="guest_detail">
              <label>Enter Your Last Name</label>
              <div className="guest">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Your Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="guest_detail">
              <label>Enter Your Email</label>
              <div className="guest">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button className='submit_btn' type="submit">Submit</button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default GuestDetails;
