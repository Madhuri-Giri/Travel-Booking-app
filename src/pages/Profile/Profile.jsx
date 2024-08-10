import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomNavbar from '../navbar/CustomNavbar';
import Footer from '../footer/Footer';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Updated initial values
  const initialValues = {
    name: '',
    email: '',
    phone: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Simulate a profile update
      setMessage('Profile updated successfully.');
      setMessageType('success');
      setEditing(false);
      formik.resetForm({ values: initialValues });
    },
  });

  const handleSaveChanges = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    formik.resetForm();
    setEditing(false);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      console.log('Fetching profile data...');
      const loginData = JSON.parse(localStorage.getItem('loginData'));
      const token = loginData?.token;

      if (!token) {
        console.error('No token found');
        setMessage('No token found. Please log in again.');
        setMessageType('danger');
        return;
      }

      try {
        const response = await fetch('https://new.sajpe.in/api/v1/user/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'app-package': 'com.sajyatra',
            'app-version': '1.0',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          throw new Error(errorData.message || 'Failed to fetch profile data');
        }

        const { data } = await response.json(); // Destructure to get the data
        console.log('Profile data:', data);

        // Set formik values from the response data
        formik.setFieldValue('name', data.name);
        formik.setFieldValue('email', data.email);
        formik.setFieldValue('phone', data.mobile); // Use 'mobile' for phone

      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        setMessage(`Error fetching profile data: ${error.message}`);
        setMessageType('danger');
      }
    };

    fetchProfileData();
  }, []);

  return (
    <>
      <CustomNavbar />
      <section className='profileSectionbg'>
        {message && (
          <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
            {message}
          </Alert>
        )}
        <Container className="d-flex justify-content-center align-items-center">
          <Row>
            <Col md={4}>
              <div className="profile profile-sidebar box">
                <img
                  src="https://media.istockphoto.com/id/1320169761/photo/happy-young-30s-handsome-caucasian-man-holding-video-call.jpg?s=612x612&w=0&k=20&c=3bOrJG3eTucy2pv9ogs6gJKByHOy1GUzFjF_f5Isuaw="
                  className="img-fluid"
                  alt="Profile"
                />
                <div className="sidebar-options">
                  {formik.values.name}
                </div>
              </div>
            </Col>
            <Col md={8}>
              <div className="profile-details box">
                <div className="profile-header">
                  <h2>Profile Details</h2>
                  <button className="edit-button" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <div className="details">
                  <div className="detail">
                    <span className="detail-label">Name:</span>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ) : (
                      <span>{formik.values.name}</span>
                    )}
                    {formik.touched.name && formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
                  </div>
                  <div className="detail">
                    <span className="detail-label">Email:</span>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ) : (
                      <span>{formik.values.email}</span>
                    )}
                    {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                  </div>
                  <div className="detail">
                    <span className="detail-label">Phone:</span>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ) : (
                      <span>{formik.values.phone}</span>
                    )}
                    {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}
                  </div>
                </div>
                {editing && (
                  <div className='cancel-savebtnnss'>
                    <Button className="edit_btn" variant="primary" onClick={handleSaveChanges}>Save Changes</Button>{' '}
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default Profile;
