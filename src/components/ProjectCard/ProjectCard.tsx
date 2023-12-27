import React from 'react';
import './ProjectCard.css'; // Make sure to create a corresponding CSS file for styling

interface ProjectCardProps {
  title: string;
  description1: string;
  description2: string;
  demoLink?: string; // Make demoLink optional
  skills: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description1,
  description2,
  demoLink,
  skills,
}) => {
  return (
    <div className="project-card">
      {demoLink && (
        <a href={demoLink} target="_blank" rel="noopener noreferrer" className="demo-button">Link</a>
      )}
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description1}</p>
        <p className="project-description">{description2}</p>
        <div className="skills-container">
          {skills.map((skill, idx) => <span key={idx} className="skill-box">{skill}</span>)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;