import React from 'react';
import './Education.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faMobileAlt, faCodeBranch, faFileCode, faLayerGroup, faFireAlt } from '@fortawesome/free-solid-svg-icons';

const Education = () => {
    return (
        <div id="education" className="education-skills-container">
            <h1 className="section-title">Education</h1>
            <div className="education-section">
                <div className="education-card">
                  <h2 className="uni-name">University of Washington</h2>
                  <h3 className="degree-name">B. Sci. in Computer Science and Software Engineering (CSSE) and Minor in Economics</h3>
                  <p className = "paragraph"><span className="bolded-title">Organizations/Awards:</span> Quarterly and Annually Dean’s Honor List since March 2022</p>
                  <p className = "paragraph"><span className="bolded-title">Relevant Coursework:</span> Software Engineering; Data Structures, Algorithm and Discrete Maths; Hardware and Computer Organisation; Operating Systems; Databaase Systems; Principle of Human-Computer Interaction</p>
                </div>
                <div className="education-card">
                  <h2 className="uni-name">Shoreline Community College</h2>
                  <h3 className="degree-name">A. Art in Computer Science</h3>
                  <p className = "paragraph"><span className="bolded-title">Organizations/Awards:</span> Graduated with Honor with exceptionally high GPA of 3.82</p>
                </div>
            </div>
            <h1 id="skill" className="section-title">Skills</h1>
            <div className="skills-section">
                {/* Creatively list your skills with icons here */}
                <div className="skill-category">
                  <h2 className="skill-category-title">Programming Languages</h2>
                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faPython} size="lg" />
                      <span className="skill-name">Python</span>
                    </div>
                    <span className="skill-proficiency-advanced">Experienced</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faCodeBranch} size="lg" />
                      <span className="skill-name">C#</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faFileCode} size="lg" />
                      <span className="skill-name">HTML / CSS / TypeScript</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <h2 className="skill-category-title">Database</h2>
                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faDatabase} size="lg" />
                      <span className="skill-name">SQLite</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faDatabase} size="lg" />
                      <span className="skill-name">PostgreSQL</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faDatabase} size="lg" />
                      <span className="skill-name">SQL Server</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <h2 className="skill-category-title">Frameworks/Libraries</h2>
                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faMobileAlt} size="lg" />
                      <span className="skill-name">Flutter</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faReact} size="lg" />
                      <span className="skill-name">Reactjs</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faFileCode} size="lg" />
                      <span className="skill-name">ASP.NET</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faLayerGroup} size="lg" />
                      <span className="skill-name">Blazor .NET</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faFireAlt} size="lg" />
                      <span className="skill-name">Firebase</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Education;
