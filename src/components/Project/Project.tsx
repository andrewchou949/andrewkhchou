import React from 'react';
import './Project.css';
import ProjectCard from '../ProjectCard/ProjectCard';

const Project = () => {
    // For projects Data
    const projectsData =[
        {
            title: 'Personal Self Introduction Webpage', 
            description: 'Utilizing React, TypeScript, Firebase, and AWS Route 53, this personal website project is a dynamic showcase of web development and UI/UX design expertise. Experience a seamless, feature-rich user journey that highlights the integration of these cutting-edge tools.',
            demoLink: 'https://github.com/andrewchou949/andrewkhchou',
            skills: ['TypeScript', 'Firebase', 'React', 'AWS Route 53', 'DALL-E 3']
            },
        {
        title: 'Polyglot Go (Capstone Project: CSS 497)', 
        description: 'Polyglot Go, a text-based language learning app, acts as a bridge to enhance language acquisition. This versatile tool offers an engaging experience across various platforms, including iPad, iPhone, and web browsers. Packed with features like Flashcards, Translation, and Word-matching, learners have a robust toolkit at their disposal to enrich their language learning journey.',
        demoLink: 'https://github.com/andrewchou949/Polyglot-Go',
        skills: ['FlutterFlow', 'Firebase', 'Dart', 'Lucid Chart', 'Canva', 'Technical Writing']
        },
        {
        title: 'Bank System Database (Class Project: CSS 475)',
        description: 'Created to enhance data management for a class final project, the Banking System Database offers a centralized solution for organizing account details, transaction histories, employee information, and more. This simplifies the retrieval of crucial data, ensuring efficiency in your project\'s execution.',
        demoLink: 'https://drive.google.com/file/d/1XQaFPqE76fcg3tohY20wL8O667U0Qf5X/view?usp=sharing',
        skills: ['SQLite', 'Lucid Chart', 'Technical Writing']
        }
    ];

    return (
        <div id="projects" className="projects-section">
            <h1>Projects</h1>
            <div className="projects-container">
                {projectsData.map((project, index) => (
                    <ProjectCard
                        key={index}
                        title={project.title}
                        description={project.description}
                        demoLink={project.demoLink}
                        skills={project.skills}
                    />
                ))}
            </div>
        </div>
    );
};

export default Project;