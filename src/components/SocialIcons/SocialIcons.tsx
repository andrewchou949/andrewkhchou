import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'; 
/*
, faGithub // Add inside {} of line 3 to use github icon from fontawesome
npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-brands-svg-icons
npm install --save @fortawesome/react-fontawesome
*/
import { faEnvelope, faPaperclip } from '@fortawesome/free-solid-svg-icons'; // npm install @fortawesome/free-solid-svg-icons
import './SocialIcons.css';
import GithubLogo from '../../backgroundImage/Github Neon.png'
import ORCIDLogo from '../../backgroundImage/ORCID.png'

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a href="https://www.linkedin.com/in/andrewkhchou/" target="_blank" rel="noopener noreferrer" title="Want to connect my LinkedIn? 🤝">
        <FontAwesomeIcon icon={faLinkedin} size="2x" />
      </a>
      <a href="mailto:andrewchou949@gmail.com" target="_blank" rel="noopener noreferrer" title="Email Me 📩">
        <FontAwesomeIcon icon={faEnvelope} size="2x" />
      </a>
      <a href="/AndrewKHChou Resume.pdf" download="AndrewKHChou_Resume.pdf" title="Download my Resume here! 😁">
        <FontAwesomeIcon icon={faPaperclip} size="2x" />
      </a>
      <a href="https://github.com/andrewchou949" target="_blank" rel="noopener noreferrer" title="Check out my repos ䷛">
        {/* <FontAwesomeIcon icon={faGithub} size="2x" /> */}
        <img src={GithubLogo} alt="Github Logo" style={{ width: '32px', height: '32px' }} />
      </a>
      <a href="https://orcid.org/0009-0008-2413-3138" target="_blank" rel="noopener noreferrer" title="My ORCID Link in case needed 👏">
        <img src={ORCIDLogo} alt="ORCID Logo" style={{ width: '32px', height: '32px' }} />
      </a>
    </div>
  );
};

export default SocialIcons;