import React, { useState, useEffect } from 'react';
import './Home.css';
import SocialIcons from '../SocialIcons/SocialIcons';
import aboutPic from '../../backgroundImage/aboutpic.png';

const Home = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const skills = ["Python", "C++", "Java", "SQL", "SQL Server", "SQLite", "Dart", "React", "ASP.NET", "Blazor .NET", "TypeScript", "AWS Route 53", "Google Cloud CLI", "Google Firebase", "FlutterFlow", "Canva", "Technical Writing", "Lucid Chart", "Tailwind CSS", "Openai-Whisper", "ChatGPT3.5-Turbo", "Flask", "Linux", "Docker", "RESTful API"];
  const [showName, setShowName] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start showing the name first with a fade-in effect
    setShowName(true);
    // After the name has faded in, start showing the rest of the content
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000); // Adjust the timing as needed
    return () => clearTimeout(contentTimer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSkillIndex((currentSkillIndex + 1) % skills.length);
    }, 3000); // Rotate skills every 3 seconds

    return () => clearInterval(intervalId);
  }, [currentSkillIndex, skills.length]);

  // Inline styles for fade-in animation
  const nameStyle = showName ? { opacity: 1, transition: 'opacity 1s ease-in-out' } : { opacity: 0 };
  const contentStyle = showContent ? { opacity: 1, transition: 'opacity 1.5s ease-in-out' } : { opacity: 0 };

  return (
    <div id="home" className="home-container">
      <div className="content">
        <aside className="profile-card" style={nameStyle}>
          <div className="profile-image-wrap">
            <img src={aboutPic} alt="Andrew Chou" />
          </div>
          <h1 className="title">Andrew <span className="name">(Kimhour) Chou</span></h1>
          <p className="profile-summary">EDI System Admin building practical technology solutions for business operations.</p>
          <SocialIcons/>
        </aside>

        <div className="hero-main" style={contentStyle}>
          <p className="hero-eyebrow">Costco Wholesale</p>
          <h2 className="subtitle">EDI System Admin</h2>
          <p className="description">Aspiring Software Engineer | Technology Enthusiast</p>
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
          <div className="skills-container">
            <div key={skills[currentSkillIndex]} className="skill">
              {skills[currentSkillIndex]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
