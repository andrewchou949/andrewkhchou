import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set a timeout to change the visibility state after 1000ms
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000); 

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
  }, []);
  return (
    <header className="site-header"  style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
      <div className="header-content">
        <div className="brand">
          <a href="/">Andrew's Space</a>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skill">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#project">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
