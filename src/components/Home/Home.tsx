import React, { useState, useEffect } from 'react';
import './Home.css';
import HeroWebGL from './HeroWebGL';

const Home = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const skills = ["Python", "C++", "Java", "SQL", "SQL Server", "SQLite", "Dart", "React", "ASP.NET", "Blazor .NET", "TypeScript", "AWS Route 53", "Google Cloud CLI", "Google Firebase", "FlutterFlow", "Canva", "Technical Writing", "Lucid Chart", "Tailwind CSS", "Openai-Whisper", "ChatGPT3.5-Turbo", "Flask", "Linux", "Docker", "RESTful API"];
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(contentTimer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSkillIndex((currentSkillIndex + 1) % skills.length);
    }, 3000); // Rotate skills every 3 seconds

    return () => clearInterval(intervalId);
  }, [currentSkillIndex, skills.length]);

  const contentStyle = showContent ? { opacity: 1, transition: 'opacity 1.5s ease-in-out' } : { opacity: 0 };
  return (
    <div id="home" className="home-container">
      <HeroWebGL />
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="home-stage" style={contentStyle}>
        <div className="scene-copy scene-copy-left">
          <span>Kimhour Chou</span>
          <strong>Costco Wholesale</strong>
        </div>
        <div className="scene-copy scene-copy-right">
          <span>CSSE / UWB</span>
          <strong>EDI System Admin</strong>
        </div>
        <div className="scroll-label">Scroll Down</div>
        <div className="scene-caption">
          <span className="scene-name">Andrew Chou</span>
          <span className="scene-tagline">Aspiring Software Engineer | Technology Enthusiast</span>
          <strong className="scene-skill" key={skills[currentSkillIndex]}>{skills[currentSkillIndex]}</strong>
        </div>
        <div className="hero-stats">
          <div>
            <strong>CSSE</strong>
            <span>UW Graduate</span>
          </div>
          <div>
            <strong>COSTCO</strong>
            <span>ATS Intern</span>
          </div>
          <div>
            <strong>EDI</strong>
            <span>Systems Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
