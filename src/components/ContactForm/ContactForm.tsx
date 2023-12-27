import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactForm.css';

interface ContactInfo {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name: boolean;
  email: boolean;
  message: boolean;
}

const ContactForm: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({
    name: false,
    email: false,
    message: false,
  });

  const [responseMessage, setResponseMessage] = useState<string>('');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for errors
    const newErrors = {
      name: contactInfo.name === '',
      email: contactInfo.email === '',
      message: contactInfo.message === '',
    };
    setErrors(newErrors);

    // If there are no errors, send the email
    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      emailjs.sendForm('service_cydxpzs', 'template_5wn3g6s', e.currentTarget, 'S9RwUyfC3l2lLetcT')
        .then((result) => {
            setResponseMessage('Email sent successfully!');
            // Clear the form here if needed
            setContactInfo({ name: '', email: '', message: '' });
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
        placeholder="Your Name"
        value={contactInfo.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error-message">Please enter your name.</p>}
      <input
        className={`form-input ${errors.email ? 'error' : ''}`}
        type="email"
        name="email"
        placeholder="Your Email"
        value={contactInfo.email}
        onChange={handleChange}
      />
      {errors.email && <p className="error-message">Please enter a valid email.</p>}
      <textarea
        className={`form-textarea ${errors.message ? 'error' : ''}`}
        name="message"
        placeholder="Your Message"
        value={contactInfo.message}
        onChange={handleChange}
      />
      {errors.message && <p className="error-message">Please enter a message.</p>}
      <button type="submit" className="submit-button">Send</button>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </form>
  );
};

export default ContactForm;