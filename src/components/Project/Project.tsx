import React from 'react';
import './Project.css';

import projectImage1 from '../../backgroundImage/PersonalProject.png'
import projectImage2 from '../../backgroundImage/Language Application.png'
import projectImage3 from '../../backgroundImage/Database.png'

const projectsData =[
    {
        title: 'Personal Self Introduction Webpage', 
        description: 'Utilizing React, TypeScript, Firebase, and AWS Route 53, this personal website project is a dynamic showcase of web development and UI/UX design expertise. Experience a seamless, feature-rich user journey that highlights the integration of these cutting-edge tools.',
        demoLink: 'https://github.com/andrewchou949/andrewkhchou',
        imageUrl: projectImage1,
        skills: ['TypeScript', 'Firebase', 'React', 'AWS Route 53', 'DALL-E 3', 'React Spring Parallax', 'Responsive Design']
    },
    {
    title: 'Polyglot Go (Capstone Project: CSS 497)', 
    description: 'Polyglot Go, a text-based language learning app, acts as a bridge to enhance language acquisition. This versatile tool offers an engaging experience across various platforms, including iPad, iPhone, and web browsers. Packed with features like Flashcards, Translation, and Word-matching, learners have a robust toolkit at their disposal to enrich their language learning journey.',
    demoLink: 'https://github.com/andrewchou949/Polyglot-Go',
    imageUrl: projectImage2,
    skills: ['FlutterFlow', 'Firebase', 'Dart', 'Lucid Chart', 'Canva', 'Technical Writing']
    },
    {
    title: 'Bank System Database (Class Project: CSS 475)',
    description: 'Created to enhance data management for a class final project, the Banking System Database offers a centralized solution for organizing account details, transaction histories, employee information, and more. This simplifies the retrieval of crucial data, ensuring efficiency in your project\'s execution.',
    demoLink: 'https://drive.google.com/file/d/1XQaFPqE76fcg3tohY20wL8O667U0Qf5X/view?usp=sharing',
    imageUrl: projectImage3,
    skills: ['SQLite', 'Lucid Chart', 'Technical Writing']
    }
];

const Project = () => {
    return (
      <div id="project" className="projects-container">
          <h1 className="project-title">Projects</h1>
          <div className="project-grid">
              {projectsData.map((project, index) => (
                  <div className="project-card" key={index}>
                      <img className="project-image" src={project.imageUrl} alt={project.title} />
                      <h2>{project.title}</h2>
                      <p className="project-description">{project.description}</p>
                      <ul className="project-tech-list">
                          {project.skills.map((tech, techIndex) => (
                              <li className="project-tech-item" key={techIndex}>{tech}</li>
                          ))}
                      </ul>
                      <a className="project-link" href={project.demoLink    } target="_blank" rel="noopener noreferrer">Link</a>
                  </div>
              ))}
          </div>
      </div>
    );
  };
  
  export default Project;