import React from 'react';
import './Project.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import polyglot from '../../backgroundImage/CSS 497 Capstone Poster.png'
import entity from '../../backgroundImage/Entity.png'

const Project = () => {
    // For projects Data
    const projectsData =[
        {
        title: 'Polyglot Go (Capstone Project: CSS 497)', 
        description1: 'Problem Statement: In an age where digital learning is paramount, there exists a need for effective and accessible tools for language learning that cater to various platforms. Traditional methods often restrict users to a single platform or lack interactive features that enhance the learning experience.',
        description2: 'Solution: Polyglot Go is a text-based language learning application designed to bridge this gap. It provides users with an interactive experience across multiple platforms, from iPad and iPhone to web browsers. With features like Flashcards, Translation, and Word-matching, learners have a comprehensive toolkit to bolster their language acquisition journey.',
        demoLink: 'https://github.com/andrewchou949/Polyglot-Go',
        skills: ['FlutterFlow', 'Firebase', 'Dart', 'Lucid Chart', 'Canva', 'Technical Writing'],
        image: polyglot,
        imageAlt: 'Polyglot Go Poster'
        },
        {
        title: 'Bank System Database (Class Project: CSS 475)',
        description1: 'Problem Statement: Modern banks are flooded with diverse sets of data, from customer account details to intricate transaction records. The challenge was to design a system that is intuitive and can efficiently manage all these layers of information.',
        description2: 'Solution: We developed the Banking System Database to keep everything tidy. This centralized space organizes account details, transaction histories, employee info, and more, making data retrieval straightforward and efficient.',
        demoLink: 'https://drive.google.com/file/d/1XQaFPqE76fcg3tohY20wL8O667U0Qf5X/view?usp=sharing',
        skills: ['SQLite', 'Lucid Chart', 'Technical Writing'],
        image: entity,
        imageAlt: 'Entity Relationship Diagram'
        }
    ];

    return (
        <div id="projects" className="projects-section">
            <h1>Projects</h1>
            {projectsData.map((project, index) => (
                <div key={index} className="project-row">
                    <ProjectCard
                        title={project.title}
                        description1={project.description1}
                        description2={project.description2}
                        demoLink={project.demoLink}
                        skills={project.skills}
                    />
                    <div className="image-container">
                        <img src={project.image} alt={project.imageAlt} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Project;