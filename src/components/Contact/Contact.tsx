import React, { useState, FormEvent, ChangeEvent } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const SERVICE_ID = 'service_odpq0vg';
const TEMPLATE_ID = 'template_5wn3g6s';
const PUBLIC_KEY = 'S9RwUyfC3l2lLetcT';
const CONTACT_EMAIL = 'andrewchou949@gmail.com';

type ContactFormValues = {
  user_name: string;
  user_email: string;
  message: string;
};

const initialFormValues: ContactFormValues = {
  user_name: '',
  user_email: '',
  message: ''
};

const buildMailtoLink = ({ user_name, user_email, message }: ContactFormValues) => {
  const subject = encodeURIComponent(`Portfolio contact from ${user_name || 'Website visitor'}`);
  const body = encodeURIComponent([
    `Name: ${user_name}`,
    `Email: ${user_email}`,
    '',
    message
  ].join('\n'));

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

const getEmailJsErrorDetail = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return '';
  }

  const maybeEmailError = error as { status?: unknown; text?: unknown; message?: unknown };
  const detail = maybeEmailError.text || maybeEmailError.message;
  const status = maybeEmailError.status ? `Status ${maybeEmailError.status}` : '';

  return [status, detail].filter(Boolean).join(': ');
};

const Contact = () => {
  const [formValues, setFormValues] = useState<ContactFormValues>(initialFormValues);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fallbackLink, setFallbackLink] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  };

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');
    setError('');
    setFallbackLink('');

    const templateParams = {
      ...formValues,
      from_name: formValues.user_name,
      from_email: formValues.user_email,
      reply_to: formValues.user_email,
      to_name: 'Andrew Chou'
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setMessage('Email successfully sent!');
      setFormValues(initialFormValues);
    } catch (sendError) {
      const detail = getEmailJsErrorDetail(sendError);
      console.error('EmailJS send failed:', sendError);
      setError(
        detail
          ? `Email service rejected the request. ${detail}`
          : 'Email service rejected the request. You can open an email draft instead.'
      );
      setFallbackLink(buildMailtoLink(formValues));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="contact" className="contact-section">
        <h1 className="section-title">Contact</h1>
        <div className="contact-container">
            <p className="contact-description">
                Need to get in touch for inquiries, collaborations, or job opportunities? Feel free to fill out this form.
            </p>
            <form onSubmit={sendEmail} className="contact-form">
                <div className="form-group">
                <label htmlFor="user_name">Your Name</label>
                <input type="text" id="user_name" name="user_name" value={formValues.user_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                <label htmlFor="user_email">Your Email</label>
                <input type="email" id="user_email" name="user_email" value={formValues.user_email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" value={formValues.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="send-button" disabled={isSending}>{isSending ? 'Sending' : 'Send'}</button>
            </form>
            {message && <div className="confirmation-message">{message}</div>}
            {error && (
              <div className="error-message">
                <span>{error}</span>
                {fallbackLink && <a className="contact-fallback-link" href={fallbackLink}>Open email draft</a>}
              </div>
            )}
        </div>
    </div>
  );
};

export default Contact;
