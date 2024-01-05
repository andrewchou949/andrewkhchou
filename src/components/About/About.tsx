import React from 'react';
import './About.css';
import aboutPicture from '../../backgroundImage/about.jpg';

const About = () => {
    return (
        <div id="about" className="about-container">
            <div className="about-content">
                <h1>About</h1>
                <p>
                    Hello, My name is Andrew. I'm a recently graduated student from the
                    University of Washington, Bothell, currently holding a Bachelor of Science
                    degree in Computer Science and Software Engineering (CSSE), complemented
                    by a minor in Economics. Ever since I first coded a "Hello, World!" program,
                    I've been enthralled by the transformative power of software. This initial
                    spark has driven me throughout my academic journey and continues to inspire
                    my aspirations in the tech world. My passion doesn't stop there; I am
                    constantly excited by the ever-evolving landscape of technology. The desire
                    to learn and adapt to new innovations keeps me on my toes and fuels my
                    dedication to the field.
                </p>
            </div>
            <div className="about-image">
                <img src={aboutPicture} alt="Andrew" />
            </div>
        </div>
    );
};

export default About;
