import React from 'react';
import './About.css';
import aboutPhoto from '../../backgroundImage/aboutpic.png';

const About = () => {
    return (
        <div id="about" className="about-container">
            <div className="about-content">
                <h1>About</h1>
                <figure className="about-photo-bubble" aria-label="Portrait of Kimhour Chou">
                    <img src={aboutPhoto} alt="Kimhour Chou at the University of Washington" />
                </figure>
                <p>
                Hello! I’m Andrew, an EDI System Admin with a Bachelor of Science in Computer Science and Software Engineering (CSSE) 
                from the University of Washington, along with a minor in Economics. Ever since writing my first “Hello, World!” 
                program, I’ve been fascinated by how software can solve real-world problems. That curiosity continues to drive me today.
                </p>
                <p>
                My career at Costco has given me a unique perspective on technology. I started in the warehouse, where I learned the 
                value of teamwork, problem-solving, and understanding how day-to-day operations keep a business running. Wanting to 
                make a bigger impact through technology, I earned an internship with Costco’s Accounting Technical Services (ATS) 
                team at the Home Office. There, I contributed to enterprise applications using ASP.NET, SQL Server, Power BI, and 
                Blazor while helping modernize internal systems. After completing my internship, I joined Costco full-time as an EDI 
                System Admin, where I continue building technology solutions that support the business behind the scenes.
                </p>
                <p>
                Outside of work, I enjoy building personal projects that let me explore new technologies. Some of my favorites include 
                an AI-powered voice recognition and meeting summary application, a personal finance platform with fraud detection, and 
                other full-stack projects involving Python, machine learning, cloud technologies, and modern web development.
                </p>
                <p>
                Technology never stands still, and neither do I. Whether I’m learning a new framework, experimenting with AI, or 
                contributing to a project, I’m always looking for ways to grow as a developer and build software that makes a meaningful impact.
                </p>
            </div>
        </div>
    );
};

export default About;
