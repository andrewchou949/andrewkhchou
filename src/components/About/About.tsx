import React from 'react';
import './About.css';
import aboutPic from '../../backgroundImage/aboutpic.png'

const About = () => {
    return (
        <div id="about" className="about-container">
            <div className="about-content">
                <h1>About</h1>
                <p>
                Hello, my name is Andrew. I recently graduated from the University of Washington, 
                with a Bachelor of Science degree in Computer Science and Software Engineering (CSSE), complemented 
                by a minor in Economics. From the moment I wrote my first “Hello, World!” program, I have been captivated 
                by the transformative power of software. This initial spark ignited my passion and has driven my academic journey, 
                continuously inspiring my aspirations in the tech world.
                </p>
                <p>
                Throughout my studies, I have actively engaged in various projects and events, including volunteering at IEEE 
                conferences and working on personal projects like a Voice Recognition/Summary Web Application and a Personal 
                Finance Management Application with Fraud Detection. These experiences have honed my skills in machine learning, 
                Python, and full-stack development.
                </p>
                <p>
                I am consistently excited by the ever-evolving landscape of technology. The drive to learn and adapt to new 
                innovations keeps me on my toes and fuels my dedication to the field. My goal is to leverage my skills and experiences 
                to contribute to impactful projects and continue growing as a software engineer.
                </p>
            </div>
            <div className="about-image">
                <img src={aboutPic} alt="Andrew" />
            </div>
        </div>
    );
};

export default About;
