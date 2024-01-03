// Home.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface HomeProps {
  scrollPosition: number;
}
  
const Home: React.FC<HomeProps> = ({scrollPosition}) => {
  /* All these are the fading out animation while scrolling! */
  const [h1Style, setH1Style] = useState<React.CSSProperties>({});
  const [h2Style, setH2Style] = useState<React.CSSProperties>({});
  const [h3Style, setH3Style] = useState<React.CSSProperties>({});
  const [pStyle, setPStyle] = useState<React.CSSProperties>({});

  const handleScroll = useCallback(() => {
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
  }, [scrollPosition]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, scrollPosition]);

  const [currentSkill, setCurrentSkill] = useState('');
  const skills = ["Python", "C++", "Java", "SQLite", "Dart", "React", "TypeScript",  "AWS Route 53", "Firebase", "FlutterFlow", "Canva", "Technical Writing", " Lucid Chart"];
  const typingSkill = useTypingEffect(skills, 175, 3000);
  
  /* For the last line (typing animation) */
  useEffect(() => {
    setCurrentSkill(typingSkill);
  }, [typingSkill]);

  /* Fading in animation when page loads */
  // States for controlling the initial fade-in animation
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSecondaryContentVisible, setIsSecondaryContentVisible] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // Triggers fade-in effect for h1 and h2 when the component mounts
    setTimeout(() => {
      setIsSecondaryContentVisible(true); // Triggers fade-in effect for h3, p, and SocialIcons after a delay
    }, 1000); // Adjust this delay to control when the secondary content starts fading in (1000ms = 1s delay)
  }, []);


  return (
    <div id="home" className="section">
    {/* Content for home! */}
    {/* Fade in when page loaded */}
      <h1 className={`${isLoaded ? 'fadeIn' : ''}`} style={h1Style}>Hello, I'm</h1>
      <h2 className={`${isLoaded ? 'fadeIn' : ''}`} style={h2Style}>Kimhour (Andrew) Chou</h2>
      {/* Secondary content to fade in after h1 and h2 */}
      <div className={`${isSecondaryContentVisible ? 'fadeInLater' : 'hide'}`}>
        <h3 style={h3Style}>Recent CSSE Undergrad Student</h3>
        <p style={pStyle}>{currentSkill}</p>
        <SocialIcons />
      </div>
    </div>
  );
};

export default Home;
