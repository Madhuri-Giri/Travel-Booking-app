// import React from 'react'
// import "./Profile.css"

// function Profile() {
//     return (
//         <>
//             <section className='profile-sec-1'>
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-4">
//                             <img src='https://media.istockphoto.com/id/1320169761/photo/happy-young-30s-handsome-caucasian-man-holding-video-call.jpg?s=612x612&w=0&k=20&c=3bOrJG3eTucy2pv9ogs6gJKByHOy1GUzFjF_f5Isuaw=' className='img-fluid'></img>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <div className="row">
//                 <div className="col-6">
//                 <h4 className='nm'>Name : Johnson</h4>
//                 </div>
//                 <div className="col-6 b">
//                 <h4 className='nm'>Email : example@gmail.com</h4>
//                 </div>
                
//             </div>
//             <div className="row mb-5">
//             <div className="col-6">
//                 <h4 className='nm'>Number : 645646347</h4>
//                 </div>
//                 <div className="col-6 b">
//                 <h4 className='nm'>Address : indore mp</h4>
//                 </div>
//                 <div>
//             <button className='mt-4 bbb btn btn-primary'>Logout</button>
//             <button className='mt-4 bb btn btn-primary'>Settings</button>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default Profile

// ------------------------------------------



import React, { useState, useEffect } from 'react';
import './Profile.css'; 
import { Container, Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  
  

  const initialValues = {
    name: 'Test',
    email: 'test@example.com',
    phone: '7234567894',
    password: '********',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const correctCurrentPassword = 'correctpassword';  // Assume this is the correct current password

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    currentPassword: Yup.string()
      .required('Current password is required')
      .test('is-correct', 'Current password is incorrect', value => value === correctCurrentPassword),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (editing) {
        //  saving changes
        setMessage('Profile updated successfully.');
        setMessageType('success');
      } else {
        //  changing password
        setMessage('Password changed successfully.');
        setMessageType('success');
      }
      setEditing(false);
      setShowChangePasswordModal(false);
      formik.resetForm({ values: initialValues });
    },
  });

  const resetModalFields = () => {
    formik.setFieldValue('currentPassword', '');
    formik.setFieldValue('newPassword', '');
    formik.setFieldValue('confirmPassword', '');
    formik.setTouched({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    });
    formik.setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  useEffect(() => {
    if (!showChangePasswordModal) {
      resetModalFields();
    }
  }, [showChangePasswordModal]);

  const handleSaveChanges = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    formik.resetForm();
    setEditing(false);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <section className='profileSectionbg'>
    <Container className="d-flex justify-content-center align-items-center">
      {message && (
        <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
          {message}
        </Alert>
      )}
      <Row>
        <Col md={4}>
          <div className="profile profile-sidebar box">
            <img src="https://media.istockphoto.com/id/1320169761/photo/happy-young-30s-handsome-caucasian-man-holding-video-call.jpg?s=612x612&w=0&k=20&c=3bOrJG3eTucy2pv9ogs6gJKByHOy1GUzFjF_f5Isuaw=" className="img-fluid" alt="Profile" />
            <div className="sidebar-options">
              {formik.values.name}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="profile profile-details box">
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
              <div className="detail">
                <span className="detail-label">Password:</span>
                {formik.values.password}
                <button className="change-password-link" onClick={handleChangePassword}>Change Password</button>
              </div>
            </div>
            {editing && (
              <>
               <div className='cancel-savebtnnss'>
                <div>
               <Button className="edit_btn" variant="primary" onClick={handleSaveChanges}>Save Changes</Button>{' '}
                </div>
                <div>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                </div>
               </div>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitChangePassword}>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter current password"
                required
              />
              {formik.touched.currentPassword && formik.errors.currentPassword ? <div className="error">{formik.errors.currentPassword}</div> : null}
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new password"
                required
              />
              {formik.touched.newPassword && formik.errors.newPassword ? <div className="error">{formik.errors.newPassword}</div> : null}
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm new password"
                required
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="error">{formik.errors.confirmPassword}</div> : null}
            </Form.Group>
            <Button className="edit_btn" variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
    </section>
  );
};

export default Profile;
