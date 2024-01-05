import React from 'react';
import './Education.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faJava, faReact, faGitAlt } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faMobileAlt, faObjectGroup, faUsers, faCodeBranch, faBolt, faFileCode, faLayerGroup, faFireAlt } from '@fortawesome/free-solid-svg-icons';

const Education = () => {
    return (
        <div id="education" className="education-skills-container">
            <h1 className="section-title">Education</h1>
            <div className="education-section">
                <div className="uni-sub">
                  <h2 className="uni-name">University of Washington</h2>
                  <h3 className="degree-name">B. Sci. in Computer Science and Software Engineering (CSSE) and Minor in Economics</h3>
                  <p>Organizations/Awards: Quarterly and Annually Dean’s Honor List since March 2022</p>
                </div>
                <div className="uni-sub">
                  <h2 className="uni-name">Shoreline Community College</h2>
                  <h3 className="degree-name">A. Art in Computer Science</h3>
                  <p>Organizations/Awards: Graduated with Honor with exceptionally high GPA of 3.82</p>
                </div>
            </div>
            <h1 id="skill" className="section-title">Skills</h1>
            <div className="skills-section">
                {/* Creatively list your skills with icons here */}
                <div className="skill-category">
                  <h2 className="skill-category-title">Programming Languages</h2>
                    {/* Example for skill with icon */}
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
                      <span className="skill-name">C++</span>
                    </div>
                    <span className="skill-proficiency-advanced">Experienced</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faJava} size="lg" />
                      <span className="skill-name">Java</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faDatabase} size="lg" />
                      <span className="skill-name">SQL</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faBolt} size="lg" />
                      <span className="skill-name">Dart</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faFileCode} size="lg" />
                      <span className="skill-name">HTML / CSS / TypeScript</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <h2 className="skill-category-title">Frameworks/Libraries</h2>
                    {/* Example for skill with icon */}
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
                      <span className="skill-name">React</span>
                    </div>
                    <span className="skill-proficiency-beginner">Working on it</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faLayerGroup} size="lg" />
                      <span className="skill-name">React Spring Parallax</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faFireAlt} size="lg" />
                      <span className="skill-name">Firebase</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faGitAlt} size="lg" />
                      <span className="skill-name">Git Version Control (Github)</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faMobileAlt} size="lg" />
                      <span className="skill-name">Responsive Design</span>
                    </div>
                    <span className="skill-proficiency-intermediate">In the groove</span>
                  </div>

                  <h2 className="skill-category-title">Other Skills</h2>
                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faObjectGroup} size="lg"/>
                      <span className="skill-name">UI/UX</span>
                    </div>
                    <span className="skill-proficiency-advanced">Experienced</span>
                  </div>
                    <ul className="skill-items-list">
                      <li>Lucid Chart</li>
                      <li>Canva</li>
                    </ul>
                  
                  <div className="skill-item">
                    <div className="skill-name-icon">
                      <FontAwesomeIcon icon={faUsers} size="lg"/>
                      <span className="skill-name">Soft Skills</span>
                    </div>
                    <span className="skill-proficiency-advanced">Experienced</span>
                  </div>
                    <ul className="skill-items-list">
                      <li>Problem Solving</li>
                      <li>Written Communication</li>
                      <li>Teamwork</li>
                    </ul>
                    {/* Repeat for other skills */}
                </div>
            </div>
            <h1 className="section-title">Volunteering and Community Events</h1>
            <div className="volunteering-section">
                <h2 className="event-name">2023 IEEE Information Reuse and Integration (IRI) for Data Science Conference</h2>
                <h3 className="event-location">--Bothell, Washington</h3>
                <p>Co-hosting the session and assisting presenters with arising technical issues on podium/projectors during the session</p>
            </div>
        </div>
    );
};

export default Education;


