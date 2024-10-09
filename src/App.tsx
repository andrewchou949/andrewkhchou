import './App.css';
import Header from './components/Header/Header'
import Home from './components/Home/Home';
import About from './components/About/About';
import MyStory from './components/MyStory/MyStory';
import Education from './components/Education/Education';
// import Skills from './components/Skills/Skills';
// import Volunteering from './components/Volunteering/Volunteering'
import JobExperience from './components/JobExperience/JobExperience';
import Project from './components/Project/Project';
import Contact from './components/Contact/Contact';

function App() {

  return (
    <div className="App">
          <Header />
          <Home/>
          <About />
          <MyStory />
          <Education />
          {/* <Skills />
          <Volunteering /> */}
          <JobExperience />
          <Project />
          <Contact />
    </div>
    
  );
}

export default App;
