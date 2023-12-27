import React from 'react';
import './About.css'; // Import the corresponding CSS file
import aboutPicture from '../../backgroundImage/about.jpg';

const About = () => {
    return (
      <div id="about" className="section aboutSection"> {/*  style={{ backgroundImage: `url(${backgroundImage})` }} */}
        {/* Content for the About section */}
        <h1 className="aboutTitle">About</h1>
        <div className="row">
          <div className="aboutContent">
            <p>
            Hello, My name is Andrew. I'm a recently graduated student from the University of Washington,
            Bothell, currently holding a Bachelor of Science degree in Computer Science and Software Engineering (CSSE),
            Complemented by a minor in Economics. 

            Ever Since I first coded a "Hello, World!" program, I've been enthralled by the transformative power of
            software. This inital spark has driven me throughout my academic journey and continues to inspire my 
            aspirations in the tech world. My passion doesn't stop there; I am constantly excited by the ever-evolving
            landscape of technology. The desire to learn and adapt to new innovations keeps me on my toes and fuels
            my dedication to the field.
            </p>
          </div>
          <div className="imageContent">
            <img src={aboutPicture} alt="Educational Background" />
          </div>
        </div>
      </div>
    );
  }
  
  export default About;