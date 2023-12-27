import React, { useState } from 'react';
import emailjs from 'emailjs-com'; // make sure to npm install emailjs-com
import './ContactForm1.css'; // make sure to create a CSS file with the styles you want

const ContactForm1: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [responseMessage, setResponseMessage] = useState('');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for errors
    const newErrors = {
      name: !contactInfo.name,
      email: !contactInfo.email,
      message: !contactInfo.message,
    };
    setErrors(newErrors);

    // If there are no errors, send the email
    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      emailjs.sendForm('service_cydxpzs', 'template_5wn3g6s', e.currentTarget, 'S9RwUyfC3l2lLetcT')
        .then((result) => {
            setResponseMessage('Email sent successfully!');
          // Clear the form here if needed
        }, (error) => {
            setResponseMessage('Failed to send email. Please try again later.');
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="contact-form" onSubmit={sendEmail}>
      <input
        className={`form-input ${errors.name ? 'error' : ''}`}
        type="text"
        name="name"
        placeholder="Name"
        value={contactInfo.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error-message">Please enter your name.</p>}
      <input
        className={`form-input ${errors.email ? 'error' : ''}`}
        type="email"
        name="email"
        placeholder="Email"
        value={contactInfo.email}
        onChange={handleChange}
      />
      {errors.email && <p className="error-message">Please enter your email.</p>}
      <textarea
        className={`form-input ${errors.message ? 'error' : ''}`}
        name="message"
        placeholder="Message"
        value={contactInfo.message}
        onChange={handleChange}
      />
      {errors.message && <p className="error-message">Please enter your message.</p>}
      <button type="submit">Send</button>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </form>
  );
};

export default ContactForm1;