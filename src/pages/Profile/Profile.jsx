import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Container, Row, Col, Alert, Button, Tabs, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomNavbar from '../navbar/CustomNavbar';
import Footer from '../footer/Footer';
import { AiOutlineLogout } from "react-icons/ai";
// import { useHistory } from 'react-router-dom';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false
  // const history = useHistory();

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

  const handleLogout = async () => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const loginId = JSON.parse(localStorage.getItem('loginId'));
    const token = loginData?.token;

    if (!token) {
      setMessage('No token found. Please log in again.');
      setMessageType('danger');
      return;
    }

    try {
      const response = await fetch('https://new.sajpe.in/api/v1/user/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'app-package': 'com.sajyatra',
          'app-version': '1.0',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log out');
      }

      // Clear login data and token from local storage
      localStorage.removeItem('loginData');
      localStorage.removeItem('loginId');

      // Update state to reflect that the user is logged out
      setIsLoggedIn(false);
      setMessage('Logged out successfully.');
      setMessageType('success');

      // Redirect to login page
      // history.push('/login');

    } catch (error) {
      setMessage(`Error logging out: ${error.message}`);
      setMessageType('danger');
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginData = JSON.parse(localStorage.getItem('loginData'));
      console.log("loginData",loginData);
      
      const token = loginData?.token;

      if (token) {
        setIsLoggedIn(true);
        fetchProfileData(); // Fetch profile data if logged in
      } else {
        setIsLoggedIn(false);
      }
    };

    const fetchProfileData = async () => {
      const loginData = JSON.parse(localStorage.getItem('loginData'));
      const token = loginData?.token;

      if (!token) {
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
          throw new Error(errorData.message || 'Failed to fetch profile data');
        }

        const { data } = await response.json();
        console.log('Profile data:', data);

        formik.setFieldValue('name', data.name);
        formik.setFieldValue('email', data.email);
        formik.setFieldValue('phone', data.mobile);

      } catch (error) {
        setMessage(`Error fetching profile data: ${error.message}`);
        setMessageType('danger');
      }
    };

    checkLoginStatus();
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
        <Container>
          <Row className='profileROW'>
            <Col md={10} className='profilesboxx'>
              <div className='profileheddbox'>
                <div className='profileheddboxmain'>
                  <div className='profileimgg'>
                    <img
                      src="https://via.placeholder.com/80"
                      alt="Profile"
                      className="profile-image"
                    />
                  </div>
                  <div className='hedemailss'>
                    <div>
                      <h5 className="email-text">{formik.values.email}</h5>
                      <p className="email-text">{formik.values.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='profileetabss'>
                <div className='logoutbttnn'>
                  <div>
                    {isLoggedIn ? (
                      <button onClick={handleLogout}>
                        <AiOutlineLogout />
                        Logout
                      </button>
                    ) : (
                      <button onClick={() => window.location.href = '/enter-number'}>
                        Login
                      </button>
                    )}
                  </div>
                </div>
                <div className='tabssborder'>
                  <Tabs defaultActiveKey="view" id="profile-tabs" className="mb-3 ">
                    <Tab eventKey="view" title="View Details">
                      <div className="profile-details box profiledetailstabbcont">
                        <div className="details">
                          <div className="detail">
                            <label className="detail-label">Name:</label>
                            <span>{formik.values.name}</span>
                          </div>
                          <div className="detail">
                            <label className="detail-label">Email:</label>
                            <span>{formik.values.email}</span>
                          </div>
                          <div className="detail">
                            <label className="detail-label">Phone:</label>
                            <span>{formik.values.phone}</span>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="edit" title="Edit Details">
                      <div className="profile-details box profileeditBox">
                        <div className="details">
                          <div className="detail row form-group">
                            <div className='col-lg-6'>
                              <label className="" htmlFor="name">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id='name'
                                className='form-control'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.name && formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
                            </div>
                          </div>
                          <div className="detail row form-group">
                            <div className='col-lg-6'>
                              <label className="" htmlFor="name">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                className='form-control'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                            </div>
                          </div>
                          <div className="detail row form-group">
                            <div className='col-lg-6'>
                              <label className="" htmlFor="name">
                                Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                className='form-control'
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}
                            </div>
                          </div>
                        </div>
                        <div className='cancel-savebtnnss'>
                          <Button className="edit_btn editsavebtnn" variant="" onClick={handleSaveChanges}>Save Changes</Button>{' '}
                          <Button className='editcancelbtnn' variant="" onClick={handleCancel}>Cancel</Button>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
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
