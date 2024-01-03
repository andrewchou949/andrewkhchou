import './App.css';
import Home from './components/Home/Home';
import About from './components/About/About';
import MyStory from './components/MyStory/MyStory';
import Education from './components/Education/Education';
import Project from './components/Project/Project';
import Contact from './components/Contact/Contact';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import React, { useState, useRef } from 'react';
import bgImage from './backgroundImage/sleepynight.jpg';


// For scroll animation (home page, the fading effect)
function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const parallaxRef = useRef<IParallax>(null);

  const handleScroll = () => {
    if (parallaxRef.current) {
      const currentOffset = parallaxRef.current.current / parallaxRef.current.space;
      console.log("Scroll Position: ", currentOffset);
    setScrollPosition(currentOffset);
    }
  };

  return (
    <div className="App">
      <Parallax pages={4} ref={parallaxRef} onScroll={handleScroll}>
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={4}  /* adjust this for spanning multiple pages */ /* Every layer would have a factor of 1 */
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
          }}
        />
        <ParallaxLayer offset={0} speed={1}>
          <Home scrollPosition={scrollPosition}/>
          <About />
          <MyStory />
          <Education />
          <Project />
          <Contact />
        </ParallaxLayer>
      </Parallax>
    </div>
    
  );
}

export default App;
