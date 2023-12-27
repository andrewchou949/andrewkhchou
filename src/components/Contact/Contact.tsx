import React from 'react';
import './Contact.css';
import ContactForm from '../ContactForm/ContactForm'


const Contact = () => {
    return (
        <div id="contact" className="section contactSection"> {/*  style={{ backgroundImage: `url(${backgroundImage})` }} */}
            <div className="row">
                <div className="contactLeft">
                    <h1>Contact</h1>
                    <p>Need to get in touch for inquiries, collaborations or job opportunities? Feel free to fill out this form 🤝</p>
                </div>
                <div className="contactBoxRight">
                    <ContactForm />
                </div>
            </div>
        </div>

    );
};

export default Contact;