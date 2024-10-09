import React from 'react';
import './Skills.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faJava } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faCodeBranch, faBolt, faFileCode } from '@fortawesome/free-solid-svg-icons';

const Skills = () => {
    return (
        <div id="skill" className="skills-container">
            <h1 className="section-title">Skills</h1>
            <div className="skills-section">
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
                </div>
            </div>
        </div>
    );
};

export default Skills;