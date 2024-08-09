import  { useState, useRef } from 'react';
import './Help.css'; 
import emailjs from '@emailjs/browser';


const Help = () => {
    const [message, setMessage] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const form = useRef();
    const emailInputRef = useRef(null);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_1cbenxe', 'template_5zddh18', form.current, 'lBLxwhWwhbun-i04_')
            .then(
                () => {
                    console.log('SUCCESS!');
                    setEmailStatus('Email sent successfully!');
                    setShowSuccessMessage(true);
                    setMessage('');
                    resetForm();
                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 3000); // Hide success message after 3 seconds
                },
                (error) => {
                    console.log('FAILED...', error.text);
                    setEmailStatus('Failed to send email. Please try again later.');
                }
            );
    };

    const resetForm = () => {
        if (emailInputRef.current) {
            emailInputRef.current.value = '';
        }
    };

    return (
        <>
        
        <section className='helpSecMain'>
        <div className="help-page">
            <h2>Help</h2>
            <form ref={form} onSubmit={sendEmail}>
                <div className="form-group form-group-data">
                    <label htmlFor="email">Email:</label>
                    <input
                       style={{outline:'none'}}
                        type="email"
                        name="user_email"
                        id="email"
                        ref={emailInputRef}
                        required
                    />
                </div>
                <div className="form-group form-group-data">
                    <label htmlFor="message">Message:</label>
                    <textarea
                     style={{outline:'none'}}
                        id="message"
                        rows={8}
                        name="message"
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Type your message..."
                        required
                    />
                </div>
                <div className="help_button">
                    <button type="submit">Send Email</button>
                </div>
            </form>
            {showSuccessMessage && (
                <div className={`status-message ${emailStatus.includes('successfully') ? 'success' : 'error'}`}>
                    {emailStatus}
                </div>
            )}
        </div>
        </section>
        </>
    );
};

export default Help;
