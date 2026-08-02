import React, { useEffect, useState } from 'react';
import './ScrollCometNav.css';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'story', label: 'Story' },
  { id: 'education', label: 'Education' },
  { id: 'skill', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'project', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

type SectionNode = {
  id: string;
  label: string;
  progress: number;
};

type RailStyle = React.CSSProperties & {
  '--scroll-progress': string;
};

type NodeStyle = React.CSSProperties & {
  '--node-progress': string;
};

const ScrollCometNav = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [nodes, setNodes] = useState<SectionNode[]>(
    sections.map((section, index) => ({
      ...section,
      progress: index / Math.max(sections.length - 1, 1)
    }))
  );

  useEffect(() => {
    let frameId = 0;

    const measure = () => {
      const documentElement = document.documentElement;
      const maxScroll = Math.max(documentElement.scrollHeight - window.innerHeight, 1);
      const currentProgress = clamp(window.scrollY / maxScroll, 0, 1);
      const measuredNodes = sections.map((section, index) => {
        const element = document.getElementById(section.id);
        const top = element
          ? element.getBoundingClientRect().top + window.scrollY
          : (index / Math.max(sections.length - 1, 1)) * maxScroll;
        const isLastNode = index === sections.length - 1;

        return {
          ...section,
          progress: isLastNode ? 1 : clamp(top / maxScroll, 0, 1)
        };
      });

      const activationPoint = window.scrollY + window.innerHeight * 0.42;
      const active = measuredNodes.reduce((current, section) => {
        const element = document.getElementById(section.id);
        if (!element) {
          return current;
        }

        const top = element.getBoundingClientRect().top + window.scrollY;
        return top <= activationPoint ? section.id : current;
      }, measuredNodes[0]?.id || 'home');

      setScrollProgress(currentProgress);
      setNodes(measuredNodes);
      setActiveSection(active);
    };

    const requestMeasure = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure);
    window.addEventListener('load', requestMeasure);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
      window.removeEventListener('load', requestMeasure);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    event.preventDefault();
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      className="comet-scroll-nav"
      aria-label="Page sections"
      style={{ '--scroll-progress': `${scrollProgress * 100}%` } as RailStyle}
    >
      <div className="comet-scroll-track" aria-hidden="true"></div>
      <div className="comet-scroll-head" aria-hidden="true"></div>
      <div className="comet-scroll-nodes">
        {nodes.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`comet-scroll-node${activeSection === section.id ? ' is-active' : ''}`}
            style={{ '--node-progress': `${section.progress * 100}%` } as NodeStyle}
            onClick={(event) => handleClick(event, section.id)}
            aria-label={`Jump to ${section.label}`}
            aria-current={activeSection === section.id ? 'location' : undefined}
          >
            <span className="comet-scroll-label">{section.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default ScrollCometNav;
