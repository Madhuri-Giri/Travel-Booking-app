import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loading from '../../pages/loading/Loading'; // Make sure this path is correct

const Test = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setLoading(false); // Reset loading state when closing the modal
    setShow(false);
  };
  
  const handleShow = () => {
    setShow(true);
    setLoading(true); // Start loading when the modal is opened
    // Simulate a loading delay for demonstration purposes
    setTimeout(() => {
      setLoading(false); // Stop loading after a delay
    }, 2000); // Change 2000 to your desired loading duration
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Open Modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loading /> // Show loader when loading is true
          ) : (
            <div>
              This is the content of the modal.
              fhsjadfkjsaaaaaaaaaaaaaaaaaaaaaaaa

              
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose} disabled={loading}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Test;
