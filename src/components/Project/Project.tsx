import React from 'react';
import './Project.css';

import projectImage1 from '../../backgroundImage/finance.png'
import projectImage2 from '../../backgroundImage/VoiceRecognition.png'
import projectImage3 from '../../backgroundImage/discordbot.png'
import projectImage4 from '../../backgroundImage/Language Application.png'
import projectImage5 from '../../backgroundImage/PersonalProject.png'
import projectImage6 from '../../backgroundImage/Database.png'

const projectsData =[
    {
    title: 'Personal Finance Management Application with Fraud Detection',
    description: 'Developing an application to help users track expenses and detect fraudulent transactions using machine learning. Implementing user authentication, expense tracking, data visualization, and fraud detection alerts. Utilizing technologies such as Django for backend, React for frontend, and machine learning models for fraud detection. Hosting on AWS for scalable and secure deployment.',
    demoLink: 'https://github.com/andrewchou949/Personal-Finance-Management-Application',
    imageUrl: projectImage1,
    skills: ['Python', 'Django', 'React', 'AWS', 'Machine Learning', 'Data Visualization', 'RESTful API']
    },
    {
    title: 'Voice Recognition/Summary Web App',
    description: 'Leverating the OpenAI Whisper model for precise voice recognition, combined with ChatGPT-3.5 Turbo for efficient summary creation, setting a new standard in user-focused applications. Hosted with Google Cloud CLI for dependable backend operation, scalable API service delivery. The frontend, crafted with Create React App (CRA) and elegantly styled with Tailwind CSS, offers an intuitive and visually appealing user interface.',
    demoLink: 'https://vrfrontend.web.app/',
    imageUrl: projectImage2,
    skills: ['React', 'Tailwind CSS', 'Flask', 'Google Cloud', 'Openai-Whisper', 'ChatGPT3.5-Turbo', 'RESTful API']
    },
    {
    title: 'Discord Bot - Andrew\'s Bot',
    description: 'Andrew\'s Bot is designed to enhance server functionalities through the implementation of slash commands and integration with the Genshin Impact API. This bot provides users with seamless interaction capabilities and real-time access to in-game information. Utilizing JavaScript and the discord.js library, this project demonstrates a robust understanding of bot development and API integration.',
    demoLink: 'https://github.com/andrewchou949/discord-bot',
    imageUrl: projectImage3,
    skills: ['JavaScript', 'discord.js', 'RESTful API', 'Project Management']
    },
    {
    title: 'Polyglot Go', 
    description: 'Polyglot Go, a text-based language learning app, acts as a bridge to enhance language acquisition. This versatile tool offers an engaging experience across various platforms, including iPad, iPhone, and web browsers. Packed with features like Flashcards, Translation, and Word-matching, learners have a robust toolkit at their disposal to enrich their language learning journey.',
    demoLink: 'https://github.com/andrewchou949/Polyglot-Go',
    imageUrl: projectImage4,
    skills: ['FlutterFlow', 'Firebase', 'Dart', 'Lucid Chart', 'Canva', 'Technical Writing']
    },
    {
    title: 'Personal Self Introduction Webpage', 
    description: 'Utilizing React, TypeScript, Firebase, and AWS Route 53, this personal website project is a dynamic showcase of web development and UI/UX design expertise. Experience a seamless, feature-rich user journey that highlights the integration of these cutting-edge tools.',
    demoLink: 'https://github.com/andrewchou949/andrewkhchou',
    imageUrl: projectImage5,
    skills: ['TypeScript', 'Firebase', 'React', 'AWS Route 53', 'DALL-E 3', 'React Spring Parallax', 'Responsive Design']
    },
    {
    title: 'Bank System Database',
    description: 'Created to enhance data management for a class final project, the Banking System Database offers a centralized solution for organizing account details, transaction histories, employee information, and more. This simplifies the retrieval of crucial data, ensuring efficiency in your project\'s execution.',
    demoLink: 'https://drive.google.com/file/d/1XQaFPqE76fcg3tohY20wL8O667U0Qf5X/view?usp=sharing',
    imageUrl: projectImage6,
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