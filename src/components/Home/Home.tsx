import React, { useState, useEffect } from 'react';
import './Home.css';
import SocialIcons from '../SocialIcons/SocialIcons';

const Home = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const skills = ["Python", "C++", "Java", "SQLite", "Dart", "React", "TypeScript",  "AWS Route 53", "Firebase", "FlutterFlow", "Canva", "Technical Writing", " Lucid Chart"];
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
        <h1 className="title">Hello, I'm <span className="name" style={nameStyle}>Kimhour (Andrew) Chou</span></h1>
        <div style={contentStyle}>  
          <h2 className="subtitle">Recent CSSE Undergrad Student</h2>
          <p className="description">Aspiring Software Engineer | Technology Enthusiast | Open to Job Opportunities</p>
          <SocialIcons/>
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