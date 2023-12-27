import React from 'react';
import './Education.css'
import SkillsBackgroundImage from '../../backgroundImage/educationImage.jpg';

const Education = () => {
  return (
    <div id="education" className="section educationSkillsSection"> {/*  style={{ backgroundImage: `url(${backgroundImage})` }} */}
      <div className="row">
        <div className="educationColumn">
          <h1>Education</h1>
          <h2>University of Washington</h2>
          <h3>B. Sci. in Computer Science and Software Engineering (CSSE) and Minor in Economics</h3>
          <p>Organizations/Awards: Quarterly and Annually Dean’s Honor List since March 2022</p>
          
          <h2>Shoreline Community College</h2>
          <h3>A. Art in Computer Science</h3>
          <p>Organizations/Awards: Graduated with Honor with exceptionally high GPA of 3.82</p>
        </div>
        <div className="imageColumn">
          <img src={SkillsBackgroundImage} alt="Educational Background" />
        </div>
      </div>
      <div className="row">
        <div className="skillsSection">
          <h1>Skills</h1>
          <h2>Programming Languages:</h2>
          <p>Python &nbsp;&nbsp;&nbsp;⭐️⭐️⭐️</p>
          <p>C++ &nbsp;&nbsp;&nbsp;⭐️⭐️</p>
          <p>Java &nbsp;&nbsp;&nbsp;⭐️⭐️</p>
          <p>SQL &nbsp;&nbsp;&nbsp;⭐️⭐️</p>
          <p>Dart &nbsp;&nbsp;&nbsp;(Working on it) ⭐️</p>
          <p>Javascript / HTML / CSS (Working on it) &nbsp;&nbsp;&nbsp;⭐️</p>
          <p>Typescript (Working on it) &nbsp;&nbsp;&nbsp;⭐️</p>
          <h2>Frameworks/Libraries:</h2>
          <p>Flutter &nbsp;&nbsp;&nbsp;⭐️⭐️</p>
          <p>React (Working on it) &nbsp;&nbsp;&nbsp;⭐️</p>
          <h2>Other Skills:</h2>
          <p>UI/UX: Lucid Chart, Canva &nbsp;&nbsp;&nbsp;⭐️⭐️⭐️</p>
          <p>Soft Skills: Problem Solving, Written Communication, Teamwork, Customer Service &nbsp;&nbsp;&nbsp;⭐️⭐️</p>
        </div>
        <div className="volunteerSection">
          <h1>Volunteering and Community Events</h1>
          <h2>2023 IEEE Information Reuse and Integration (IRI) for Data Science Conference</h2>
          <h3>--Bothell, Washington</h3>
          <p>Co-hosting the session and assisting presenters with arising technical issues on podium/projectors during the session</p>
        </div>
      </div>
    </div>
  );
};

export default Education;