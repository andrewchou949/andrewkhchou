// Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import SocialIcons from '../SocialIcons/SocialIcons';

function useTypingEffect(words: string[], speed = 175, delay = 3000) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);
    const timeoutRef = useRef<number | null>(null); // Specify the type as number | null
  
    useEffect(() => {
      if (subIndex === words[index].length + 1 && !reverse) {
        setReverse(true);
        timeoutRef.current = window.setTimeout(() => {
          setBlink(true);
        }, delay);
        return;
      }
  
      if (subIndex === 0 && reverse) {
        setReverse(false);
        setIndex((prev) => (prev + 1) % words.length);
        return;
      }
  
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      }, speed);
  
      return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, speed, delay]);
  
    useEffect(() => {
      const timeout2 = setTimeout(() => {
        setBlink((prev) => !prev);
      }, 500);
      return () => clearTimeout(timeout2);
    }, [blink]);
  
    return `${words[index].substring(0, subIndex)}`;
  }
  
  const Home = () => {
    const [h1Style, setH1Style] = useState({});
    const [h2Style, setH2Style] = useState({});
    const [h3Style, setH3Style] = useState({});
    const [pStyle, setPStyle] = useState({});
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const homeHeight = document.getElementById('home')?.offsetHeight || window.innerHeight;
  
      const amplifyFactor = 1.5; // adjust this for transition speed!
      const scrollProgress = Math.min((scrollPosition / homeHeight) * amplifyFactor, 1);
  
      setH1Style({
        transform: `translateY(${scrollProgress * -100}%)`,
        opacity: 1 - scrollProgress,
      });
      setH2Style({
        transform: `translateX(${scrollProgress * -100}%)`,
        opacity: 1 - scrollProgress,
      });
      setH3Style({
        transform: `translateX(${scrollProgress * 100}%)`,
        opacity: 1 - scrollProgress,
      });
      setPStyle({
        opacity: 1 - scrollProgress,
      });
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const [currentSkill, setCurrentSkill] = useState('');
    const skills = ["Python", "C++", "Java", "SQLite", "Dart", "Technical Writing", "Firebase", "FlutterFlow", "Canva", " Lucid Chart"];
    const typingSkill = useTypingEffect(skills, 175, 3000);
  
    useEffect(() => {
      setCurrentSkill(typingSkill);
    }, [typingSkill]);
  
    return (
      <div id="home" className="section"> {/*  style={{ backgroundImage: `url(${backgroundImage})` }} */}
        {/* Content for home! */}
        <h1 style={h1Style}>Hello, I'm</h1>
        <h2 style={h2Style}>Kimhour (Andrew) Chou</h2>
        <h3 style={h3Style}>Recent CSSE Undergrad Student</h3>
        <p style={pStyle}>{currentSkill}</p>
        <SocialIcons />
      </div>
    );
  };
  
  export default Home;
