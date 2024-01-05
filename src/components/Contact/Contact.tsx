import React, { useRef, useState, FormEvent } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
  // Use useRef with a type argument for the form element
  const form = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Make sure form.current exists before calling emailjs
    if (form.current) {
      emailjs.sendForm('service_cydxpzs', 'template_5wn3g6s', form.current, 'S9RwUyfC3l2lLetcT')
        .then((result) => {
            setMessage('Email Successfully sent!');
            setError('');
            if (form.current) {
                form.current.reset();
            }
        }, (error) => {
            setError('Failed to send email. Please try again later.');
            setMessage('');
            if (form.current) {
                form.current.reset();
            }
        });
    }
  };

  return (
    <div id="contact" className="contact-section">
        <h1 className="section-title">Contact</h1>
        <div className="contact-container">
            <p className="contact-description">
                Need to get in touch for inquiries, collaborations, or job opportunities? Feel free to fill out this form.
            </p>
            <form ref={form} onSubmit={sendEmail} className="contact-form">
                <div className="form-group">
                <label htmlFor="user_name">Your Name</label>
                <input type="text" id="user_name" name="user_name" required />
                </div>
                <div className="form-group">
                <label htmlFor="user_email">Your Email</label>
                <input type="email" id="user_email" name="user_email" required />
                </div>
                <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit" className="send-button">Send</button>
            </form>
            {message && <div className="confirmation-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    </div>
  );
};

export default Contact;
